class Cuota {
  final int id;
  final int weekNumber;
  final String amount;
  final bool isPaid;
  final String? paidAt;
  final String? paymentReference;

  Cuota({
    required this.id,
    required this.weekNumber,
    required this.amount,
    required this.isPaid,
    this.paidAt,
    this.paymentReference,
  });

  factory Cuota.fromJson(Map<String, dynamic> json) {
    return Cuota(
      id: json['id'],
      weekNumber: json['week_number'],
      amount: json['amount'],
      isPaid: json['is_paid'],
      paidAt: json['paid_at'],
      paymentReference: json['payment_reference'],
    );
  }

  // ✅ Getters útiles para tu UI
  String get titulo => 'Semana $weekNumber';

  double get monto => double.tryParse(amount) ?? 0.0;

  String get estado => isPaid ? 'pagada' : 'pendiente';

  // 🔹 Convierte el objeto a JSON incluyendo los getters calculados
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'week_number': weekNumber,
      'amount': amount,
      'is_paid': isPaid,
      'paid_at': paidAt,
      'payment_reference': paymentReference,
      // ✅ Agrega los getters calculados para que estén disponibles
      'titulo': titulo, // 'Semana X'
      'monto': monto, // valor numérico
      'estado': estado, // 'pagada' o 'pendiente'
    };
  }
}
