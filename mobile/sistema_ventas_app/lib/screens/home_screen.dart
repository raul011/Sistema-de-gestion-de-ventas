import 'package:flutter/material.dart';
import '../models/product.dart';
import '../models/category.dart';
import '../services/api_service.dart';
import '../widgets/product_card.dart';
import '../widgets/category_item.dart';
import 'product_detail_screen.dart';
import 'package:sistema_ventas_app/services/cart_service.dart';
import 'package:provider/provider.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:permission_handler/permission_handler.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  HomeScreenState createState() => HomeScreenState();
}

class HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  final ApiService _apiService = ApiService();
  List<Product> _products = [];
  List<Category> _categories = [];
  bool _isLoading = true;
  int? _selectedCategoryId;
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late stt.SpeechToText _speechForSearch;
  bool _isListeningForSearch = false;

  @override
  void initState() {
    super.initState();

    _speechForSearch = stt.SpeechToText();

    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _fadeAnimation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOutQuart,
    );
    _loadData();
    _initFCM(); //  Llamada necesaria
  }

  void _initFCM() async {
    FirebaseMessaging messaging = FirebaseMessaging.instance;

    // Request permission on iOS and web.
    NotificationSettings settings = await messaging.requestPermission();
    print('User granted permission: ${settings.authorizationStatus}');

    // Get the device token. You would normally send this to your server.
    final String? token = await messaging.getToken();
    print("Firebase Messaging Token: $token");

    // Listener for when the app is in the foreground.
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('Got a message whilst in the foreground!');
      print('Message data: ${message.data}');

      if (message.notification != null) {
        print('Message also contained a notification: ${message.notification}');
      }
    });
  }

  Future<void> _startVoiceSearch() async {
    final micStatus = await Permission.microphone.request();

    if (!micStatus.isGranted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Se necesita permiso de micrófono'),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    // Detener cualquier sesión activa
    if (_speechForSearch.isListening) {
      await _speechForSearch.stop();
      setState(() => _isListeningForSearch = false);
      return;
    }

    // Inicializar el reconocimiento de voz de manera más simple
    bool available = await _speechForSearch.initialize(
      onStatus: (status) {
        print('Status: $status');
        if (status == 'done' || status == 'notListening') {
          setState(() => _isListeningForSearch = false);
        }
      },
      onError: (error) {
        print('Error: $error');
        setState(() => _isListeningForSearch = false);
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: $error')));
      },
    );

    if (available) {
      setState(() => _isListeningForSearch = true);

      await _speechForSearch.listen(
        localeId: 'es-ES', // Corregido formato del localeId
        onResult: (result) {
          if (result.finalResult) {
            setState(() {
              _searchController.text = result.recognizedWords;
              _isListeningForSearch = false;
            });
            _loadData(); // Cargar los datos con el texto reconocido
          }
        },
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('🎤 Reconocimiento de voz no disponible')),
      );
    }
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final results = await Future.wait([
        _apiService.getCategories(),
        _apiService.getProducts(
          categoryId: _selectedCategoryId,
          search:
              _searchController.text.isNotEmpty ? _searchController.text : null,
        ),
      ]);

      final List<Category> categories = results[0] as List<Category>;
      final List<Product> products = results[1] as List<Product>;

      setState(() {
        _categories = categories;
        _products = products;
        _isLoading = false;
      });

      _animationController.reset();
      _animationController.forward();
    } catch (e) {
      setState(() => _isLoading = false);
      _showErrorSnackbar();
    }
  }

  void _showErrorSnackbar() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(Icons.error_outline, color: Colors.white),
            SizedBox(width: 12),
            Expanded(child: Text('Error al cargar los datos')),
          ],
        ),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: EdgeInsets.all(16),
        backgroundColor: Colors.redAccent,
        duration: Duration(seconds: 3),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isTablet = MediaQuery.of(context).size.width > 600;

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        title: Text(
          'Boutique Juli',
          style: TextStyle(
            fontWeight: FontWeight.w700,
            fontSize: 24,
            color: Color.fromARGB(255, 218, 20, 218),
          ),
        ),
        backgroundColor: Colors.black.withOpacity(0.8),
        actions: [_buildCartButton(theme)],
      ),
      // 👇 quita el backgroundColor aquí
      body: Container(
        decoration: BoxDecoration(
          gradient: RadialGradient(
            center: Alignment.topLeft,
            radius: 1.5,
            colors: [
              Color.fromARGB(255, 28, 29, 28),
              Color.fromARGB(255, 57, 61, 40),
              Color.fromARGB(255, 28, 29, 28),
            ],
            stops: [0.0, 0.5, 1.0],
          ),
        ),

        child: RefreshIndicator(
          color: theme.colorScheme.primary,
          onRefresh: _loadData,
          child: CustomScrollView(
            controller: _scrollController,
            slivers: [
              _buildSearchBar(theme),
              _buildCategoriesSection(theme),
              _buildProductsTitle(theme),
              _buildProductsGrid(isTablet, theme),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCartButton(ThemeData theme) {
    final cartService = Provider.of<CartService>(context);
    return Stack(
      clipBehavior: Clip.none,
      children: [
        IconButton(
          icon: const Icon(
            Icons.shopping_cart_outlined,
            size: 28,
            color: Colors.white,
          ),
          onPressed: () => Navigator.pushNamed(context, '/cart'),
        ),
        if (cartService.itemCount > 0)
          Positioned(
            top: 6,
            right: 6,
            child: Container(
              padding: EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: theme.colorScheme.error,
                shape: BoxShape.circle,
              ),
              child: Text(
                '${cartService.itemCount}',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
      ],
    );
  }

  SliverPadding _buildSearchBar(ThemeData theme) {
    return SliverPadding(
      padding: EdgeInsets.fromLTRB(16, 8, 16, 16),
      sliver: SliverToBoxAdapter(
        child: Material(
          elevation: 2,
          borderRadius: BorderRadius.circular(16),
          child: TextField(
            controller: _searchController,
            decoration: InputDecoration(
              hintText: 'Buscar productos...',
              prefixIcon: Icon(Icons.search, color: theme.colorScheme.primary),
              suffixIcon: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (_searchController.text.isNotEmpty)
                    IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () {
                        _searchController.clear();
                        _loadData();
                      },
                    ),
                  IconButton(
                    icon: Icon(
                      _isListeningForSearch ? Icons.mic : Icons.mic_none,
                      color:
                          _isListeningForSearch
                              ? Colors.red
                              : theme.colorScheme.primary,
                    ),
                    onPressed: _startVoiceSearch,
                  ),
                ],
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide.none,
              ),
              filled: true,
              fillColor: theme.cardColor,
              contentPadding: EdgeInsets.symmetric(vertical: 0),
            ),
            onSubmitted: (_) => _loadData(),
          ),
        ),
      ),
    );
  }

  SliverToBoxAdapter _buildCategoriesSection(ThemeData theme) {
    return SliverToBoxAdapter(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: EdgeInsets.only(left: 24, bottom: 12),
            child: Text(
              'Categorías',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: const Color.fromARGB(255, 234, 234, 236),
              ),
            ),
          ),
          SizedBox(
            height: 64,
            child:
                _isLoading
                    ? Center(child: CircularProgressIndicator())
                    : FadeTransition(
                      opacity: _fadeAnimation,
                      child: ListView.builder(
                        padding: EdgeInsets.symmetric(horizontal: 16),
                        scrollDirection: Axis.horizontal,
                        itemCount: _categories.length,
                        itemBuilder: (context, index) {
                          return Padding(
                            padding: EdgeInsets.only(right: 12),
                            child: CategoryItem(
                              category: _categories[index],
                              isSelected:
                                  _selectedCategoryId == _categories[index].id,
                              onTap:
                                  () => setState(() {
                                    _selectedCategoryId =
                                        _selectedCategoryId ==
                                                _categories[index].id
                                            ? null
                                            : _categories[index].id;
                                    _loadData();
                                  }),
                            ),
                          );
                        },
                      ),
                    ),
          ),
        ],
      ),
    );
  }

  SliverPadding _buildProductsTitle(ThemeData theme) {
    return SliverPadding(
      padding: EdgeInsets.fromLTRB(24, 16, 24, 8),
      sliver: SliverToBoxAdapter(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              _selectedCategoryId != null
                  ? _categories
                      .firstWhere((cat) => cat.id == _selectedCategoryId)
                      .name
                  : 'Todos los productos',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: const Color.fromARGB(255, 234, 234, 236),
              ),
            ),
            if (_selectedCategoryId != null ||
                _searchController.text.isNotEmpty)
              TextButton(
                onPressed: () {
                  _selectedCategoryId = null;
                  _searchController.clear();
                  _loadData();
                },
                child: Text('Limpiar'),
              ),
          ],
        ),
      ),
    );
  }

  SliverPadding _buildProductsGrid(bool isTablet, ThemeData theme) {
    return SliverPadding(
      padding: EdgeInsets.fromLTRB(16, 8, 16, 24),
      sliver:
          _isLoading
              ? SliverFillRemaining(
                child: Center(child: CircularProgressIndicator()),
              )
              : _products.isEmpty
              ? SliverFillRemaining(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.search_off,
                      size: 60,
                      color: Colors.grey.shade400,
                    ),
                    SizedBox(height: 16),
                    Text(
                      'No se encontraron productos',
                      style: theme.textTheme.bodyLarge?.copyWith(
                        color: Colors.white,
                      ),
                    ),
                    SizedBox(height: 16),
                    ElevatedButton.icon(
                      onPressed: () {
                        _selectedCategoryId = null;
                        _searchController.clear();
                        _loadData();
                      },
                      icon: Icon(Icons.refresh),
                      label: Text('Reiniciar búsqueda'),
                    ),
                  ],
                ),
              )
              : SliverGrid(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: isTablet ? 3 : 2,
                  childAspectRatio: 0.7,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                ),
                delegate: SliverChildBuilderDelegate((context, index) {
                  return FadeTransition(
                    opacity: _fadeAnimation,
                    child: ProductCard(
                      product: _products[index],
                      onTap:
                          () => Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder:
                                  (context) => ProductDetailScreen(
                                    productId: _products[index].id,
                                  ),
                            ),
                          ),
                      onAddToCart: () {
                        final cart = Provider.of<CartService>(
                          context,
                          listen: false,
                        );
                        cart.addItem(_products[index]);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              '${_products[index].name} añadido al carrito',
                            ),
                            behavior: SnackBarBehavior.floating,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        );
                      },
                    ),
                  );
                }, childCount: _products.length),
              ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    _animationController.dispose();
    super.dispose();
  }
}
