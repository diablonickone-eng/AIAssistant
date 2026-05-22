class TaskItem {
  final String id;
  final String title;
  final DateTime? dueDate;
  final String priority;
  final String status;
  final String? notes;

  TaskItem({
    required this.id,
    required this.title,
    this.dueDate,
    this.priority = 'medium',
    this.status = 'pending',
    this.notes,
  });

  factory TaskItem.fromJson(Map<String, dynamic> json) {
    return TaskItem(
      id: json['id'],
      title: json['title'],
      dueDate: json['dueDate'] != null ? DateTime.parse(json['dueDate']) : null,
      priority: json['priority'] ?? 'medium',
      status: json['status'] ?? 'pending',
      notes: json['notes'],
    );
  }

  Map<String, dynamic> toJson() => {
    'title': title,
    'dueDate': dueDate?.toIso8601String(),
    'priority': priority,
    'notes': notes,
  };
}
