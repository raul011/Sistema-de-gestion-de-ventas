import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class NotificationApi {
  static const String baseUrl = "http://192.168.0.184:8000/api/fcm/send/";

  static Future<void> sendNotification({
    //required int userId,
    required String title,
    required String message,
    required String notificationType,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final url = Uri.parse(baseUrl);

    final response = await http.post(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({
        //"user_id": userId,
        "title": title,
        "message": message,
        "notification_type": notificationType,
      }),
    );

    if (response.statusCode == 200) {
      print("✅ Notificación enviada: ${response.body}");
    } else {
      print("❌ Error: ${response.statusCode} - ${response.body}");
    }
  }
}
