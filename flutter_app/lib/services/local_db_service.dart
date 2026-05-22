class LocalDbService {
  // TODO: implement using Drift (SQLite) for offline caching
  static Future<void> cacheSchedules(List<Map<String, dynamic>> schedules) async {
    // Store schedules locally
  }

  static Future<List<Map<String, dynamic>>> getCachedSchedules() async {
    return [];
  }
}
