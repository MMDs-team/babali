from django.conf import settings
from django.db import models

import consts


class Agency(models.Model):
    flight_agency_id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=consts.STR_LEN)
    phone = models.CharField(
        max_length=consts.PHONE_NUMBER_LEN,
        validators=[consts.PHONE_NUMBER_VALIDATOR],
        blank=True,
        null=True
    )

    logo = models.ImageField(
        upload_to='logos/',
        blank=True,
        null=True
    )
     
    def __str__(self):
        return self.name


class Airport(models.Model):
    airport_id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=consts.STR_LEN)
    city = models.CharField(max_length=consts.SHORT_STR_LEN)

    address = models.TextField(max_length=consts.LONG_STR_LEN, blank=True, null=True)
    phone = models.CharField(
        max_length=consts.PHONE_NUMBER_LEN,
        validators=[consts.PHONE_NUMBER_VALIDATOR],
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.name} - {self.city}"


class Airplane(models.Model):
    airplane_id = models.AutoField(primary_key=True, editable=False)
    model = models.CharField(max_length=consts.STR_LEN)
    seat_count = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.model} - {self.seat_count} seats";


class Travel(models.Model):
    travel_id = models.AutoField(primary_key=True, editable=False)

    airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name="flight_travels")
    airplane = models.ForeignKey(Airplane, on_delete=models.CASCADE, related_name="flight_travels")
    flight_agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name="flight_travels")

    date_time = models.DateTimeField(blank=True, null=True)
    price = models.PositiveIntegerField(blank=True, null=True)
    dest = models.CharField(max_length=consts.SHORT_STR_LEN, blank=True, null=True)
    origin = models.CharField(max_length=consts.SHORT_STR_LEN, blank=True, null=True)
    terminal_no = models.PositiveIntegerField(blank=True, null=True)
    flight_type = models.CharField(max_length=consts.SHORT_STR_LEN, blank=True, null=True)
    description = models.TextField(max_length=consts.LONG_STR_LEN, blank=True, null=True)
    flight_class = models.CharField(max_length=consts.SHORT_STR_LEN, blank=True, null=True)
    max_loggage_weight = models.PositiveIntegerField(blank=True, null=True)

    seat_stat = models.JSONField(default=dict,  blank=True, null=True)

    capacity = models.IntegerField(blank=True, null=True,
        help_text="If left empty, it will be set to the airpalne's type capacity.")
    
    def get_next_seat(self):
        
        for next_seat in range(1, self.airplane.seat_count + 1):
            if self.seat_stat.get(str(next_seat)) == None:
                return next_seat

        return None

        
    def save(self, *args, **kwargs):

        if self._state.adding:
            self.capacity = self.airplane.seat_count

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Travel ID: {self.travel_id}, Origin: {self.origin}, Destination: {self.dest}"


class Ticket(models.Model):
    STATUS_PENDING = 'P'
    STATUS_ACCEPTED = 'A'
    STATUS_REJECTED = 'R'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_ACCEPTED, 'Accepted'),
        (STATUS_REJECTED, 'Rejected'),
    ]

    ticket_id = models.AutoField(primary_key=True, editable=False)
    
    travel = models.ForeignKey(Travel, on_delete=models.CASCADE, related_name="flight_tickets")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="flight_tickets")

    first_name = models.CharField(max_length=consts.SHORT_STR_LEN, blank=True, null=True)
    last_name = models.CharField(max_length=consts.SHORT_STR_LEN, blank=True, null=True)
    ssn = models.CharField(max_length=consts.SSN_LEN, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    gender = models.BooleanField(blank=True, null=True)

    return_ticket = models.BooleanField(default=False)
    serial = models.IntegerField(blank=True, null=True)
    seat_no = models.PositiveIntegerField(blank=True, null=True)

    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=STATUS_PENDING, blank=True, null=True)
    payment_due_datetime = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Ticket ID: {self.ticket_id}, User: {self.user.username}, Travel ID: {self.travel.travel_id}"
