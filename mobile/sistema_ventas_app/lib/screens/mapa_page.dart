import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class MapaScreen extends StatefulWidget {
  const MapaScreen({Key? key}) : super(key: key);

  @override
  State<MapaScreen> createState() => _MapaScreenState();
}

class _MapaScreenState extends State<MapaScreen> {
  GoogleMapController? _mapController;

  // Coordenadas de ejemplo (Av. Bolivia, SCZ)
  final LatLng _ubicacionInicial = const LatLng(-17.7833, -63.1821);

  final List<Map<String, dynamic>> _puntos = [
    {"titulo": "Av. Bolivia", "lat": -17.7833, "lng": -63.1821},
    {"titulo": "Plaza 24 de Septiembre", "lat": -17.782171, "lng": -63.164878},
    {"titulo": "Equipetrol2", "lat": -17.7700, "lng": -63.1800},
    {"titulo": "Equipetrol", "lat": -17.784655, "lng": -63.194590},
    {"titulo": "Equipetrol3", "lat": -17.799519, "lng": -63.180260},
  ];
  late BitmapDescriptor customIcon;
  bool _iconoListo = false;

  @override
  void initState() {
    super.initState();
    _cargarIcono();
  }

  Future<void> _cargarIcono() async {
    final icon = await BitmapDescriptor.fromAssetImage(
      const ImageConfiguration(size: Size(64, 64)),
      'assets/images/tienda3.png',
    );
    setState(() {
      customIcon = icon;
      _iconoListo = true;
    });
  }

  Set<Marker> get _crearMarcadores {
    if (!_iconoListo) return {}; // evita usarlo antes de estar listo
    return _puntos.map((punto) {
      return Marker(
        markerId: MarkerId(punto["titulo"]),
        position: LatLng(punto["lat"], punto["lng"]),
        infoWindow: InfoWindow(title: punto["titulo"]),
        icon: customIcon,
      );
    }).toSet();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // 🌍 Mapa
          GoogleMap(
            initialCameraPosition: CameraPosition(
              target: _ubicacionInicial,
              zoom: 13,
            ),
            myLocationEnabled: true, // muestra el punto azul
            myLocationButtonEnabled: true,
            markers: _crearMarcadores,
            onMapCreated: (controller) {
              _mapController = controller;
            },
          ),

          // ✅ Botón "Listo" abajo
          Positioned(
            top: 30,
            left: 20,
            right: 20,
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(context, _ubicacionInicial);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color.fromARGB(255, 161, 14, 190),
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text(
                "Actualizar ubicación",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
