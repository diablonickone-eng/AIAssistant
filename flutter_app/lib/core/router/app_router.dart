import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/register_screen.dart';
import '../../features/dashboard/presentation/screens/dashboard_screen.dart';
import '../../features/schedule/presentation/screens/schedule_screen.dart';
import '../../features/task/presentation/screens/task_screen.dart';
import '../../features/ai_chat/presentation/screens/ai_chat_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/login',
  routes: [
    GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
    GoRoute(path: '/register', builder: (_, __) => const RegisterScreen()),
    GoRoute(path: '/dashboard', builder: (_, __) => const DashboardScreen()),
    GoRoute(path: '/schedules', builder: (_, __) => const ScheduleScreen()),
    GoRoute(path: '/tasks', builder: (_, __) => const TaskScreen()),
    GoRoute(path: '/ai-chat', builder: (_, __) => const AiChatScreen()),
  ],
);
