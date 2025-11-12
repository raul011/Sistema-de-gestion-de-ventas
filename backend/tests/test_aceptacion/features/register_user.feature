Feature: Registro de usuario

  Scenario: Usuario se registra exitosamente
    Given no existe un usuario con email "raul@example.com"
    When el usuario se registra con email "raul@example.com" y contraseña "12345678"
    Then el usuario con email "raul@example.com" debe existir en la base de datos
