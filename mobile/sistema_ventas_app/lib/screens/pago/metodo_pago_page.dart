import 'package:flutter/material.dart';
import 'package:sistema_ventas_app/screens/pago/recibo_pago_page.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:sistema_ventas_app/services/api_shared_preferences.dart';
import 'package:sistema_ventas_app/services/cart_service.dart';
import 'package:provider/provider.dart';
import 'package:sistema_ventas_app/services/api_service.dart';
import 'package:sistema_ventas_app/screens/pago/tipos_de_pago/form_tarjeta.dart';
import 'package:sistema_ventas_app/screens/pago/tipos_de_pago/form_efectivo.dart';
import 'package:sistema_ventas_app/screens/pago/tipos_de_pago/form_credito.dart';
import 'package:sistema_ventas_app/screens/pago/tipos_de_pago/form_qr.dart';
import 'package:sistema_ventas_app/services/api_service_notificacion.dart';

// ignore: camel_case_types
class MetodoPagoPage extends StatefulWidget {
  const MetodoPagoPage({Key? key}) : super(key: key);

  @override
  State<MetodoPagoPage> createState() => _MetodoPagoPageState();
}

class _MetodoPagoPageState extends State<MetodoPagoPage> {
  late double montoBase;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    montoBase = ModalRoute.of(context)!.settings.arguments as double;
  }

  String _metodoPagoSeleccionado = 'visa';
  String? _qrGenerado;

  final _titularController = TextEditingController();
  final _numeroTarjetaController = TextEditingController();
  final _fechaVencimientoController = TextEditingController();
  final _cvvController = TextEditingController();

  bool _guardarDatos = false;

  // Variables para crédito
  int _semanasSeleccionadas = 4;
  final double _tasaInteresMensual = 0.05; // 5%
  //final double _montoBase = 140.2;

  @override
  void dispose() {
    _titularController.dispose();
    _numeroTarjetaController.dispose();
    _fechaVencimientoController.dispose();
    _cvvController.dispose();
    super.dispose();
  }

  void _generarQR() {
    setState(() {
      _qrGenerado =
          'https://payment.example.com/qr/${DateTime.now().millisecondsSinceEpoch}';
    });
  }

  // Calcular el pago semanal y total con intereses
  double _calcularPagoSemanal() {
    double tasaSemanal = _tasaInteresMensual / 4;
    double interes = montoBase * tasaSemanal * _semanasSeleccionadas;
    double totalConInteres = montoBase + interes;
    return totalConInteres / _semanasSeleccionadas;
  }

  double _calcularTotalConInteres() {
    double tasaSemanal = _tasaInteresMensual / 4;
    double interes = montoBase * tasaSemanal * _semanasSeleccionadas;
    return montoBase + interes;
  }

  @override
  Widget build(BuildContext context) {
    // final cartService = Provider.of<CartService>(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color.fromARGB(255, 71, 68, 67),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'pagar',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Método de pago header
            Container(
              color: const Color.fromARGB(255, 58, 55, 55),
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Elige un método de pago',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 16),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _metodoPagoButton('visa', 'visa'),
                        const SizedBox(width: 12),
                        _metodoPagoButton('credito1', 'credito1'),
                        const SizedBox(width: 12),
                        _metodoPagoButton('qr', 'qr'),
                        const SizedBox(width: 12),
                        _metodoPagoButton('transferencia', 'efectivo'),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            // Formulario de pago
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Tus datos de pago',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  const SizedBox(height: 16),

                  // Mostrar mensaje para pago en efectivo
                  //if (_metodoPagoSeleccionado == 'transferencia')
                  if (_metodoPagoSeleccionado == 'visa')
                    PagoTarjetaWidget(
                      titularController: _titularController,
                      numeroTarjetaController: _numeroTarjetaController,
                      fechaVencimientoController: _fechaVencimientoController,
                      cvvController: _cvvController,
                      monto: montoBase,
                    )
                  // Mostrar formulario de crédito si está seleccionado
                  else if (_metodoPagoSeleccionado == 'credito1')
                    PagoCreditoWidget(
                      montoBase: montoBase,
                      onSemanasChanged: (semanas) {
                        // Aquí puedes guardar las semanas si las necesitas
                        setState(() {
                          _semanasSeleccionadas = semanas;
                        });
                        // 👇 Esto imprime en la consola de debug
                        print("Semanas seleccionadas: $semanas");
                      },
                    )
                  // Mostrar formulario QR si está seleccionado
                  else if (_metodoPagoSeleccionado == 'qr')
                    PagoQRWidget(monto: montoBase)
                  else if (_metodoPagoSeleccionado == 'transferencia')
                    PagoEfectivoWidget(monto: montoBase),

                  const SizedBox(height: 24),
                  // Monto total (solo mostrar si NO es crédito)

                  // Botón pagar
                  if (_metodoPagoSeleccionado != 'visa')
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () async {
                          String mensaje = '';
                          switch (_metodoPagoSeleccionado) {
                            case 'transferencia':
                              verSharedPreferences();

                              procesarPago(context, 'efectivo');
                              await NotificationApi.sendNotification(
                                title: "Compra registrada 💵",
                                message:
                                    "Tu pedido fue registrado. Pagarás en efectivo al momento de la entrega o retiro en tienda.",
                                notificationType: "info",
                              );

                              break;
                            case 'credito1':
                              procesarPagoCredito(context);
                              await NotificationApi.sendNotification(
                                title: "Compra a crédito aprobada 🧾",
                                message:
                                    "Tu compra a crédito fue aprobada 🎉. Recuerda pagar tu primera cuota antes del vencimiento.",
                                notificationType: "alert",
                              );

                              break;
                            case 'qr':
                              verSharedPreferences();
                              procesarPago(context, 'QR');
                              await NotificationApi.sendNotification(
                                title: "Pago con QR recibido 📱",
                                message:
                                    "Tu pago por QR fue procesado con éxito. Estamos preparando tu pedido 🚚",
                                notificationType: "success",
                              );

                              mensaje = 'Pago con QR procesado';
                              break;
                            case 'visa':
                            default:
                              await NotificationApi.sendNotification(
                                title: "Pago con tarjeta exitoso 💳",
                                message:
                                    "Tu pago fue confirmado correctamente. Tu pedido está en preparación 🚀",
                                notificationType: "success",
                              );

                              mensaje = 'Pago procesado exitosamente';
                              break;
                          }

                          if (mensaje.isNotEmpty && mounted) {
                            ScaffoldMessenger.of(
                              context,
                            ).showSnackBar(SnackBar(content: Text(mensaje)));
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor:
                              _metodoPagoSeleccionado == 'credito1'
                                  ? Colors.green
                                  : Colors.red,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: Text(
                          _metodoPagoSeleccionado == 'credito1'
                              ? 'Confirmar Compra a Crédito'
                              : _metodoPagoSeleccionado == 'transferencia'
                              ? 'Confirmar Pedido (Efectivo)'
                              : _metodoPagoSeleccionado == 'qr'
                              ? 'Confirmar Pago QR'
                              : 'Pagar ahora 🔒',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _metodoPagoButton(String id, String nombreImagen) {
    bool isSelected = _metodoPagoSeleccionado == id;

    return GestureDetector(
      onTap: () => setState(() => _metodoPagoSeleccionado = id),
      child: Container(
        width: 75,
        height: 55,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          border: isSelected ? Border.all(color: Colors.white, width: 2) : null,
          color: Colors.white.withOpacity(0.9),
        ),
        child: Padding(
          padding: const EdgeInsets.all(6),
          child: Image.asset(
            'assets/images/metodo_pago_$nombreImagen.png',
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) {
              return Center(
                child: Icon(Icons.broken_image, color: Colors.grey[400]),
              );
            },
          ),
        ),
      ),
    );
  }

  Future<void> procesarPago(BuildContext context, String metodoPago) async {
    final cartService = Provider.of<CartService>(context, listen: false);
    final theme = Theme.of(context);
    final api = ApiService();

    try {
      final orderId = await api.createOrder(
        cartService.items,
        cartService.total,
        'Calle Ejemplo 123',
      );

      if (orderId != null) {
        final paymentSuccess = await api.createPayment(
          orderId,
          cartService.total,
          //'card',
          metodoPago,
        );

        if (paymentSuccess) {
          cartService.clearCart();
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('Compra realizada con éxito'),
              backgroundColor: theme.colorScheme.primary,
            ),
          );
        } else {
          throw Exception('Error al procesar el pago');
        }
      } else {
        throw Exception('Error al crear la orden');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> procesarPagoCredito(BuildContext context) async {
    final cartService = Provider.of<CartService>(context, listen: false);
    final theme = Theme.of(context);
    final api = ApiService();

    try {
      // 1. Primero crea la orden
      final orderId = await api.createOrder(
        cartService.items,
        cartService.total,
        'Calle Ejemplo 123',
      );

      if (orderId != null) {
        // 2. Luego crea el plan de crédito con el orderId
        final creditPlanSuccess = await api.createCreditPlan(
          orderId,
          _semanasSeleccionadas, // Las semanas que el usuario eligió
          _tasaInteresMensual, // 0.05 (5%)
        );

        if (creditPlanSuccess != null) {
          final confirmSuccess = await api.confirmCreditPlan(creditPlanSuccess);
          print("id de plan de credito: $confirmSuccess");
          cartService.clearCart();
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('Compra a crédito realizada con éxito'),
              backgroundColor: theme.colorScheme.primary,
            ),
          );
        } else {
          throw Exception('Error al crear el plan de crédito');
        }
      } else {
        throw Exception('Error al crear la orden');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }
}
