from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Role, Permission

User = get_user_model()  # obtiene tu modelo de usuario actual

@receiver(post_migrate)
def create_default_roles_permissions_and_user(sender, **kwargs):
    # Solo ejecutar para la app 'roles'
    if sender.name != 'roles':
        return

    # Crear permisos por defecto
    perms = [
        {'name': 'Ver productos', 'codename': 'view_products'},
        {'name': 'Editar órdenes', 'codename': 'edit_orders'},
        {'name': 'Ver órdenes', 'codename': 'view_orders'},
    ]
    for p in perms:
        Permission.objects.get_or_create(name=p['name'], codename=p['codename'])

    # Crear roles por defecto
    roles = [
        {'name': 'Admin', 'perms': ['view_products', 'edit_orders', 'view_orders']},
        {'name': 'Empleado', 'perms': ['view_products', 'view_orders']},
        {'name': 'Cliente', 'perms': ['view_products']},
    ]
    for r in roles:
        role_obj, created = Role.objects.get_or_create(name=r['name'])
        for codename in r['perms']:
            perm = Permission.objects.get(codename=codename)
            role_obj.permissions.add(perm)

    # Crear un usuario por defecto para cada rol
    default_users = [
        {'username': 'admin', 'email': 'admin@example.com', 'password': 'admin123', 'role': 'Admin', 'is_staff': True, 'is_superuser': True},
        {'username': 'empleado', 'email': 'empleado@example.com', 'password': 'empleado123', 'role': 'Empleado'},
        {'username': 'cliente', 'email': 'cliente@example.com', 'password': 'cliente123', 'role': 'Cliente'},
    ]

    for u in default_users:
        user_obj, created = User.objects.get_or_create(
            username=u['username'],
            defaults={
                'email': u['email'],
                'is_staff': u.get('is_staff', False),
                'is_superuser': u.get('is_superuser', False),
            }
        )
        if created:
            user_obj.set_password(u['password'])
            user_obj.save()

        # Asignar rol
        role_obj = Role.objects.get(name=u['role'])
        user_obj.role = role_obj
        user_obj.save()
