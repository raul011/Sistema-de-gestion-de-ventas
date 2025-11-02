import 'package:flutter/material.dart';

class BienvenidaScreen extends StatelessWidget {
  const BienvenidaScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Spacer(flex: 2),

              // Logo de Mercado Libre
              const Text(
                'Boutique Store',
                style: TextStyle(
                  fontSize: 30,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFFFE600),
                ),
              ),

              const SizedBox(height: 40),

              // Pregunta
              const Text(
                '¿Cómo deseas acceder al sistema?',
                style: TextStyle(fontSize: 22, color: Color(0xFF333333)),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: 60),

              // Imagen del camión
              Image.network(
                'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
                height: 180,
                width: 180,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    height: 180,
                    width: 180,
                    color: Colors.grey[200],
                    child: const Icon(
                      Icons.local_shipping,
                      size: 80,
                      color: Color(0xFFFFE600),
                    ),
                  );
                },
              ),

              const SizedBox(height: 40),

              // Texto de envíos gratis
              const Text(
                'Envíos gratis y en\nmenos de 24 horas',
                style: TextStyle(
                  fontSize: 25,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF333333),
                  height: 1.2,
                ),
                textAlign: TextAlign.center,
              ),

              const Spacer(flex: 3),

              // Botón Entrar como Cliente
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () {
                    // Acción para cliente
                    Navigator.pushReplacementNamed(context, '/home');
                    print('Ingresar como Invitado');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFFFE600),
                    foregroundColor: Colors.black,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    'Ingresar como Visitante',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Botón Entrar como Administrador
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () {
                    // Acción para administrador
                    //Navigator.pushReplacementNamed(context, '/login');
                    Navigator.pushReplacementNamed(context, '/home_adm');
                    print('Entrar como Administrador');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF333333),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    'Eres administrador ?',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                  ),
                ),
              ),

              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
