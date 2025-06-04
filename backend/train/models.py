from django.db import models
from django.core.validators import RegexValidator
from bus.models import UserProfile

phone_number_validator = RegexValidator(
    regex=r'^0\d{10}$',
)

class TrainCooperative(models.Model):
    pass


class Train(models.Model):
    pass


class TrainRoute(models.Model):
    pass


class TrainRouteEdge(models.Model):
    pass


class TrainTravel(models.Model):
    pass


class TrainTicket(models.Model):
    pass