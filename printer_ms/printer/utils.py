from django.conf import settings
import os
import logging
from pathlib import Path
from playwright.sync_api import sync_playwright, Error, Browser
import threading

from printer.consts import TEMPLATES_ROOT, TICKETS_ROOT

logger = logging.getLogger(__name__)

DOCUMENT_WRAPPER_NAME = '_document_wrapper.html'


class BrowserManager:
    """A thread-safe singleton to manage Playwright browser instances."""
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            # Use thread-local storage to hold browser instances for each thread
            cls._instance.thread_local = threading.local()
        return cls._instance

    def _start_for_current_thread(self):
        """Initializes a Playwright instance for the currently active thread."""
        logger.info(f"Starting browser for thread {threading.get_ident()}...")
        try:
            playwright = sync_playwright().start()
            executable_path = os.getenv("PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH")
            browser = playwright.chromium.launch(
                executable_path=executable_path,
                headless=True,
                args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"]
            )
            # Store the instances in the thread's local storage
            self.thread_local.playwright = playwright
            self.thread_local.browser = browser
            logger.info(f"Browser started successfully for thread {threading.get_ident()}.")
        except Error as e:
            logger.error(f"Could not start browser for thread {threading.get_ident()}: {e}")
            self.thread_local.playwright = None
            self.thread_local.browser = None

    def get_browser(self) -> Browser | None:
        """
        Provides a browser instance for the current thread.
        Starts a new one if it doesn't exist for this thread.
        """
        browser = getattr(self.thread_local, 'browser', None)
        if not browser or not browser.is_connected():
            self._start_for_current_thread()
        
        return getattr(self.thread_local, 'browser', None)


class TicketGenerator:
    """
    Generates ticket PDFs using a managed, thread-safe browser instance.
    """
    def __init__(self, templates_base_path=TEMPLATES_ROOT, output_base_path=TICKETS_ROOT):
        self.base_dir = Path(settings.BASE_DIR)
        self.templates_dir = self.base_dir / templates_base_path
        self.output_dir_root = self.base_dir / output_base_path
        self.browser_manager = BrowserManager()

    def _sanitize_filename(self, name):
        """Remove unsafe characters from filenames."""
        return "".join(c for c in name if c.isalnum() or c in "_-.")

    def _read_template(self, template_name):
        """Read template file synchronously."""
        template_path = self.templates_dir / template_name
        try:
            return template_path.read_text(encoding='utf-8')
        except FileNotFoundError:
            logger.error("Template not found: %s", template_path)
            return None

    def _substitute_data(self, template_content, placeholder_map, data):
        """Replace placeholders in template."""
        for placeholder, data_key in placeholder_map.items():
            value = str(data.get(data_key, ''))
            template_content = template_content.replace(placeholder, value)
        return template_content

    def _generate_temp_html(self, tickets_template_name, placeholders_map, tickets_data, tickets_type, output_name):
        """Generate a temporary HTML file with all tickets."""
        ticket_template_content = self._read_template(tickets_template_name)
        if not ticket_template_content:
            return None

        all_tickets_html = [
            self._substitute_data(ticket_template_content, placeholders_map, {key: value for key, value in data.items() if value is not None})
            for data in tickets_data
        ]

        wrapper_content = self._read_template(DOCUMENT_WRAPPER_NAME)
        if not wrapper_content:
            return None

        final_html = wrapper_content.replace('{{TICKETS_CONTENT}}', ''.join(all_tickets_html))
        final_html = final_html.replace('{{DOCUMENT_TITLE}}', output_name)

        output_dir = self.output_dir_root / tickets_type
        output_dir.mkdir(parents=True, exist_ok=True)

        html_path = output_dir / f'{output_name}.html'

        try:
            html_path.write_text(final_html, encoding='utf-8')
            return html_path
        except OSError as e:
            logger.error("Failed to write HTML: %s", e)
            return None

    def generate_tickets_pdf(self, tickets_template_name, placeholders_map, tickets_data, tickets_type, output_name):
        """
        Main method: Generate HTML → PDF using the thread-safe browser instance.
        """
        browser = self.browser_manager.get_browser()
        if not browser:
            # The get_browser method will log the detailed error
            return None

        safe_output_name = self._sanitize_filename(output_name)
        safe_tickets_type = self._sanitize_filename(tickets_type)
        html_path = None
        context = None

        try:
            html_path = self._generate_temp_html(
                tickets_template_name, placeholders_map, tickets_data,
                safe_tickets_type, safe_output_name
            )
            if not html_path:
                return None

            pdf_path = html_path.with_suffix('.pdf')
            context = browser.new_context(
                viewport={"width": 1920, "height": 1080},
            )
            page = context.new_page()

            file_uri = html_path.resolve().as_uri()
            page.goto(file_uri, wait_until='networkidle')

            page.pdf(
                path=pdf_path,
                format='A4',
                print_background=True,
                landscape=True,
                scale=1.1
            )

            # Create the path relative to the project's base directory
            relative_pdf_path = pdf_path.relative_to(self.base_dir)

            logger.info("PDF generated: %s", relative_pdf_path)
            return str(relative_pdf_path)

        except Exception as e:
            logger.error("PDF generation failed: %s", str(e))
            return None

        finally:
            if context:
                context.close()
            if html_path and html_path.exists():
                html_path.unlink()


# The BrowserManager now handles browser instances on-demand for each thread.
# A single generator instance is created for the application to use.
GENERATOR = TicketGenerator()