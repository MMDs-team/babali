from django.conf import settings
import os
import logging
from playwright.sync_api import sync_playwright
from threading import Thread
from queue import Queue, Empty

from babali.consts import TEMPLATES_ROOT, TICKETS_ROOT

logger = logging.getLogger(__name__)

DOCUMENT_WRAPPER_NAME = '_document_wrapper.html'
SHUTDOWN_SENTINEL = None


class TicketGenerator:
    """
    Synchronous, thread-safe ticket PDF generator.
    Uses a dedicated worker thread to manage a single, long-lived Playwright browser instance.
    """
    def __init__(self, templates_base_path=TEMPLATES_ROOT, output_base_path=TICKETS_ROOT):
        self.templates_dir = os.path.join(settings.BASE_DIR, templates_base_path)
        self.output_dir_root = os.path.join(settings.BASE_DIR, output_base_path)
        self.job_queue = Queue()
        self.worker_thread = None


    def _playwright_worker(self):
        """The target function for the worker thread."""
        with sync_playwright() as p:
            # Check for a user-defined browser executable path
            executable_path = os.getenv("PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH")
            if executable_path:
                logger.info(f"Using user-provided browser at: {executable_path}")

            browser = p.chromium.launch(
                executable_path=executable_path, # This will be None if env var is not set
                headless=True,
                args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"]
            )
            logger.info("Playwright worker thread started and browser launched.")

            while True:
                job = self.job_queue.get()
                if job is SHUTDOWN_SENTINEL:
                    break
                result_queue, html_path, pdf_path = job["result_queue"], job["html_path"], job["pdf_path"]
                try:
                    context = browser.new_context(viewport={"width": 1920, "height": 1080})
                    page = context.new_page()
                    page.goto(f'file://{os.path.abspath(html_path)}', wait_until='networkidle')
                    page.pdf(path=pdf_path, format='A4', print_background=True, landscape=True, scale=1.1)
                    context.close()
                    result_queue.put(pdf_path)
                except Exception as e:
                    logger.error("PDF generation failed in worker: %s", e, exc_info=True)
                    result_queue.put(e)
                finally:
                    if os.path.exists(html_path):
                        os.remove(html_path)
            browser.close()
            logger.info("Playwright browser closed.")


    def startup(self):
        """Starts the dedicated worker thread."""
        if self.worker_thread is None or not self.worker_thread.is_alive():
            self.worker_thread = Thread(target=self._playwright_worker)
            self.worker_thread.start()


    def shutdown(self):
        """Signals the worker thread to shut down gracefully."""
        if self.worker_thread and self.worker_thread.is_alive():
            self.job_queue.put(SHUTDOWN_SENTINEL)
            self.worker_thread.join()


    def generate_tickets_pdf(self, ticket_template_name, placeholders_map, data_list, ticket_type, output_name):
        """Public method to generate a PDF."""
        if not self.worker_thread or not self.worker_thread.is_alive():
            return None
        safe_output_name = self._sanitize_filename(output_name)
        safe_ticket_type = self._sanitize_filename(ticket_type)
        html_path = self._generate_temp_html(ticket_template_name, placeholders_map, data_list, safe_ticket_type, safe_output_name)
        if not html_path:
            return None
        pdf_path = html_path.replace('.html', '.pdf')
        result_queue = Queue(maxsize=1)
        job = {"html_path": html_path, "pdf_path": pdf_path, "result_queue": result_queue}
        self.job_queue.put(job)
        try:
            result = result_queue.get(timeout=30)
            if isinstance(result, Exception):
                raise result
            return result
        except Empty:
            return None
        except Exception:
            return None


    def _sanitize_filename(self, name):
        return "".join(c for c in name if c.isalnum() or c in "_-.")
    

    def _read_template(self, template_name):
        template_path = os.path.join(self.templates_dir, template_name)
        try:
            with open(template_path, 'r', encoding='utf-8') as f: return f.read()
        except FileNotFoundError:
            return None

    def _substitute_data(self, template_content, placeholder_map, data):
        for placeholder, data_key in placeholder_map.items():
            value = str(data.get(data_key, ''))
            template_content = template_content.replace(placeholder, value)
        return template_content


    def _generate_temp_html(self, ticket_template_name, placeholders_map, data_list, ticket_type, output_name):
        ticket_template_content = self._read_template(ticket_template_name)
        if not ticket_template_content: return None
        all_tickets_html = [self._substitute_data(ticket_template_content, placeholders_map, {k: v for k, v in data.items() if v is not None}) for data in data_list]
        wrapper_content = self._read_template(DOCUMENT_WRAPPER_NAME)
        if not wrapper_content: return None
        final_html = wrapper_content.replace('{{TICKETS_CONTENT}}', ''.join(all_tickets_html))
        final_html = final_html.replace('{{DOCUMENT_TITLE}}', output_name)
        output_dir = os.path.join(self.output_dir_root, ticket_type)
        os.makedirs(output_dir, exist_ok=True)
        html_path = os.path.join(output_dir, f'{output_name}.html')
        try:
            with open(html_path, 'w', encoding='utf-8') as f: f.write(final_html)
            return html_path
        except OSError:
            return None

GENERATOR = TicketGenerator()
