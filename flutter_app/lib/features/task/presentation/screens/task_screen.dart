import 'package:flutter/material.dart';

class TaskScreen extends StatefulWidget {
  const TaskScreen({super.key});

  @override
  State<TaskScreen> createState() => _TaskScreenState();
}

class _TaskScreenState extends State<TaskScreen> {
  final _tasks = <Map<String, String>>[];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tugas')),
      body: _tasks.isEmpty
          ? const Center(
              child: Text('Belum ada tugas', style: TextStyle(color: Colors.grey)),
            )
          : ListView.builder(
              itemCount: _tasks.length,
              itemBuilder: (_, i) => ListTile(
                leading: Checkbox(
                  value: _tasks[i]['status'] == 'done',
                  onChanged: (_) {
                    setState(() {
                      _tasks[i]['status'] =
                          _tasks[i]['status'] == 'done' ? 'pending' : 'done';
                    });
                  },
                ),
                title: Text(_tasks[i]['title'] ?? ''),
                subtitle: Text(_tasks[i]['priority'] ?? ''),
                trailing: IconButton(
                  icon: const Icon(Icons.delete),
                  onPressed: () => setState(() => _tasks.removeAt(i)),
                ),
              ),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddTaskDialog(),
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showAddTaskDialog() {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Tambah Tugas'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(
            labelText: 'Nama tugas',
            hintText: 'Belikan kado ulang tahun...',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Batal'),
          ),
          TextButton(
            onPressed: () {
              if (controller.text.isNotEmpty) {
                setState(() {
                  _tasks.add({
                    'title': controller.text,
                    'priority': 'medium',
                    'status': 'pending',
                  });
                });
              }
              Navigator.pop(ctx);
            },
            child: const Text('Simpan'),
          ),
        ],
      ),
    );
  }
}
