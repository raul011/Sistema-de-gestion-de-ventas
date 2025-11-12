import 'package:flutter/material.dart';
import 'package:flutter_stripe/flutter_stripe.dart' as stripe;
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:sistema_ventas_app/services/api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CuotaPagoScreen extends StatefulWidget {
  final Map<String, dynamic> expensa;

  const CuotaPagoScreen({super.key, required this.expensa});

  @override
  State<CuotaPagoScreen> createState() => _CuotaPagoScreenState();
}

class _CuotaPagoScreenState extends State<CuotaPagoScreen> {
  final ApiService _apiService = ApiService();
  String _paymentMethod = 'Tarjeta de Crédito';
  bool _isLoading = false;

  // 🔹 Datos de la tarjeta
  stripe.CardFieldInputDetails? _card;

  // 🔥 Getters que acceden directamente a los campos del modelo Cuota
  int get _cuotaId {
    final v = widget.expensa['id'];
    if (v is int) return v;
    if (v is String) return int.tryParse(v) ?? 0;
    return 0;
  }

  String get _titulo {
    // Primero intenta con 'titulo' (getter calculado)
    if (widget.expensa['titulo'] != null) {
      return widget.expensa['titulo'].toString();
    }
    // Si no existe, construye manualmente desde week_number
    final weekNumber = widget.expensa['week_number'];
    if (weekNumber != null) {
      return 'Semana $weekNumber';
    }
    return 'Cuota #$_cuotaId';
  }

  double get _monto {
    // Primero intenta con 'monto' (getter calculado)
    final monto = widget.expensa['monto'];
    if (monto != null) {
      if (monto is num) return monto.toDouble();
      if (monto is String) {
        final parsed = double.tryParse(monto);
        if (parsed != null) return parsed;
      }
    }

    // Si no existe, intenta con 'amount' (campo original)
    final amount = widget.expensa['amount'];
    if (amount != null) {
      if (amount is num) return amount.toDouble();
      if (amount is String) {
        final parsed = double.tryParse(amount);
        if (parsed != null) return parsed;
      }
    }

    return 0.0;
  }

  String get _estado {
    // Primero intenta con 'estado' (getter calculado)
    if (widget.expensa['estado'] != null) {
      final estado = widget.expensa['estado'].toString().toLowerCase();
      if (estado == 'pagada' || estado == 'pagado') return 'Pagado';
      if (estado == 'pendiente') return 'Pendiente';
    }

    // Si no existe, usa 'is_paid' (campo original)
    final isPaid = widget.expensa['is_paid'];
    if (isPaid is bool) {
      return isPaid ? 'Pagado' : 'Pendiente';
    }

    return 'Pendiente';
  }

  bool get _isPaid {
    // Primero intenta con 'is_paid' (campo original)
    final isPaid = widget.expensa['is_paid'];
    if (isPaid is bool) return isPaid;

    // Si no existe, usa 'estado'
    return _estado == 'Pagado';
  }

