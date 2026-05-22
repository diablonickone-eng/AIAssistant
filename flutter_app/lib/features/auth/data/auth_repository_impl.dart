import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';
import '../domain/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  final DioClient _client;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  AuthRepositoryImpl(this._client);

  @override
  Future<Either<String, AuthResponse>> login(LoginRequest request) async {
    try {
      final response = await _client.post(ApiConstants.authLogin, data: {
        'email': request.email,
        'password': request.password,
      });
      final authResponse = AuthResponse.fromJson(response.data);
      await _storage.write(key: 'jwt_token', value: authResponse.token);
      return Right(authResponse);
    } on DioException catch (e) {
      return Left(e.response?.data['error'] ?? 'Login failed');
    }
  }

  @override
  Future<Either<String, AuthResponse>> register(RegisterRequest request) async {
    try {
      final response = await _client.post(ApiConstants.authRegister, data: {
        'email': request.email,
        'password': request.password,
        'name': request.name,
      });
      final authResponse = AuthResponse.fromJson(response.data);
      await _storage.write(key: 'jwt_token', value: authResponse.token);
      return Right(authResponse);
    } on DioException catch (e) {
      return Left(e.response?.data['error'] ?? 'Registration failed');
    }
  }

  @override
  Future<void> logout() async {
    await _storage.delete(key: 'jwt_token');
  }

  @override
  Future<bool> isLoggedIn() async {
    final token = await _storage.read(key: 'jwt_token');
    return token != null;
  }
}
