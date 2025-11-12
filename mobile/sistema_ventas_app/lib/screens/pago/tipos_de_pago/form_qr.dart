import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

class PagoQRWidget extends StatefulWidget {
  final double monto;

  const PagoQRWidget({Key? key, required this.monto}) : super(key: key);

  @override
  State<PagoQRWidget> createState() => _PagoQRWidgetState();
}

class _PagoQRWidgetState extends State<PagoQRWidget> {
  String? _qrGenerado;

  void _generarQR() {
    setState(() {
      _qrGenerado =
          'https://payment.example.com/qr/${DateTime.now().millisecondsSinceEpoch}';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const Text(
          'Escanea el código QR para pagar',
          style: TextStyle(fontWeight: FontWeight.w500, fontSize: 14),
        ),
        const SizedBox(height: 16),
        Center(
          child:
              _qrGenerado == null
                  ? Container(
                    width: 200,
                    height: 200,
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey[300]!, width: 2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Center(
                      child: Text(
                        'QR no generado',
                        style: TextStyle(color: Colors.grey[600]),
                      ),
                    ),
                  )
                  : Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey[300]!, width: 2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: QrImageView(
                      data: _qrGenerado!,
                      version: QrVersions.auto,
                      size: 200.0,
                    ),
                  ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: _generarQR,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text(
              'Generar QR',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(height: 24),
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
                '\$${widget.monto}',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.black87,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
