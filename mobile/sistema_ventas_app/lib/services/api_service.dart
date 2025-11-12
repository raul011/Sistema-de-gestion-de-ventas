import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/product.dart';
import '../models/cuota.dart';
import '../models/category.dart';
import '../models/cart_item.dart';
import '../config/api.dart';

class ApiService {
  // Crear una orden en el backend

  Future<int?> createOrder(
    List<CartItem> cartItems,
    double totalPrice,
    String shippingAddress,
  ) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) throw Exception("Usuario no autenticado");

    final orderData = {
      "shipping_address": shippingAddress,
      "total_price": totalPrice,
      "items": cartItems.map((item) => item.toOrderJson()).toList(),
    };

    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/orders/create/'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(orderData),
    );

    if (response.statusCode == 201) {
      final data = jsonDecode(response.body);
      return data['id'];
    } else {
      print("❌ Error creando orden: ${response.body}");
      return null;
    }
  }

  // Crear un pago para una orden
  Future<bool> createPayment(int orderId, double amount, String method) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) throw Exception("Usuario no autenticado");

    final paymentData = {
      "order_id": orderId,
      "amount": amount,
      "method": method,
    };

    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/payments/create/'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(paymentData),
    );

    if (response.statusCode == 201) {
      return true;
    } else {
      print("❌ Error creando pago: ${response.body}");
      return false;
    }
  }

  // Obtener categorías
  Future<List<Category>> getCategories() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.categories}'),
    );

    if (response.statusCode == 200) {
      final decoded = json.decode(response.body);
      if (decoded is List) {
        return decoded.map((json) => Category.fromJson(json)).toList();
      } else {
        throw Exception('Respuesta inválida: se esperaba una lista');
      }
    } else {
      throw Exception('Error al cargar categorías');
    }
  }

  // Obtener productos
  Future<List<Product>> getProducts({int? categoryId, String? search}) async {
    String url = '${ApiConfig.baseUrl}${ApiConfig.products}';
    List<String> params = [];

    if (categoryId != null) params.add('category=$categoryId');
    if (search != null && search.isNotEmpty) params.add('search=$search');

    if (params.isNotEmpty) {
      url += '?${params.join('&')}';
    }

    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      final decoded = json.decode(response.body);

      if (decoded is List) {
        return decoded.map((json) => Product.fromJson(json)).toList();
      } else if (decoded is Map && decoded.containsKey('results')) {
        return (decoded['results'] as List)
            .map((json) => Product.fromJson(json))
            .toList();
      } else {
        throw Exception('Formato de respuesta inválido');
      }
    } else {
      throw Exception('Error al cargar productos');
    }
  }

  // Obtener producto por ID
  Future<Product> getProductById(int productId) async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.products}$productId/'),
    );

    if (response.statusCode == 200) {
      return Product.fromJson(json.decode(response.body));
    } else {
      throw Exception('Error al cargar detalles del producto');
    }
  }

  // Obtener productos relacionados
  Future<List<Product>> getRelatedProducts(int productId) async {
    final response = await http.get(
      Uri.parse(
        '${ApiConfig.baseUrl}${ApiConfig.relatedProducts}$productId/related/',
      ),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data.map<Product>((json) => Product.fromJson(json)).toList();
    } else {
      throw Exception('Error al cargar productos relacionados');
    }
  }

  // Obtener cuotas de un usuario por su ID
  Future<List<Cuota>> getCuotasPorUsuario(int userId) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) throw Exception("Usuario no autenticado");

    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/cuotas/mis-cuotas/$userId/'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final decoded = json.decode(response.body);

      if (decoded is List) {
        return decoded.map((json) => Cuota.fromJson(json)).toList();
      } else {
        throw Exception('Formato de respuesta inválido: se esperaba una lista');
      }
    } else {
      throw Exception('Error al cargar cuotas: ${response.body}');
    }
  }

  // Agregar este método en tu ApiService class

  Future<int?> createCreditPlan(
    int orderId,
    int weeks,
    double monthlyInterestRate,
  ) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) return null;

      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/credit/credit-plans/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'order': orderId,
          'weeks': weeks,
          'monthly_interest_rate': monthlyInterestRate.toStringAsFixed(2),
        }),
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['id'];
      } else {
        print('Error al crear plan de crédito: ${response.statusCode}');
        print('Response body: ${response.body}');
        return null;
      }
    } catch (e) {
      print('Error en createCreditPlan: $e');
      return null;
    }
  }

  Future<bool> confirmCreditPlan(int creditPlanId) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) throw Exception("Usuario no autenticado");

    final response = await http.post(
      Uri.parse(
        '${ApiConfig.baseUrl}/credit/credit-plans/$creditPlanId/confirm/',
      ),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      print('✅ Plan de crédito confirmado exitosamente');
      return true;
    } else {
      print('❌ Error confirmando plan de crédito: ${response.body}');
      return false;
    }
  }

  Future<List<Cuota>> getCuotas() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token == null) throw Exception("Usuario no autenticado");

    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/credit/installments/'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final decoded = json.decode(response.body);

      if (decoded is Map && decoded.containsKey('results')) {
        return (decoded['results'] as List)
            .map((json) => Cuota.fromJson(json))
            .toList();
      } else {
        throw Exception('Formato de respuesta inválido');
      }
    } else {
      throw Exception('Error al cargar cuotas: ${response.body}');
    }
  }
}
