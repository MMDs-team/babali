from django.db import models
from django.contrib.auth.models import User

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
