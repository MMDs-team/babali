from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

phone_number_validator = RegexValidator(
    regex=r'^0\d{10}$',
)


class UserProfile(AbstractUser):
    phone_number = models.CharField(
        max_length=11,
        validators=[phone_number_validator],
        primary_key=True
    )

    def __str__(self):
        return f"{self.user.username} - {self.phone_number}"


class Cooperative(models.Model):
    cooperative_id = models.AutoField(primary_key=True, editable=False)
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


class Terminal(models.Model):
    terminal_id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=50)
    city = models.CharField(max_length=25)
    address = models.TextField()
    phone = models.CharField(
        max_length=11,
        validators=[phone_number_validator],
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.name} - {self.city}"


class Bus(models.Model):
    bus_id = models.AutoField(primary_key=True, editable=False)
    type = models.CharField(max_length=50)
    seat_count = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.type} - {self.seat_count} seats";


class Travel(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name="travels")
    terminal = models.ForeignKey(Terminal, on_delete=models.CASCADE, related_name="travels")
    cooperative = models.ForeignKey(Cooperative, on_delete=models.CASCADE, related_name="travels")

    def __str__(self):
        pass

class Ticket(models.Model):
    pk = models.CompositePrimaryKey("user_id", "travel_id")
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="tickets")
    travel = models.ForeignKey(Travel, on_delete=models.CASCADE, related_name="tickets")

    def __str__(self):
        pass
