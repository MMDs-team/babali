from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator

class UserProfile(models.Model):

    phone_number_validator = RegexValidator(
        regex=r'^0\d{10}$',
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(
        min_length=11,
        max_length=11,
        validators=[phone_number_validator],
    )

    def __str__(self):
        return f"{self.user.username} - {self.phone_number}"

class Cooperative(models.Model):
     
     
    def __str__(self):
        pass


class Terminal(models.Model):

    def __str__(self):
        pass


class Bus(models.Model):

    def __str__(self):
        pass


class Travel(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name="travels")
    terminal = models.ForeignKey(Terminal, on_delete=models.CASCADE, related_name="travels")
    cooperative = models.ForeignKey(Cooperative, on_delete=models.CASCADE, related_name="travels")

    def __str__(self):
        pass

class Ticket(models.Model):
    pk = models.CompositePrimaryKey("user_id", "travel_id")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tickets")
    travel = models.ForeignKey(Travel, on_delete=models.CASCADE, related_name="tickets")

    def __str__(self):
        pass
