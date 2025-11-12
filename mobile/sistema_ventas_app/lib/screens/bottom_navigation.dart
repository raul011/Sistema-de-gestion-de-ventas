import 'package:flutter/material.dart';
import 'package:curved_navigation_bar/curved_navigation_bar.dart';
import 'package:sistema_ventas_app/screens/estadistica_screen.dart';
import 'package:sistema_ventas_app/screens/home_screen.dart';
import 'package:sistema_ventas_app/screens/cart_screen.dart';
import 'package:sistema_ventas_app/screens/mapa_page.dart';
import 'package:sistema_ventas_app/screens/cuota/cuota_screen.dart';
import 'package:sistema_ventas_app/main.dart';

void main() => runApp(MaterialApp(home: BottomNavBar()));
// La función main en bottom_navigation.dart es para probar este widget de forma aislada.
// La función main principal de la aplicación está en lib/main.dart.

class BottomNavBar extends StatefulWidget {
  final int initialPageIndex;
  const BottomNavBar({
    super.key,
    this.initialPageIndex = 2,
  }); // Por defecto, inicia en el índice 2 (HomeScreenWithVoice)
  @override
  _BottomNavBarState createState() => _BottomNavBarState(initialPageIndex);
}

class _BottomNavBarState extends State<BottomNavBar> {
  final List<Widget> _pages = [
    // aquí va tu vista
    MapaScreen(),
    //CartScreen(),
    CartScreenWithVoice(),
    //StatisticsScreen(),
    //HomeScreen(),
    HomeScreenWithVoice(),
    CuotaScreen(),
    Center(child: Text("Página 4", style: TextStyle(fontSize: 24))),
  ];

  int _page; // Se inicializará en el constructor
  GlobalKey<CurvedNavigationBarState> _bottomNavigationKey = GlobalKey();

  // Constructor para inicializar _page con el valor pasado
  _BottomNavBarState(this._page);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      //appBar: AppBar(title: Text('Curved Navigation Bar(Flutter)')),
      bottomNavigationBar: CurvedNavigationBar(
        key: _bottomNavigationKey,
        index: _page, // Usa el índice inicial proporcionado
        height: 50.0,
        items: <Widget>[
          Icon(
            Icons.location_on_outlined,
            size: 27,
            color: Color.fromARGB(255, 245, 246, 247),
          ),
          Icon(
            Icons.shopping_cart_outlined,
            size: 27,
            color: Color.fromARGB(255, 245, 246, 247),
          ),
          Icon(Icons.home, size: 33, color: Color.fromARGB(255, 245, 246, 247)),
          Icon(
            Icons.attach_money,
            size: 27,
            color: Color.fromARGB(255, 245, 246, 247),
          ),
          Icon(
            Icons.perm_identity,
            size: 27,
            color: Color.fromARGB(255, 245, 246, 247),
          ),
        ],

        // color: Colors.white,
        color: const Color.fromARGB(255, 56, 54, 54),
        //buttonBackgroundColor: Colors.white,
        //buttonBackgroundColor: const Color.fromARGB(255, 8, 211, 109),
        buttonBackgroundColor: const Color.fromARGB(255, 0, 0, 0),
        //        backgroundColor: const Color.fromARGB(255, 80, 80, 83),
        backgroundColor: const Color.fromARGB(255, 28, 29, 28),
        animationCurve: Curves.easeInOut,
        animationDuration: Duration(milliseconds: 600),
        onTap: (index) {
          setState(() {
            _page = index;
            print(_page);
          });
        },
        letIndexChange: (index) => true,
      ),
      body: _pages[_page],
    );
  }
}
