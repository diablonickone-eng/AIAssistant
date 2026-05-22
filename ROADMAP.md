# AI Secretary Assistant — Roadmap
# --By Eryck Juliant--
## 1. Arsitektur

```
┌─────────────────────────────────┐      ┌───────────────────────────────────┐
│         Flutter App              │      │        Backend (Node.js)          │
│  (Android + iOS)                 │      │                                   │
│  ┌───────────────────────┐      │      │  ┌───────────────────────────┐    │
│  │ UI Layer               │      │      │  │ REST API + WebSocket      │    │
│  │ - Home/Dashboard       │──────┼──────┼─>│ - Auth (JWT)              │    │
│  │ - Calendar View        │      │      │  │ - Schedule CRUD           │    │
│  │ - Task List            │      │      │  │ - Task CRUD               │    │
│  │ - Chat/NLP Input       │      │      │  │ - AI Parse (NLP -> JSON)  │    │
│  │ - Settings             │      │      │  └───────────┬───────────────┘    │
│  └──────────┬────────────┘      │      │               │                    │
│             │                    │      │  ┌────────────┴──────────────┐    │
│  ┌──────────┴────────────┐      │      │  │  LLM Service (OpenAI)     │    │
│  │ State Mgmt (Riverpod)  │      │      │  │  - Parse jadwal natural   │    │
│  └──────────┬────────────┘      │      │  │  - Generate reminder text  │    │
│             │                    │      │  │  - Ringkasan tugas harian  │    │
│  ┌──────────┴────────────┐      │      │  └───────────────────────────┘    │
│  │ Local DB (Drift/SQLite)│      │      │                                   │
│  │ - Cache + offline      │      │      │  ┌───────────────────────────┐    │
│  └───────────────────────┘      │      │  │  PostgreSQL                │    │
│                                  │      │  │  - users, schedules,       │    │
│  ┌───────────────────────┐      │      │  │    tasks, reminders,       │    │
│  │ Background Services    │      │      │  │    ai_history              │    │
│  │ - WorkManager (Android)│      │      │  └───────────────────────────┘    │
│  │ - BGTaskScheduler(iOS)│──────┼──────┼─>                                │
│  │ flutter_local_notif    │      │      │  ┌───────────────────────────┐    │
│  │ FCM Push               │      │      │  │  Firebase Cloud Messaging │    │
│  └───────────────────────┘      │      │  │  - Push reminder notif     │    │
│                                  │      │  └───────────────────────────┘    │
│  ┌───────────────────────┐      │      └───────────────────────────────────┘
│  │ Calendar Sync          │      │
│  │ - Google Calendar API  │      │
│  │ - Apple Calendar       │      │
│  └───────────────────────┘      │
└─────────────────────────────────┘
```

## 2. Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Mobile Framework** | Flutter (Dart 3.x) |
| **State Management** | Riverpod |
| **Local DB** | Drift (SQLite) |
| **Background Tasks** | workmanager (Android), BGTaskScheduler (iOS) |
| **Notifikasi** | flutter_local_notifications + Firebase Cloud Messaging |
| **Calendar Sync** | googleapis (Google Calendar), device_calendar plugin |
| **Secure Storage** | flutter_secure_storage |
| **Backend** | Node.js + Express |
| **Database** | Supabase (PostgreSQL) + Redis (cache + queue notif) |
| **AI / LLM** | OpenRouter (DeepSeek Chat V3, fallback ke model free lain) |
| **Auth** | JWT |
| **Push** | Firebase Cloud Messaging |
| **Deploy** | Docker + VPS / Railway / Render |

## 3. Fitur-Fitur Utama

### Phase 1 — MVP (Core)
- Auth (register/login via email)
- Input jadwal via teks natural: *"Buatkan meeting dengan tim besok jam 10 pagi"*
- LLM memproses dan menyimpan jadwal ke database
- Tampilan jadwal harian/mingguan (calendar view)
- Add/edit/delete task manual
- Local notification reminder 15 menit sebelum jadwal
- Push notification reminder via FCM
- Ringkasan tugas yang belum selesai dari hari sebelumnya

### Phase 2 — Advanced
- Sync ke Google Calendar & Apple Calendar native
- Group/recurring schedules (setiap hari Senin, dsb.)
- Background service: cek jadwal setiap XX menit
- Integration dengan native reminder OS
- Multi-device sync via cloud
- Dark mode

### Phase 3 — AI Enhancement
- AI rekomendasi reschedule tugas yang terlewat
- AI generate daily summary setiap pagi
- Suara (speech-to-text) via flutter_speech
- Voice output (TTS) via flutter_tts
- Export/import jadwal (PDF/CSV)

## 4. Flow NLP / AI Parsing

```
User: "Buatkan jadwal meeting rapat dengan Budi besok jam 10 pagi selama 1 jam"

  ↓  (POST /api/ai/parse)

Backend → LLM (OpenAI) → Output JSON:
{
  "type": "schedule",
  "title": "Meeting Rapat dengan Budi",
  "date": "2026-05-23",
  "startTime": "10:00",
  "endTime": "11:00",
  "notes": "Meeting dengan Budi"
}

  ↓  (Simpan ke DB, kirim push notif)

Flutter → Tampilkan ke user untuk konfirmasi → Save
```

