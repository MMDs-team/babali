from django.contrib.auth.models import AbstractUser
from django.db import models

import consts


class User(AbstractUser):
    phone = models.CharField(
        max_length=consts.PHONE_NUMBER_LEN,
        validators=[consts.PHONE_NUMBER_VALIDATOR],
        primary_key=True
    )

    def __str__(self):
        return f"{self.username} - {self.phone}"