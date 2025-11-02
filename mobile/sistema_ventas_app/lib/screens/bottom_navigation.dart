import 'package:flutter/material.dart';
import 'package:curved_navigation_bar/curved_navigation_bar.dart';
import 'package:sistema_ventas_app/screens/estadistica_screen.dart';

void main() => runApp(MaterialApp(home: BottomNavBar()));

class BottomNavBar extends StatefulWidget {
  @override
  _BottomNavBarState createState() => _BottomNavBarState();
}

class _BottomNavBarState extends State<BottomNavBar> {
  final List<Widget> _pages = [
    // aquí va tu vista
    Center(child: Text("Página 1", style: TextStyle(fontSize: 24))),
    Center(child: Text("Página 2", style: TextStyle(fontSize: 24))),
    StatisticsScreen(),
    Center(child: Text("Página 3", style: TextStyle(fontSize: 24))),
    Center(child: Text("Página 4", style: TextStyle(fontSize: 24))),
  ];

  int _page = 2;
  GlobalKey<CurvedNavigationBarState> _bottomNavigationKey = GlobalKey();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      //appBar: AppBar(title: Text('Curved Navigation Bar(Flutter)')),
      bottomNavigationBar: CurvedNavigationBar(
        key: _bottomNavigationKey,
        index: 2,
        height: 55.0,
        items: <Widget>[
          Icon(
            Icons.trending_up_outlined,
            size: 33,
            color: Color.fromARGB(255, 110, 113, 116),
          ),
          Icon(
            Icons.summarize,
            size: 33,
            color: Color.fromARGB(255, 100, 104, 107),
          ),
          Icon(
            Icons.bar_chart,
            size: 33,
            color: Color.fromARGB(255, 75, 78, 80),
          ),
          Icon(Icons.message, size: 33, color: Color.fromARGB(255, 25, 28, 31)),
          Icon(
            Icons.perm_identity,
            size: 33,
            color: Color.fromARGB(255, 3, 3, 3),
          ),
        ],
        color: Colors.white,
        buttonBackgroundColor: Colors.white,
        backgroundColor: const Color(0xFF1A1A2E),
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