**System Prompt LLM (Bahasa Indonesia):**
```
Kamu adalah asisten sekretaris AI. Tugasmu adalah mengubah input teks natural
dalam Bahasa Indonesia menjadi data terstruktur. Identifikasi apakah user ingin
membuat jadwal, tugas, atau request lainnya. Keluarkan dalam format JSON berikut:
{ type: "schedule" | "task" | "unknown", title, date, startTime, endTime, notes, priority }
```

## 5. Database Schema (Simplified)

```sql
-- Users
users (id, email, password_hash, name, created_at)

-- Schedules / Events
schedules (id, user_id, title, description, date, start_time, end_time,
           is_recurring, recurring_rule, calendar_event_id,
           status: 'pending'|'done'|'cancelled', created_at)

-- Tasks
tasks (id, user_id, title, due_date, priority: 'low'|'medium'|'high',
       status: 'pending'|'done', notes, created_at)

-- Reminders
reminders (id, user_id, schedule_id|null, task_id|null,
           remind_at, is_sent, type: 'notification'|'push'|'calendar')

-- AI History (untuk tracking & improvement)
ai_history (id, user_id, raw_input, parsed_output, user_correction, created_at)
```

## 6. Struktur Folder (Multi-Module Flutter)

```
ai_assistant/
├── lib/
│   ├── main.dart
│   ├── app.dart
│   ├── core/
│   │   ├── constants/
│   │   ├── exceptions/
│   │   ├── network/          # Dio client, interceptors
│   │   ├── router/           # GoRouter
│   │   └── utils/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/         # repository, datasource
│   │   │   ├── domain/       # models, usecases
│   │   │   └── presentation/ # screens, providers, widgets
│   │   ├── schedule/
│   │   ├── task/
│   │   ├── reminder/
│   │   ├── ai_chat/          # NLP input screen
│   │   └── dashboard/
│   ├── services/
│   │   ├── background_service.dart
│   │   ├── notification_service.dart
│   │   ├── calendar_sync_service.dart
│   │   └── local_db_service.dart
│   └── shared/
│       └── widgets/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   │   ├── llm_service.js
│   │   │   ├── push_service.js
│   │   │   └── scheduler_service.js
│   │   ├── models/
│   │   └── middleware/
│   ├── prisma/               # DB schema
│   └── package.json
└── firebase/                 # Firebase config
```

## 7. Pertimbangan Teknis Penting

| Aspek | Solusi |
|-------|--------|
| **Background fetch di iOS** | BGTaskScheduler — jadwal fleksibel, tidak fixed interval |
| **Background di Android** | WorkManager — minimal interval 15 menit |
| **Offline Mode** | Drift SQLite sebagai cache, sync saat online |
| **Battery optimization** | Minimal background fetch, batasi workmanager |
| **Calendar bidirectional sync** | Full sync setiap kali login + periodic refresh |
| **Keamanan API key LLM** | Hanya di backend, tidak pernah di Flutter app |
| **Cost LLM** | Limit per user, cache hasil parsing yang sama |

## 8. Progress Terkini (22 Mei 2026)

### Phase 1 — MVP ✅ (Code selesai, menunggu integrasi & deploy)

| Item | Status | Keterangan |
|------|--------|------------|
| **Backend — Auth (register/login JWT)** | ✅ Selesai | `controllers/authController.js` + Prisma |
| **Backend — Schedule CRUD** | ✅ Selesai | + auto-create reminder 15 menit |
| **Backend — Task CRUD** | ✅ Selesai | + endpoint ringkasan pending |
| **Backend — AI Parse (NLP → JSON)** | ✅ Selesai | OpenRouter via DeepSeek Chat V3, fallback parser |
| **Backend — Reminder** | ✅ Selesai | CRUD + auto-generated dari schedule |
| **Backend — Database Supabase** | ✅ Selesai | 5 tabel (users, schedules, tasks, reminders, ai_history) via Prisma |
| **Flutter — Auth screen (login/register)** | ✅ Selesai | Masih mock (belum connect ke backend) |
| **Flutter — Dashboard** | ✅ Selesai | Grid menu + ringkasan tugas |
| **Flutter — Calendar View** | ✅ Selesai | table_calendar harian/mingguan/bulanan |
| **Flutter — Task List** | ✅ Selesai | Add/delete/checkbox done |
| **Flutter — AI Chat (NLP input)** | ✅ Selesai | Chat UI + placeholder API call |
| **Flutter — Notification Service** | ✅ Selesai | flutter_local_notifications + FCM setup |
| **Flutter — Background Service** | ✅ Selesai | Workmanager periodic 15 menit |
| **Integrasi Flutter → Backend** | ⏳ Pending | Login, schedule, task, AI chat masih mock |
| **Push Notification (FCM)** | ⏳ Pending | Butuh Firebase config aktif |
| **Deploy Backend** | ⏳ Pending | Butuh VPS/Railway/Render |

### Perubahan dari Roadmap Awal
- **OpenAI → OpenRouter** — biaya $0 (pakai free model DeepSeek Chat V3)
- **PostgreSQL lokal → Supabase** — managed DB + pooler
- **NestJS → Express** — lebih ringan untuk MVP

## 9. Estimasi Timeline

| Phase | Durasi | Output |
|-------|--------|--------|
| **Phase 1 (MVP)** | 8-10 minggu | Aplikasi rilis dengan fitur core jadwal & task + reminder |
| **Phase 2** | 4-6 minggu | Calendar sync, background service, recurring |
| **Phase 3** | 4-6 minggu | AI enhancement, voice, export |
