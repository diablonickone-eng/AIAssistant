import 'package:dartz/dartz.dart';

class LoginRequest {
  final String email;
  final String password;
  LoginRequest({required this.email, required this.password});
}

class RegisterRequest {
  final String email;
  final String password;
  final String name;
  RegisterRequest({required this.email, required this.password, required this.name});
}

class AuthResponse {
  final String token;
  final String userId;
  final String email;
  final String name;

  AuthResponse({
    required this.token,
    required this.userId,
    required this.email,
    required this.name,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      token: json['token'],
      userId: json['user']['id'],
      email: json['user']['email'],
      name: json['user']['name'],
    );
  }
}

abstract class AuthRepository {
  Future<Either<String, AuthResponse>> login(LoginRequest request);
  Future<Either<String, AuthResponse>> register(RegisterRequest request);
  Future<void> logout();
  Future<bool> isLoggedIn();
}
