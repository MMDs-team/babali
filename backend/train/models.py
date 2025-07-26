from django.conf import settings
from django.db import models

import consts


class Cooperative(models.Model):
    cooperative_id = models.AutoField(primary_key=True, editable=False)

    name = models.CharField(max_length=consts.STR_LEN, blank=True, null=True)
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
        return self.name or f"Cooperative ID: {self.cooperative_id}"


class Train(models.Model):
    train_id = models.AutoField(primary_key=True, editable=False)

    stars = models.PositiveSmallIntegerField(blank=True, null=True)
    compartment_capacity = models.PositiveIntegerField(blank=True, null=True)
    compartment_count = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return f"Train ID: {self.train_id}"


class Route(models.Model):
    route_id = models.AutoField(primary_key=True, editable=False)

    origin_city = models.CharField(max_length=consts.SHORT_STR_LEN, blank=True, null=True)
    dest_city = models.CharField(max_length=consts.SHORT_STR_LEN, blank=True, null=True)
    edge_identifiers = models.JSONField(default=list, blank=True, null=True)

    def __str__(self):
        if self.origin_city and self.dest_city:
            return f"Route from {self.origin_city} to {self.dest_city}"
        return f"Route ID: {self.route_id}"


class RouteEdge(models.Model):
    route_edge_id = models.AutoField(primary_key=True, editable=False)
    
    origin_city = models.CharField(max_length=consts.SHORT_STR_LEN, blank=True, null=True)
    dest_city = models.CharField(max_length=consts.SHORT_STR_LEN, blank=True, null=True)
    duration = models.DurationField()

    def __str__(self):
        return f"Edge ID: {self.route_edge_id}, Origin: {self.origin_city}, Destination: {self.dest_city}"


class Travel(models.Model):
    travel_id = models.AutoField(primary_key=True, editable=False)

    train = models.ForeignKey(Train, on_delete=models.CASCADE, related_name="train_travels")
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="train_travels")
    cooperative = models.ForeignKey(Cooperative, on_delete=models.CASCADE, related_name="train_travels")

    date_time = models.DateTimeField(blank=True, null=True)
    capacity = models.IntegerField(blank=True, null=True)
    description = models.TextField(max_length=consts.LONG_STR_LEN, blank=True, null=True)
    price = models.PositiveIntegerField(blank=True, null=True)
    
    def __str__(self):
        return f"Travel ID: {self.travel_id}, Origin: {self.route.origin}, Destination: {self.route.dest}"


class Ticket(models.Model):
    ticket_id = models.AutoField(primary_key=True, editable=False)
    
    travel = models.ForeignKey(Travel, on_delete=models.CASCADE, related_name="train_tickets")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="train_tickets")

    serial = models.IntegerField(blank=True, null=True)
    ssn = models.CharField(max_length=consts.SSN_LEN, blank=True, null=True)
    campartment_no = models.PositiveIntegerField(blank=True, null=True)
    seat_no = models.PositiveIntegerField(blank=True, null=True)
    gender = models.BooleanField(blank=True, null=True)

    def __str__(self):
        return f"Ticket ID: {self.ticket_id}, User: {self.user.username}, Travel ID: {self.travel.travel_id}"