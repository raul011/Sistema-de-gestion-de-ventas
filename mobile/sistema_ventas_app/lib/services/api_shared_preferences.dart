import 'package:shared_preferences/shared_preferences.dart';

Future<void> verSharedPreferences() async {
  final prefs = await SharedPreferences.getInstance();

  // Obtener todas las keys
  final keys = prefs.getKeys();

  // Crear un mapa con key -> valor
  final prefsMap = <String, dynamic>{};
  for (String key in keys) {
    prefsMap[key] = prefs.get(key); // get() devuelve dynamic
  }

  // Imprimir en consola
  print("----Contenido de SharedPreferences------:");
  prefsMap.forEach((k, v) => print("$k: $v"));
}
