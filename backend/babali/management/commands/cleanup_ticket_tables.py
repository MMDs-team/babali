from django.core.management.base import BaseCommand
from django.utils import timezone

from bus.models import Ticket as BusTicket
from train.models import Ticket as TrainTicket
from flight.models import Ticket as FlightTicket


class Command(BaseCommand):
    help = 'Deletes pending tickets from the database where the payment due time has expired.'

    def handle(self, *args, **options):
        self.stdout.write("Starting cleanup of expired pending tickets...")
        now = timezone.now()
        total_deleted_count = 0

        ticket_models_to_clean = [
            BusTicket,
            TrainTicket,
            FlightTicket,
        ]

        for model in ticket_models_to_clean:
            model_name = model.__name__
            try:
                # We only target tickets that are still 'Pending'.
                expired_tickets_qs = model.objects.filter(
                    status=model.STATUS_PENDING,
                    payment_due_datetime__lt=now
                )
                
                # delete() -> bulk_delete
                deleted_count, _ = expired_tickets_qs.delete()

                if deleted_count > 0:
                    self.stdout.write(
                        self.style.SUCCESS(f"Deleted {deleted_count} expired {model_name}(s).")
                    )
                    total_deleted_count += deleted_count
            
            except Exception as e:
                # Catching potential errors during the database operation.
                self.stderr.write(
                    self.style.ERROR(f"An error occurred while cleaning {model_name}(s): {e}")
                )

        if total_deleted_count == 0:
            self.stdout.write("No expired pending tickets found to delete.")
            
        self.stdout.write("Expired ticket cleanup finished.")