from functools import wraps
from typing import Any, List

from django.http.request import HttpRequest
from django.http.response import HttpResponseForbidden, JsonResponse
from django.shortcuts import redirect

from .models import CustomUser, UserRoles


def json_role_required(allowed_roles: List[str] = UserRoles.objects.all()):
    """Декоратор для проверки роли пользователя

    Args:
        allowed_roles (List[str], optional): Список ролей,
        доступных для пользователя. Defaults to UserRoles.objects.all().
    Returns:
        Any: Функция-декоратор
    """
    def decorator(view_func: Any) -> Any:
        @wraps(view_func)
        def wrapper(request: HttpRequest, *args, **kwargs) -> Any:
            print(request.user)

            if not request.user.is_authenticated:
                return JsonResponse({'error': 'Unauthorized'}, status=401)

            user = CustomUser.objects.filter(id=request.user.id).first()

            if not user:
                return JsonResponse({'error': 'Unauthorized'}, status=401)

            if user.get_role() in allowed_roles:
                return view_func(request, *args, **kwargs)

            return JsonResponse({'error': 'Forbidden'}, status=403)
        return wrapper
    return decorator


def http_role_required(allowed_roles: List[str] = UserRoles.objects.all()):
    """Декоратор для проверки роли пользователя

    Args:
        allowed_roles (List[str], optional): Список ролей,
        доступных для пользователя. Defaults to UserRoles.objects.all().
    Returns:
        Any: Функция-декоратор
    """
    def decorator(view_func: Any) -> Any:
        @wraps(view_func)
        def wrapper(request: HttpRequest, *args, **kwargs) -> Any:
            print(request.user)

            if not request.user.is_authenticated:
                return redirect('/login/')

            user = CustomUser.objects.filter(id=request.user.id).first()

            if not user:
                return redirect('/login/')

            if user.get_role() in allowed_roles:
                return view_func(request, *args, **kwargs)

            return HttpResponseForbidden()
        return wrapper
    return decorator
