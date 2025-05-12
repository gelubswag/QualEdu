from django.contrib import admin
from .models import CustomUser, UserRoles

admin.site.register(CustomUser)
admin.site.register(UserRoles)
# Register your models here.
