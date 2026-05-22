class Schedule {
  final String id;
  final String title;
  final String? description;
  final DateTime date;
  final String startTime;
  final String endTime;
  final bool isRecurring;
  final String? recurringRule;
  final String status;

  Schedule({
    required this.id,
    required this.title,
    this.description,
    required this.date,
    required this.startTime,
    required this.endTime,
    this.isRecurring = false,
    this.recurringRule,
    this.status = 'pending',
  });

  factory Schedule.fromJson(Map<String, dynamic> json) {
    return Schedule(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      date: DateTime.parse(json['date']),
      startTime: json['startTime'],
      endTime: json['endTime'],
      isRecurring: json['isRecurring'] ?? false,
      recurringRule: json['recurringRule'],
      status: json['status'] ?? 'pending',
    );
  }

  Map<String, dynamic> toJson() => {
    'title': title,
    'description': description,
    'date': date.toIso8601String().split('T')[0],
    'startTime': startTime,
    'endTime': endTime,
    'isRecurring': isRecurring,
    'recurringRule': recurringRule,
  };
}
