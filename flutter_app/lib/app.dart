import 'package:flutter/material.dart';
import 'core/router/app_router.dart';

class AiSecretaryApp extends StatelessWidget {
  const AiSecretaryApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'AI Secretary',
      debugShowCheckedModeBanner: false,
      routerConfig: appRouter,
      theme: ThemeData(
        colorSchemeSeed: Colors.blue,
        useMaterial3: true,
      ),
    );
  }
}
