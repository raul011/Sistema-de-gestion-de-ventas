import 'package:flutter/material.dart';
import '../../models/cuota.dart'; // ✅ Importa el modelo

class ExpensesList extends StatelessWidget {
  final List<Cuota> expenses; // ✅ Cambiado de Map a Cuota
  final void Function(Cuota)? onTap; // ✅ Cambiado de Map a Cuota

  const ExpensesList({super.key, required this.expenses, this.onTap});

  @override
  Widget build(BuildContext context) {
    if (expenses.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32.0),
          child: Column(
            children: [
              Icon(Icons.inbox_outlined, size: 64, color: Colors.grey),
              SizedBox(height: 16),
              Text(
                "No hay cuotas disponibles",
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: expenses.length,
      itemBuilder: (context, index) {
        final expense = expenses[index];
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 4,
          child: Ink(
            decoration: const BoxDecoration(
              borderRadius: BorderRadius.all(Radius.circular(12)),
              gradient: LinearGradient(
                colors: [
                  Color.fromARGB(255, 19, 42, 143),
                  Color.fromARGB(255, 20, 125, 200),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: ListTile(
              leading: Icon(
                expense.isPaid ? Icons.check_circle : Icons.receipt_long,
                color: Colors.white,
              ),
              title: Text(
                expense.titulo, // ✅ Usa el getter
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                ),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Monto: Bs. ${expense.monto.toStringAsFixed(2)}", // ✅ Usa el getter
                    style: const TextStyle(color: Colors.white70),
                  ),
                  if (expense.paidAt != null)
                    Text(
                      "Pagado: ${_formatDate(expense.paidAt!)}",
                      style: const TextStyle(
                        color: Colors.white60,
                        fontSize: 12,
                      ),
                    ),
                ],
              ),
              trailing: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color:
                      expense.isPaid
                          ? Colors.green.withOpacity(0.2)
                          : Colors.red.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  expense.estado.toUpperCase(), // ✅ Usa el getter
                  style: TextStyle(
                    color: expense.isPaid ? Colors.green[200] : Colors.red[200],
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
              onTap: () => onTap?.call(expense),
            ),
          ),
        );
      },
    );
  }

  String _formatDate(String date) {
    try {
      final parsedDate = DateTime.parse(date);
      return "${parsedDate.day}/${parsedDate.month}/${parsedDate.year}";
    } catch (e) {
      return date;
    }
  }
}
