TEMPLATES_ROOT = 'printer/templates/'
TICKETS_ROOT = 'static/tickets/'

BUS_TICKET_TYPE = 'bus'
TRAIN_TICKET_TYPE = 'train'
FLIGHT_TICKET_TYPE = 'flight'
TICKET_TYPES = {
    'bus': BUS_TICKET_TYPE,
    'train': TRAIN_TICKET_TYPE,
    'flight': FLIGHT_TICKET_TYPE
}

BUS_TEMPLATE_NAME = 'bus.html'
TRAIN_TEMPLATE_NAME = 'train.html'
FLIGHT_TEMPLATE_NAME = 'flight.html'
TEMPLATE_NAMES = {
    BUS_TICKET_TYPE: BUS_TEMPLATE_NAME,
    TRAIN_TICKET_TYPE: TRAIN_TEMPLATE_NAME,
    FLIGHT_TICKET_TYPE: FLIGHT_TEMPLATE_NAME
}

BUS_PLACEHOLDER_MAP = {
    '<1>': 'first_name',
    '<2>': 'last_name',
    '<3>': 'ssn',
    '<4>': 'date_time',
    '<5>': 'price',
    '<6>': 'origin',
    '<7>': 'dest',
    '<8>': 'seat_no',
    '<9>': 'org_terminal__name',
    '<10>': 'cooperative__name',
    '<11>': 'serial'
}
TRAIN_PLACEHOLDER_MAP = {
    '<1>': 'first_name',
    '<2>': 'last_name',
    '<3>': 'ssn',
    '<6>': 'date_time',
    '<7>': 'price',
    '<8>': 'route__origin_city',
    '<9>': 'route__dest_city',
    '<10>': 'compartment_no',
    '<11>': 'seat_no',
    '<12>': 'cooperative__name',
    '<13>': 'serial'
}
FLIGHT_PLACEHOLDER_MAP = {
    '<1>': 'first_name',
    '<2>': 'last_name',
    '<3>': 'ssn',
    '<4>': 'date_time',
    '<5>': 'flight_type',
    '<6>': 'flight_class',
    '<7>': 'price',
    '<8>': 'origin',
    '<9>': 'dest',
    '<10>': 'seat_no',
    '<11>': 'return_ticket',
    '<12>': 'airport__name',
    '<13>': 'terminal_no',
    '<14>': 'flight_agency__name'
}

PLACEHOLDER_MAPS = {
    BUS_TICKET_TYPE: BUS_PLACEHOLDER_MAP,
    TRAIN_TICKET_TYPE: TRAIN_PLACEHOLDER_MAP,
    FLIGHT_TICKET_TYPE: FLIGHT_PLACEHOLDER_MAP
}