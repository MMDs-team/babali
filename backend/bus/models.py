from django.conf import settings
from django.db import models

import consts


class Cooperative(models.Model):
    cooperative_id = models.AutoField(primary_key=True, editable=False)
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


class Terminal(models.Model):
    terminal_id = models.AutoField(primary_key=True, editable=False)
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


class Bus(models.Model):

    TYPE_CHOICES = [
        ('vip', 'VIP'),
        ('man-vip', 'MAN-VIP'),
        ('classic', 'CLASSIC')
    ]

    bus_id = models.AutoField(primary_key=True, editable=False)
    type = models.CharField(max_length=consts.STR_LEN, choices=TYPE_CHOICES, default='VIP')
    seat_count = models.PositiveIntegerField(blank=True, null=True,
        help_text="If left empty, it will be set to the bus's type capacity.")

    def save(self, *args, **kwargs):
        if self.type == 'vip':
            self.seat_count = 25
        elif self.type == 'man-vip':
            self.seat_count = 26
        else:
            self.seat_count = 36

        super().save(*args, **kwargs)
            

    def __str__(self):
        return f"{self.type} - {self.seat_count} seats"


class Travel(models.Model):
    travel_id = models.AutoField(primary_key=True, editable=False)

    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name="travels")
    terminal = models.ForeignKey(Terminal, on_delete=models.CASCADE, related_name="travels")
    cooperative = models.ForeignKey(Cooperative, on_delete=models.CASCADE, related_name="travels")

    origin = models.CharField(max_length=consts.SHORT_STR_LEN, blank=True, null=True)
    dest = models.CharField(max_length=consts.SHORT_STR_LEN, blank=True, null=True)
    date_time = models.DateTimeField(blank=True, null=True)
    price = models.PositiveIntegerField(blank=True, null=True)
    description = models.TextField(max_length=consts.LONG_STR_LEN, blank=True, null=True)
    capacity = models.IntegerField(blank=True, null=True,
        help_text="If left empty, it will be set to the bus's type capacity.")
    
    seat_stat = models.JSONField(default=dict,  blank=True, null=True)

    def save(self, *args, **kwargs):
        if self._state.adding:
            self.capacity = self.bus.seat_count

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
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tickets")
    travel = models.ForeignKey(Travel, on_delete=models.CASCADE, related_name="tickets")

    first_name = models.CharField(max_length=consts.SHORT_STR_LEN, blank=True, null=True)
    last_name = models.CharField(max_length=consts.SHORT_STR_LEN, blank=True, null=True)
    ssn = models.CharField(max_length=consts.SSN_LEN, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    gender = models.BooleanField(blank=True, null=True)

    serial = models.IntegerField(blank=True, null=True)
    seat_no = models.PositiveIntegerField(blank=True, null=True)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=STATUS_PENDING, blank=True, null=True)
    payment_due_datetime = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Ticket ID: {self.ticket_id}, User: {self.user.username}, Travel ID: {self.travel.travel_id}"