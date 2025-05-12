from django.contrib.auth.models import AbstractUser
from django.db import models


class UserRoles(models.Model):
    """Определение ролей пользователей"""
    role_name = models.CharField(max_length=100, verbose_name='Роль')

    def __str__(self):
        return self.role_name

    class Meta:
        verbose_name = 'Роль'
        verbose_name_plural = 'Роли'
        ordering = ['role_name']


class CustomUser(AbstractUser):
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    role = models.ForeignKey(
        UserRoles,
        on_delete=models.CASCADE,
        verbose_name='Роль',
        null=True,
        blank=True
        )

    def get_full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

    def get_short_name(self) -> str:
        return self.first_name

    def get_email(self) -> str:
        return self.email

    def get_role(self) -> str:
        if self.role is not None:
            return self.role.role_name
        return 'Пользователь'

    def has_role(self, role_name) -> bool:
        if self.role is not None:
            return self.role.role_name == role_name
        return False

    def __str__(self):
        return self.email
