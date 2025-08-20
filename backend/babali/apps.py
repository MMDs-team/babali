from django.apps import AppConfig
import atexit

class BabaliConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'babali'

    def ready(self):
        from babali.utils.tickets import GENERATOR 
        GENERATOR.startup()

        atexit.register(GENERATOR.shutdown)