import 'package:flutter/material.dart';
import '../../models/cuota.dart';
import '../../widgets/cuota/cuotas_list.dart';
import '../../widgets/cuota/payment_panel.dart';
import 'package:sistema_ventas_app/services/api_service.dart';
import './cuota_pago_screen.dart';

class CuotaScreen extends StatefulWidget {
  const CuotaScreen({super.key});

  @override
  State<CuotaScreen> createState() => _CuotaScreenState();
}

class _CuotaScreenState extends State<CuotaScreen> {
  final ApiService _apiService = ApiService();
  List<Cuota> _cuotas = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    cargarCuotas();
  }

  Future<void> cargarCuotas() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final cuotas = await _apiService.getCuotas();
      setState(() {
        _cuotas = cuotas;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = "Error al cargar cuotas: $e";
        _isLoading = false;
      });
      print("Error al cargar Cuotas: $e");
    }
  }

  // ✅ Usa isPaid en lugar de estado
  double get _totalPendiente => _cuotas
      .where((c) => !c.isPaid) // ← Cuotas NO pagadas
      .fold(0.0, (sum, c) => sum + c.monto); // 🔥 Agregué "sum +"

  double get _totalPagado => _cuotas
      .where((c) => c.isPaid) // ← Cuotas pagadas
      .fold(0.0, (sum, c) => sum + c.monto);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Pago de Cuotas",
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.black.withOpacity(0.8),
        elevation: 0,
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment.topLeft,
            radius: 1.5,
            colors: [
              Color.fromARGB(255, 28, 29, 28),
              Color.fromARGB(255, 57, 61, 40),
              Color.fromARGB(255, 28, 29, 28),
            ],
            stops: [0.0, 0.5, 1.0],
          ),
        ),
        child:
            _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _error != null
                ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.error_outline,
                        color: Colors.red,
                        size: 60,
                      ),
                      const SizedBox(height: 16),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Text(
                          _error!,
                          style: const TextStyle(color: Colors.red),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        onPressed: cargarCuotas,
                        icon: const Icon(Icons.refresh),
                        label: const Text("Reintentar"),
                      ),
                    ],
                  ),
                )
                : RefreshIndicator(
                  onRefresh: cargarCuotas,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(12),
                    child: ConstrainedBox(
                      constraints: BoxConstraints(
                        minHeight: MediaQuery.of(context).size.height,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          PaymentPanel(
                            totalPendiente: _totalPendiente,
                            totalPagado: _totalPagado,
                          ),
                          const SizedBox(height: 12),
                          Text(
                            "Cuotas (${_cuotas.length})",
                            style: Theme.of(context).textTheme.titleMedium
                                ?.copyWith(color: Colors.white),
                          ),
                          const SizedBox(height: 8),
                          ExpensesList(
                            expenses: _cuotas,
                            onTap: (cuota) {
                              // 🔥 Navegación corregida
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder:
                                      (context) => CuotaPagoScreen(
                                        expensa: cuota.toJson(),
                                      ),
                                ),
                              ).then((_) {
                                // 🔥 Recargar cuotas al volver
                                cargarCuotas();
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
      ),
    );
  }
}
