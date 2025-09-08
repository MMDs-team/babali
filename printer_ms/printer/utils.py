from django.conf import settings
import os
import logging
from pathlib import Path
from playwright.sync_api import sync_playwright
from printer.consts import TEMPLATES_ROOT, TICKETS_ROOT


logger = logging.getLogger(__name__)

DOCUMENT_WRAPPER_NAME = '_document_wrapper.html'

class TicketGenerator:
    """
    Synchronous ticket PDF generator using Playwright (Chromium).
    No async required.
    """
    def __init__(self, templates_base_path=TEMPLATES_ROOT, output_base_path=TICKETS_ROOT):
        self.templates_dir = os.path.join(settings.BASE_DIR, templates_base_path)
        self.output_dir_root = os.path.join(settings.BASE_DIR, output_base_path)
        self.browser = None
        self.playwright = None


    def _sanitize_filename(self, name):
        """Remove unsafe characters from filenames."""
        return "".join(c for c in name if c.isalnum() or c in "_-.")


    def _read_template(self, template_name):
        """Read template file synchronously."""
        template_path = os.path.join(self.templates_dir, template_name)
        try:
            with open(template_path, 'r', encoding='utf-8') as f:
                return f.read()
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

        output_dir = os.path.join(self.output_dir_root, tickets_type)
        os.makedirs(output_dir, exist_ok=True)

        html_path = os.path.join(output_dir, f'{output_name}.html')

        try:
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(final_html)
            return html_path
        except OSError as e:
            logger.error("Failed to write HTML: %s", e)
            return None


    def generate_tickets_pdf(self, tickets_template_name, placeholders_map, tickets_data, tickets_type, output_name):
        """
        Main method: Generate HTML → PDF (synchronously).
        Returns path to PDF or None on failure.
        """
        # Sanitize inputs
        safe_output_name = self._sanitize_filename(output_name)
        safe_tickets_type = self._sanitize_filename(tickets_type)

        html_path = self._generate_temp_html(
            tickets_template_name, placeholders_map, tickets_data,
            safe_tickets_type, safe_output_name
        )
        if not html_path:
            return None

        pdf_path = html_path.replace('.html', '.pdf')

        try:
            self.playwright = sync_playwright().start()

            # Use system Chromium if desired
            executable_path = os.getenv("PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH")

            self.browser = self.playwright.chromium.launch(
                executable_path=executable_path,
                headless=True,
                args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"]
            )

            context = self.browser.new_context(
                viewport={"width": 1920, "height": 1080},
                # Optional: emulate media for print
                # color_scheme="light"
            )
            page = context.new_page()

            # Serve file:// URL
            file_uri = Path(os.path.abspath(html_path)).as_uri()
            page.goto(file_uri, wait_until='networkidle')

            # Generate PDF
            page.pdf(
                path=pdf_path,
                format='A4',
                print_background=True,
                landscape=True,
                scale=1.1
            )

            logger.info("PDF generated: %s", pdf_path)
            return pdf_path

        except Exception as e:
            logger.error("PDF generation failed: %s", str(e))
            return None

        finally:
            # Cleanup
            if self.browser:
                self.browser.close()
            if self.playwright:
                self.playwright.stop()
            if os.path.exists(html_path):
                os.remove(html_path)


GENERATOR = TicketGenerator()
