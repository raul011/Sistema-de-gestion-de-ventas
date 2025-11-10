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
        # Productos
        'Ver productos', 'Agregar productos', 'Editar productos', 'Eliminar productos',
        # Categorías
        'Ver categorías', 'Agregar categorías', 'Editar categorías', 'Eliminar categorías',
        # Compras
        'Ver compras', 'Agregar compras', 'Editar compras', 'Eliminar compras',
        # Ventas
        'Ver ventas', 'Agregar ventas', 'Editar ventas', 'Eliminar ventas',
        # Proveedores
        'Ver proveedores', 'Agregar proveedores', 'Editar proveedores', 'Eliminar proveedores',
        # Usuarios
        'Ver usuarios', 'Agregar usuarios', 'Editar usuarios', 'Eliminar usuarios',
        # Roles
        'Ver roles', 'Agregar roles', 'Editar roles', 'Eliminar roles',
        # Permisos
        'Ver permisos', 'Agregar permisos', 'Editar permisos', 'Eliminar permisos',
        # Reportes
        'Ver reportes', 'Generar reportes'
    ]

    # Crear permisos en la base de datos
    for perm_name in perms:
        Permission.objects.get_or_create(name=perm_name)

    # Definir roles con sus permisos
    roles = [
        {
            'name': 'SuperAdmin',
            'perms': perms,  # todos los permisos
        },
        {
            'name': 'Admin',
            'perms': [p for p in perms if p not in ['Agregar roles', 'Agregar permisos']],
        },
        {
            'name': 'Ayudante',
            'perms': [
                'Ver productos', 'Ver categorías', 'Ver compras',
                'Ver ventas', 'Ver reportes', 'Ver proveedores'
            ],
        },
    ]

    # Crear roles y asignar permisos
    for r in roles:
        role_obj, created = Role.objects.get_or_create(name=r['name'])
        role_obj.permissions.clear()  # limpiar permisos antiguos
        for perm_name in r['perms']:
            perm = Permission.objects.get(name=perm_name)
            role_obj.permissions.add(perm)

    # Crear usuarios por defecto para cada rol
    default_users = [
        {'username': 'superadmin', 'email': 'superadmin@example.com', 'password': '12345678', 'role': 'SuperAdmin', 'is_staff': True, 'is_superuser': True},
        {'username': 'admin', 'email': 'admin@example.com', 'password': '12345678', 'role': 'Admin'},
        {'username': 'ayudante', 'email': 'ayudante@example.com', 'password': '12345678', 'role': 'Ayudante'},
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
