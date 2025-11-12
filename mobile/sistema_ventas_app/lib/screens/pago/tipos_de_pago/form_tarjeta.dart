import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:http/http.dart' as http;
import 'package:sistema_ventas_app/services/api_service_notificacion.dart';
import 'package:sistema_ventas_app/services/cart_service.dart';
import 'package:provider/provider.dart';

class PagoTarjetaWidget extends StatefulWidget {
  final TextEditingController titularController;
  final TextEditingController numeroTarjetaController;
  final TextEditingController fechaVencimientoController;
  final TextEditingController cvvController;
  final double monto;
  final VoidCallback?
  onPaymentSuccess; // Callback para notificar el éxito del pago
  final Function(String)? onPaymentError; // Callback para notificar errores

  const PagoTarjetaWidget({
    Key? key,
    required this.titularController,
    required this.numeroTarjetaController,
    required this.fechaVencimientoController,
    required this.cvvController,
    required this.monto,
    this.onPaymentSuccess,
    this.onPaymentError,
  }) : super(key: key);

  @override
  State<PagoTarjetaWidget> createState() => _PagoTarjetaWidgetState();
}

class _PagoTarjetaWidgetState extends State<PagoTarjetaWidget> {
  // Datos de la tarjeta
  CardFieldInputDetails? _card;
  bool _isProcessing = false;

  // 🔹 Procesar pago con Stripe
  Future<void> _procesarPagoStripe() async {
    final cartService = Provider.of<CartService>(context, listen: false);

    if (_card == null || !_card!.complete) {
      widget.onPaymentError?.call(
        'Por favor, completa los datos de la tarjeta.',
      );
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Por favor, completa los datos de la tarjeta.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() => _isProcessing = true);

    try {
      // 1. Solicitar clientSecret al backend
      final response = await http.post(
        Uri.parse("http://192.168.0.184:8000/api/payments/intent/"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "amount": (widget.monto * 100).toInt(), // Convertir a centavos
        }),
      );

      if (response.statusCode != 200) {
        throw Exception('Error al crear el PaymentIntent: ${response.body}');
      }

      final data = jsonDecode(response.body);
      final clientSecret = data['clientSecret'];

      // 2. Confirmar pago en Stripe
      await Stripe.instance.confirmPayment(
        paymentIntentClientSecret: clientSecret,
        data: const PaymentMethodParams.card(
          paymentMethodData: PaymentMethodData(),
        ),
      );

      // 3. Si el pago es exitoso
      widget.onPaymentSuccess?.call();

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("✅ Pago confirmado exitosamente."),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      final errorMessage = "❌ Error en el pago: $e";
      widget.onPaymentError?.call(errorMessage);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(errorMessage), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isProcessing = false);
      }
    }
    Navigator.pushReplacementNamed(context, '/recibo_pago');
    cartService.clearCart();
    await NotificationApi.sendNotification(
      title: "Pago con tarjeta exitoso 💳",
      message:
          "Tu pago fue confirmado correctamente. Tu pedido está en preparación 🚀",
      notificationType: "success",
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Información de la tarjeta con Stripe
        const SizedBox(height: 8),

        // Widget para el campo de la tarjeta de Stripe
        CardField(
          key: ValueKey("2"),
          onCardChanged: (card) {
            print('Card changed: $card');
            setState(() => _card = card);
          },
          enablePostalCode: true,

          decoration: const InputDecoration(
            border: OutlineInputBorder(),
            labelText: 'Información de la tarjeta',
          ),
        ),

        const SizedBox(height: 16),

        // Monto total
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.grey[100],
            borderRadius: BorderRadius.circular(8),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Monto total",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 8),
              Text(
                '\$${widget.monto.toStringAsFixed(2)} USD',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.black87,
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 24),

        // Botón de pago
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color.fromARGB(255, 4, 6, 161),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(30),
              ),
            ),
            onPressed: _isProcessing ? null : _procesarPagoStripe,
            child:
                _isProcessing
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text(
                      'Procesar Pago',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
          ),
        ),
      ],
    );
  }
}
