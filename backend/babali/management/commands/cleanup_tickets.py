import os
import time
from django.core.management.base import BaseCommand
from django.conf import settings

from babali.consts import TICKETS_ROOT, TICKET_TYPES


CLEANUP_AGE_SECONDS = 10 * 60
class Command(BaseCommand):
    help = 'Deletes old ticket PDF files from the static directory.'

    def handle(self, *args, **options):
        self.stdout.write("Starting cleanup of old ticket PDFs...")
        
        tickets_dir = os.path.join(settings.BASE_DIR, TICKETS_ROOT)
        now = time.time()
        
        if not os.path.isdir(tickets_dir):
            self.stdout.write(self.style.WARNING(f"Ticket directory not found: {tickets_dir}"))
            return

        for ticket_type in TICKET_TYPES.values():
            dir_path = os.path.join(settings.BASE_DIR, TICKETS_ROOT, ticket_type)
            if not os.path.exists(dir_path): continue
            for filename in os.listdir(dir_path):
                if filename.lower().endswith(".pdf"):
                    file_path = os.path.join(dir_path, filename)
                    try:
                        file_mod_time = os.path.getmtime(file_path)
                        
                        if (now - file_mod_time) > CLEANUP_AGE_SECONDS:
                            os.remove(file_path)
                            self.stdout.write(self.style.SUCCESS(f"Deleted old ticket: {filename}"))
                            
                    except OSError as e:
                        self.stderr.write(self.style.ERROR(f"Error deleting file {file_path}: {e}"))

        self.stdout.write("Ticket cleanup finished.")
