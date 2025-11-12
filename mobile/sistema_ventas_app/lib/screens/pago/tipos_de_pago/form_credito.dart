import 'package:flutter/material.dart';

class PagoCreditoWidget extends StatefulWidget {
  final double montoBase;
  final Function(int semanas) onSemanasChanged;

  const PagoCreditoWidget({
    Key? key,
    required this.montoBase,
    required this.onSemanasChanged,
  }) : super(key: key);

  @override
  State<PagoCreditoWidget> createState() => _PagoCreditoWidgetState();
}

class _PagoCreditoWidgetState extends State<PagoCreditoWidget> {
  int _semanasSeleccionadas = 4;
  final double _tasaInteresMensual = 0.05; // 5%

  double _calcularPagoSemanal() {
    double tasaSemanal = _tasaInteresMensual / 4;
    double interes = widget.montoBase * tasaSemanal * _semanasSeleccionadas;
    double totalConInteres = widget.montoBase + interes;
    return totalConInteres / _semanasSeleccionadas;
  }

  double _calcularTotalConInteres() {
    double tasaSemanal = _tasaInteresMensual / 4;
    double interes = widget.montoBase * tasaSemanal * _semanasSeleccionadas;
    return widget.montoBase + interes;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Pagar a Crédito',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        const Text(
          'Seleccione el número de semanas para el pago.',
          style: TextStyle(fontSize: 15),
        ),
        const SizedBox(height: 16),
        // Dropdown para seleccionar semanas
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey[400]!),
            borderRadius: BorderRadius.circular(8),
          ),
          child: DropdownButton<int>(
            value: _semanasSeleccionadas,
            isExpanded: true,
            underline: const SizedBox(),
            items:
                [4, 8, 12, 16, 20].map((semanas) {
                  return DropdownMenuItem(
                    value: semanas,
                    child: Text('$semanas semanas'),
                  );
                }).toList(),
            onChanged: (value) {
              setState(() {
                _semanasSeleccionadas = value!;
                widget.onSemanasChanged(_semanasSeleccionadas);
              });
            },
          ),
        ),
        const SizedBox(height: 24),
        // Información del crédito
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.grey[100],
            borderRadius: BorderRadius.circular(8),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Interés mensual: ${(_tasaInteresMensual * 100).toStringAsFixed(0)}%',
                style: const TextStyle(fontSize: 15),
              ),
              const SizedBox(height: 8),
              Text(
                'Cuota a pagar semanal: \$${_calcularPagoSemanal().toStringAsFixed(2)}',
                style: const TextStyle(fontSize: 15),
              ),
              const SizedBox(height: 8),
              Text(
                'Total con interés: \$${_calcularTotalConInteres().toStringAsFixed(2)}',
                style: const TextStyle(fontSize: 15),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        // Total final destacado
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey[300]!, width: 2),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Total final a crédito :',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500),
              ),
              Text(
                '\$${_calcularTotalConInteres().toStringAsFixed(2)} ',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
