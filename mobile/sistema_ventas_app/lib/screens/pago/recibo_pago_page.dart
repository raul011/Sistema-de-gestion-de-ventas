import 'package:flutter/material.dart';
//import 'package:ihc_app/pages/navigation/home/home_page.dart';
import 'package:lottie/lottie.dart';

class ReciboPedidoPage extends StatefulWidget {
  const ReciboPedidoPage({Key? key}) : super(key: key);

  @override
  State<ReciboPedidoPage> createState() => _ReciboPedidoPageState();
}

class _ReciboPedidoPageState extends State<ReciboPedidoPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.red,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Recibo pedido',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 40),
              // Checkmark animado
              SizedBox(
                width: 150,
                height: 150,
                child: Lottie.asset(
                  'assets/animaciones/Success.json',
                  repeat: false, // solo una vez
                  animate: true,
                ),
              ),

              const SizedBox(height: 24),
              // Título
              const Text(
                '¡Compra realizada!',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 24,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 32),
              // Detalles del pedido
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.grey[50],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey[200]!),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Productos
                    _detalleItem(
                      'Detergente Ariel 1 kilo 28',
                      'Subtotal: 46 Bs',
                    ),
                    const SizedBox(height: 12),
                    _detalleItem('Jabón Bolvar 3 unid 5s Bs', ''),
                    const Divider(height: 24),
                    // Resumen de costos
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Envios: Gratis',
                          style: TextStyle(fontSize: 14, color: Colors.grey),
                        ),
                        const SizedBox(width: 16),
                        Text(
                          'Total: 46 Bs',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                            color: Colors.grey[700],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    // Dirección de entrega
                    const Text(
                      'Dirección de entrega',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Av. San Martín s/12, Santa Cruz\nMétodo de pago\nPago contra entrega',
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey,
                        height: 1.6,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Botones de acción
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pushReplacementNamed(context, '/home');

                    /*
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => HomePage()),
                    );

                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Volviendo a comprar...')),
                    );
                    */
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green[600],
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    'Seguir comprando',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              // Nota de notificación
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Te enviaremos una notificación cuando tu pedido   \n esté en camino',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                ],
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _detalleItem(String producto, String detalle) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          producto,
          style: const TextStyle(fontSize: 14, color: Colors.grey),
        ),
        if (detalle.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Text(
              detalle,
              style: const TextStyle(fontSize: 13, color: Colors.grey),
            ),
          ),
      ],
    );
  }
}