  // 🔹 Flujo de pago con Stripe usando CardField
  Future<void> _pagarConStripe() async {
    if (_card == null || !_card!.complete) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("⚠️ Ingresa los datos de la tarjeta")),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      // 1. Solicitar clientSecret al backend
      final response = await http.post(
        Uri.parse("http://192.168.0.184:8000/api/payments/intent/"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"amount": (_monto * 100).toInt()}),
      );

      if (response.statusCode != 200) {
        throw Exception('Error al crear payment intent: ${response.body}');
      }

      final data = jsonDecode(response.body);
      final clientSecret = data['clientSecret'];

      if (clientSecret == null) {
        throw Exception('No se recibió clientSecret del servidor');
      }

      // 2. Confirmar pago con los datos de la tarjeta ingresada
      await stripe.Stripe.instance.confirmPayment(
        paymentIntentClientSecret: clientSecret,
        data: stripe.PaymentMethodParams.card(
          paymentMethodData: const stripe.PaymentMethodData(),
        ),
      );

      // 3. Si el pago es exitoso, registrarlo en la API
      await _registrarPagoEnApi(clientSecret: clientSecret);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("✅ Pago realizado con éxito"),
            backgroundColor: Colors.green,
          ),
        );
        // 🔥 Volver a la pantalla anterior
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("❌ Error en el pago: $e"),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _registrarPagoEnApi({String? clientSecret}) async {
    // 🔹 Traduce el método de pago al valor que espera el backend
    String metodoParaApi;
    switch (_paymentMethod) {
      case 'Tarjeta de Crédito':
        metodoParaApi = 'tarjeta';
        break;
      case 'QR':
        metodoParaApi = 'qr';
        break;
      default:
        metodoParaApi = 'efectivo';
    }

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      final response = await http.post(
        Uri.parse(
          "http://192.168.0.184:8000/api/credit/installments/$_cuotaId/pay/",
        ),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token", // Descomenta cuando tengas JWT
        },
        body: jsonEncode({
          "payment_reference": clientSecret ?? 'manual_payment',
        }),
      );

      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception(
          'Error al registrar el pago: ${response.statusCode} - ${response.body}',
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Error al registrar el pago en el sistema: $e"),
            backgroundColor: Colors.orange.shade800,
          ),
        );
      }
      rethrow;
    }
  }

  // 🔹 Acción del botón según método
  Future<void> _confirmarPago() async {
    if (_isPaid) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("⚠️ Esta cuota ya está pagada"),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    try {
      if (_paymentMethod == 'Tarjeta de Crédito') {
        await _pagarConStripe();
      } else {
        await _registrarPagoEnApi();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                "✅ Pago con $_paymentMethod registrado como pendiente.",
              ),
            ),
          );
          Navigator.pop(context);
        }
      }
    } catch (e) {
      print("Error en el flujo de confirmación de pago: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_titulo),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // 🔹 Card con detalle de expensa
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Detalle de la Cuota',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 20),
                    _buildDetailRow(
                      context,
                      icon: Icons.article_outlined,
                      label: 'Concepto:',
                      value: _titulo,
                    ),
                    const Divider(height: 24),
                    _buildDetailRow(
                      context,
                      icon: Icons.monetization_on_outlined,
                      label: 'Monto:',
                      value: 'Bs. ${_monto.toStringAsFixed(2)}',
                    ),
                    const Divider(height: 24),
                    _buildDetailRow(
                      context,
                      icon:
                          _estado == 'Pagado'
                              ? Icons.check_circle_outline
                              : Icons.hourglass_empty_outlined,
                      label: 'Estado:',
                      value: _estado,
                      valueColor:
                          _estado == 'Pagado'
                              ? Colors.green.shade700
                              : Colors.orange.shade800,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // 🔥 Mostrar selector solo si la cuota no está pagada
            if (!_isPaid) ...[
              // 🔹 Selector de método de pago
              DropdownButtonFormField<String>(
                value: _paymentMethod,
                decoration: const InputDecoration(
                  labelText: 'Método de Pago',
                  border: OutlineInputBorder(),
                ),
                items:
                    const ['Tarjeta de Crédito', 'QR', 'Efectivo']
                        .map((m) => DropdownMenuItem(value: m, child: Text(m)))
                        .toList(),
                onChanged: (value) => setState(() => _paymentMethod = value!),
              ),
              const SizedBox(height: 20),

              // 🔹 Vista dinámica según método
              if (_paymentMethod == 'Tarjeta de Crédito')
                stripe.CardField(
                  key: ValueKey(_paymentMethod),
                  onCardChanged: (card) => setState(() => _card = card),
                ),
              if (_paymentMethod == 'QR')
                Column(
                  children: [
                    const Text('Escanea este código QR para pagar'),
                    const SizedBox(height: 10),
                    QrImageView(
                      data: 'https://tupago.com/qr/cuota/$_cuotaId',
                      version: QrVersions.auto,
                      size: 120.0,
                    ),
                  ],
                ),
              if (_paymentMethod == 'Efectivo')
                const Text(
                  'Debes dejar el dinero en la oficina para confirmar el pago.',
                  style: TextStyle(
                    color: Colors.orange,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),

              const SizedBox(height: 30),

              // 🔹 Botón de confirmación
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _confirmarPago,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color.fromARGB(255, 4, 6, 161),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                  child:
                      _isLoading
                          ? const CircularProgressIndicator(color: Colors.white)
                          : Text(
                            _paymentMethod == 'Tarjeta de Crédito'
                                ? "Pagar con Stripe"
                                : "Confirmar Pago",
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                ),
              ),
            ] else
              // 🔥 Mensaje si ya está pagada
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.green.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.green.shade700),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.check_circle,
                      color: Colors.green.shade700,
                      size: 40,
                    ),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Text(
                        'Esta cuota ya ha sido pagada',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
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

  Widget _buildDetailRow(
    BuildContext context, {
    required IconData icon,
    required String label,
    required String value,
    Color? valueColor,
  }) {
    return Row(
      children: [
        Icon(icon, color: Theme.of(context).colorScheme.primary),
        const SizedBox(width: 16),
        Text(label, style: Theme.of(context).textTheme.titleMedium),
        const Spacer(),
        Flexible(
          child: Text(
            value,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: valueColor,
            ),
            textAlign: TextAlign.end,
          ),
        ),
      ],
    );
  }
}
