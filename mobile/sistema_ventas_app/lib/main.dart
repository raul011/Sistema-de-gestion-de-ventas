import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sistema_ventas_app/screens/bienvenida_screen.dart';
import 'package:sistema_ventas_app/screens/pago/recibo_pago_page.dart';

import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

import 'services/cart_service.dart';
import 'services/api_service.dart';

import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'screens/cart_screen.dart';
import 'package:permission_handler/permission_handler.dart';
import 'screens/estadistica_screen.dart';
import 'screens/bottom_navigation.dart';
import 'screens/pago/metodo_pago_page.dart';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_stripe/flutter_stripe.dart' hide Card;

final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
    FlutterLocalNotificationsPlugin();

// This needs to be a top-level function (not inside a class)
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  if (Firebase.apps.isEmpty) {
    await Firebase.initializeApp();
  }
  print("Handling a background message: ${message.messageId}");
  // Mostrar notificación local también en background
  const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
    'default_channel',
    'Notificaciones',
    importance: Importance.max,
    priority: Priority.high,
  );

  const NotificationDetails notificationDetails = NotificationDetails(
    android: androidDetails,
  );

  flutterLocalNotificationsPlugin.show(
    0,
    message.notification?.title,
    message.notification?.body,
    notificationDetails,
  );
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final cartService = CartService();
  await cartService.loadCart();
  try {
    await Firebase.initializeApp();
    // Inicializar notificaciones locales
    const AndroidInitializationSettings androidInitSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    const InitializationSettings initSettings = InitializationSettings(
      android: androidInitSettings,
    );
    await flutterLocalNotificationsPlugin.initialize(initSettings);
  } catch (e) {
    print("Error inicializando Firebase: $e");
  }
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  // Registrar handler de foreground
  FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    print("📩 Foreground message: ${message.notification?.title}");

    const AndroidNotificationDetails androidDetails =
        AndroidNotificationDetails(
          'default_channel',
          'Notificaciones',
          importance: Importance.max,
          priority: Priority.high,
        );
    const NotificationDetails notificationDetails = NotificationDetails(
      android: androidDetails,
    );

    flutterLocalNotificationsPlugin.show(
      0,
      message.notification?.title,
      message.notification?.body,
      notificationDetails,
    );
  });
  //await Firebase.initializeApp();

  try {
    Stripe.publishableKey =
        "pk_test_51Rr2tML8ccCTVK8L6OPnA6cckVYWdmha7rK26Jb8Z8UntW6dsYvcDxY88PR9nPiBOkZLJ8naIBIvZfdg2gsfMmm1004xhsQvv1";

    await Stripe.instance.applySettings();
    print("✅inicializado correctamente: ");
  } catch (e) {
    print("❌Error al configurar Stripe: $e");
  }

  runApp(MyApp(cartService: cartService));
}

class MyApp extends StatelessWidget {
  final CartService cartService;

  const MyApp({super.key, required this.cartService});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<CartService>.value(
      value: cartService,
      child: MaterialApp(
        title: 'Mi Tienda',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color.fromARGB(255, 85, 158, 218),
          ),
          fontFamily: 'Roboto',
        ),
        // No usamos el builder para el micrófono, será manejado en cada pantalla
        initialRoute:
            '/', // Establece la ruta inicial para BottomNavBar mostrando el carrito
        routes: {
          '/': (context) => const LoginScreen(), // Login sin micrófono
          //'/': (context) => const BienvenidaScreen() , // Login sin micrófono
          '/bottom_nav_cart':
              (context) => const BottomNavBar(
                initialPageIndex: 1,
              ), // BottomNavBar iniciando con CartScreen (índice 1)
          '/bottom_nav_sucursales':
              (context) => const BottomNavBar(
                initialPageIndex: 0,
              ), // BottomNavBar iniciando con CartScreen (índice 1)
          '/login': (context) => const LoginScreen(), // Login sin micrófono
          '/home':
              //  (context) => const HomeScreenWithVoice(), // Home con micrófono
              (context) => BottomNavBar(), // Login sin micrófono
          '/cart':
              (context) => const CartScreenWithVoice(), // Cart con micrófono
          '/home_adm':
              // (context) => const StatisticsScreen(), // Cart con micrófono
              (context) => BottomNavBar(), // Cart con micrófono
          '/carrito':
              (context) => const CartScreenWithVoice(), // Cart con micrófono
          '/metodo_pago':
              (context) => const MetodoPagoPage(), // Cart con micrófono
          '/recibo_pago': (context) => const ReciboPedidoPage(),
        },
      ),
    );
  }
}

