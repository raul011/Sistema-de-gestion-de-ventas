import 'package:flutter/material.dart';

class StatisticsScreen extends StatefulWidget {
  const StatisticsScreen({Key? key}) : super(key: key);

  @override
  State<StatisticsScreen> createState() => _StatisticsScreenState();
}

class _StatisticsScreenState extends State<StatisticsScreen> {
  bool isIncomeSelected = true;
  String selectedPeriod = 'M';

  final List<ChartData> chartData = [
    ChartData('Jan', 15000),
    ChartData('Feb', 18000),
    ChartData('Mar', 28000),
    ChartData('Apr', 22000),
    ChartData('May', 19000),
    ChartData('Jun', 16000),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1A1A2E),
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: const Color(0xFF2A2A3E),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.arrow_back_ios_new, size: 18),
                  ),
                  const Text(
                    'Estadìsticas',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: const Color(0xFF2A2A3E),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.more_vert, size: 18),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Income/Spending Toggle
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Container(
                height: 50,
                decoration: BoxDecoration(
                  color: const Color(0xFF2A2A3E),
                  borderRadius: BorderRadius.circular(25),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            isIncomeSelected = true;
                          });
                        },
                        child: Container(
                          margin: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color:
                                isIncomeSelected
                                    ? const Color(0xFF6C5CE7)
                                    : Colors.transparent,
                            borderRadius: BorderRadius.circular(22),
                          ),
                          child: Center(
                            child: Text(
                              'Ingreso',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color:
                                    isIncomeSelected
                                        ? Colors.white
                                        : Colors.grey,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            isIncomeSelected = false;
                          });
                        },
                        child: Container(
                          margin: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color:
                                !isIncomeSelected
                                    ? const Color(0xFF6C5CE7)
                                    : Colors.transparent,
                            borderRadius: BorderRadius.circular(22),
                          ),
                          child: Center(
                            child: Text(
                              'Gasto',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color:
                                    !isIncomeSelected
                                        ? Colors.white
                                        : Colors.grey,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Card Container
            SizedBox(
              //height: 370,
              height: MediaQuery.of(context).size.height * 0.51,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF2A2A3E),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Total Earnings Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Total Ventas Mensuales',
                            style: TextStyle(fontSize: 14, color: Colors.grey),
                          ),
                          Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              color: const Color(0xFF1A1A2E),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(
                              Icons.trending_up,
                              color: Color(0xFF6C5CE7),
                              size: 20,
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 8),

                      // Amount
                      const Text(
                        '\$45,453.32',
                        style: TextStyle(
                          fontSize: 36,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),

                      // const SizedBox(height: 20),

                      // Period Selector
                      Row(
                        children: [
                          _buildPeriodButton('D'),
                          const SizedBox(width: 12),
                          _buildPeriodButton('W'),
                          const SizedBox(width: 12),
                          _buildPeriodButton('M'),
                          const SizedBox(width: 12),
                          _buildPeriodButton('Y'),
                        ],
                      ),

                      const SizedBox(height: 25),
                      /*
                      // Chart
                      Expanded(
                        child: BarChart(data: chartData, selectedMonth: 'Mar'),
                      ),
                      */
                      SizedBox(
                        height: 180, // ajusta según lo que quieras
                        child: BarChart(data: chartData, selectedMonth: 'Mar'),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildPeriodButton(String period) {
    final isSelected = selectedPeriod == period;
    return GestureDetector(
      onTap: () {
        setState(() {
          selectedPeriod = period;
        });
      },
      child: Container(
        width: 44,
        height: 25,
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF6C5CE7) : const Color(0xFF1A1A2E),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Center(
          child: Text(
            period,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: isSelected ? Colors.white : Colors.grey,
            ),
          ),
        ),
      ),
    );
  }
}

class ChartData {
  final String month;
  final double amount;

  ChartData(this.month, this.amount);
}

class BarChart extends StatelessWidget {
  final List<ChartData> data;
  final String selectedMonth;

  const BarChart({Key? key, required this.data, required this.selectedMonth})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    final maxValue = data.map((e) => e.amount).reduce((a, b) => a > b ? a : b);

    return Column(
      children: [
        // Y-axis labels and bars
        Expanded(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              // Y-axis labels
              SizedBox(
                width: 50,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildYAxisLabel('\$30K'),
                    _buildYAxisLabel('\$20K'),
                    _buildYAxisLabel('\$10K'),
                    _buildYAxisLabel('\$0K'),
                  ],
                ),
              ),

              // Bars
              Expanded(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children:
                      data.map((item) {
                        final isSelected = item.month == selectedMonth;
                        final heightPercent = item.amount / maxValue;
                        return Expanded(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8.0,
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                Expanded(
                                  child: Align(
                                    alignment: Alignment.bottomCenter,
                                    child: FractionallySizedBox(
                                      heightFactor: heightPercent,
                                      child: Container(
                                        decoration: BoxDecoration(
                                          color:
                                              isSelected
                                                  ? const Color(0xFF6C5CE7)
                                                  : const Color(0xFF3A3A4E),
                                          borderRadius: BorderRadius.circular(
                                            8,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 12),

        // X-axis labels
        Row(
          children: [
            const SizedBox(width: 50),
            Expanded(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children:
                    data.map((item) {
                      return Expanded(
                        child: Center(
                          child: Text(
                            item.month,
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.grey,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildYAxisLabel(String label) {
    return Text(
      label,
      style: const TextStyle(fontSize: 12, color: Colors.grey),
    );
  }
}
