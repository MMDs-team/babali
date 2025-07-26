from django.core.validators import RegexValidator


# Model constants
PHONE_NUMBER_LEN = 11
PHONE_NUMBER_VALIDATOR = RegexValidator(
    regex=r'^0\d{10}$',
)

SSN_LEN = 10

SHORT_STR_LEN = 25
STR_LEN = 50
LONG_STR_LEN = 250


# View constants:
PENDING_TICKET_MINS = 15