// Wrapper para HomeScreen que incluye el micrófono
class HomeScreenWithVoice extends StatelessWidget {
  const HomeScreenWithVoice({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        const HomeScreen(), // La pantalla original
        const VoiceFloatingButton(), // El botón de micrófono
      ],
    );
  }
}

// Wrapper para CartScreen que incluye el micrófono
class CartScreenWithVoice extends StatelessWidget {
  const CartScreenWithVoice({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        const CartScreen(), // La pantalla original
        const VoiceFloatingButton(), // El botón de micrófono
      ],
    );
  }
}

class VoiceFloatingButton extends StatefulWidget {
  const VoiceFloatingButton({super.key});

  @override
  State<VoiceFloatingButton> createState() => _VoiceFloatingButtonState();
}

class _VoiceFloatingButtonState extends State<VoiceFloatingButton> {
  late stt.SpeechToText _speech;
  bool _isListening = false;

  @override
  void initState() {
    super.initState();
    _speech = stt.SpeechToText();
  }

  Future<void> _listen() async {
    bool available = await _speech.initialize(
      onStatus: (status) {
        if (status == 'done' || status == 'notListening') {
          setState(() => _isListening = false);
        }
      },
      onError: (error) {
        setState(() => _isListening = false);
        debugPrint('Error de reconocimiento: $error');
      },
    );

    if (available) {
      setState(() => _isListening = true);

      _speech.listen(
        onResult: (result) async {
          if (result.finalResult) {
            final command = result.recognizedWords.toLowerCase();
            debugPrint('Comando reconocido: $command');

            // --- NUEVA LÓGICA PARA COMANDOS ESPECÍFICOS ---
            if (command.contains('ver carrito')) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Navegando al carrito...')),
              );
              Navigator.pushNamed(context, '/bottom_nav_cart');
              setState(() => _isListening = false);
              _speech.stop();
              return; // Salir de la función después de manejar el comando
            }
            if (command.contains('ver sucursales')) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Navegando al carrito...')),
              );
              Navigator.pushNamed(context, '/bottom_nav_sucursales');
              setState(() => _isListening = false);
              _speech.stop();
              return; // Salir de la función después de manejar el comando
            }
            if (command.contains('confirmar compra')) {
              final cartService = Provider.of<CartService>(
                context,
                listen: false,
              );
              if (cartService.items.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Tu carrito está vacío para confirmar.'),
                  ),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Procediendo al pago...')),
                );
                Navigator.pushNamed(
                  context,
                  '/metodo_pago',
                  arguments: cartService.total,
                );
              }
              setState(() => _isListening = false);
              _speech.stop();
              return;
            }

            // --- FIN NUEVA LÓGICA ---

            // Procesamos el comando de voz
            if (command.isNotEmpty) {
              try {
                // Buscamos el producto directamente por el comando completo
                final products = await ApiService().getProducts(
                  search: command,
                );

                if (products.isNotEmpty) {
                  // Encontramos un producto, lo agregamos al carrito
                  final cartService = Provider.of<CartService>(
                    context,
                    listen: false,
                  );

                  // Asegúrate de llamar a saveCart después de addItem
                  cartService.addItem(products.first);

                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        '${products.first.name} agregado al carrito',
                      ),
                      backgroundColor: Colors.green.shade700,
                      behavior: SnackBarBehavior.floating,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      duration: const Duration(seconds: 2),
                    ),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('No se encontró producto para "$command"'),
                      backgroundColor: Colors.orange,
                    ),
                  );
                }
              } catch (e) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Error al buscar productos: $e'),
                    backgroundColor: Colors.red,
                  ),
                );
              }
            }

            setState(() => _isListening = false);
            _speech.stop();
          }
        },
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('El reconocimiento de voz no está disponible'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: 20,
      right: 20,
      child: FloatingActionButton(
        backgroundColor: _isListening ? Colors.redAccent : Colors.blueAccent,
        onPressed: _listen,
        child: Icon(
          _isListening ? Icons.mic : Icons.mic_none,
          color: Colors.white,
        ),
      ),
    );
  }
}
