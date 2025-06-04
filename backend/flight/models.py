from django.db import models
from django.core.validators import RegexValidator
from bus.models import UserProfile

phone_number_validator = RegexValidator(
    regex=r'^0\d{10}$',
)

class FlightAgency(models.Model):
    flight_agency_id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=50)
    phone = models.CharField(
        max_length=11,
        validators=[phone_number_validator],
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
    name = models.CharField(max_length=50)
    city = models.CharField(max_length=25)

    address = models.TextField(max_length=250, blank=True, null=True)
    phone = models.CharField(
        max_length=11,
        validators=[phone_number_validator],
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.name} - {self.city}"


class Airplane(models.Model):
    airplane_id = models.AutoField(primary_key=True, editable=False)
    model = models.CharField(max_length=50)
    seat_count = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.model} - {self.seat_count} seats";


class FlightTravel(models.Model):
    travel_id = models.AutoField(primary_key=True, editable=False)

    airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name="flight_travels")
    airplane = models.ForeignKey(Airplane, on_delete=models.CASCADE, related_name="flight_travels")
    flight_agency = models.ForeignKey(FlightAgency, on_delete=models.CASCADE, related_name="flight_travels")

    capacity = models.IntegerField(blank=True, null=True)
    date_time = models.DateTimeField(blank=True, null=True)
    price = models.PositiveIntegerField(blank=True, null=True)
    dest = models.CharField(max_length=25, blank=True, null=True)
    origin = models.CharField(max_length=25, blank=True, null=True)
    terminal_no = models.PositiveIntegerField(blank=True, null=True)
    flight_type = models.CharField(max_length=25, blank=True, null=True)
    description = models.TextField(max_length=250, blank=True, null=True)
    flight_class = models.CharField(max_length=25, blank=True, null=True)
    max_loggage_weight = models.PositiveIntegerField(blank=True, null=True)
    
    def __str__(self):
        return f"Travel ID: {self.travel_id}, Origin: {self.origin}, Destination: {self.dest}"


class FlightTicket(models.Model):
    ticket_id = models.AutoField(primary_key=True, editable=False)
    
    travel = models.ForeignKey(FlightTravel, on_delete=models.CASCADE, related_name="flight_tickets")
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="flight_tickets")

    return_ticket = models.BooleanField(default=False)
    gender = models.BooleanField(blank=True, null=True)
    serial = models.IntegerField(blank=True, null=True)
    ssn = models.CharField(max_length=10, blank=True, null=True)
    seat_no = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return f"Ticket ID: {self.ticket_id}, User: {self.user.username}, Travel ID: {self.travel.travel_id}"