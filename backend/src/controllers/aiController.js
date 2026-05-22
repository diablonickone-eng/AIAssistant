const prisma = require('../lib/prisma');

const SYSTEM_PROMPT = `Kamu adalah asisten sekretaris AI. Tugasmu adalah mengubah input teks natural dalam Bahasa Indonesia menjadi data terstruktur. Identifikasi apakah user ingin membuat jadwal, tugas, atau request lainnya. Keluarkan dalam format JSON berikut:
{ type: "schedule" | "task" | "unknown", title, date, startTime, endTime, notes, priority }

Contoh:
Input: "Buatkan meeting dengan tim besok jam 10 pagi"
Output: {"type":"schedule","title":"Meeting dengan tim","date":"2026-05-23","startTime":"10:00","endTime":"11:00","notes":"","priority":"medium"}

Input: "Belikan kado ulang tahun untuk ibu"
Output: {"type":"task","title":"Belikan kado ulang tahun untuk ibu","date":"","startTime":"","endTime":"","notes":"","priority":"medium"}`;

const parse = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    let parsed;
    try {
      const OpenAI = require('openai');
      const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultHeaders: {
          'HTTP-Referer': 'https://github.com/your-project/ai-secretary',
          'X-Title': 'AI Secretary Assistant',
        },
      });

      const completion = await openai.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
        temperature: 0.3,
      });

      const raw = completion.choices[0].message.content;
      parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch (llmErr) {
      // Fallback: parse sederhana jika OpenAI error
      parsed = fallbackParse(text);
    }

    // Save to AI history
    await prisma.aiHistory.create({
      data: {
        userId: req.userId,
        rawInput: text,
        parsedOutput: JSON.stringify(parsed),
      },
    });

    res.json(parsed);
  } catch (err) {
    next(err);
  }
};

function fallbackParse(text) {
  const lower = text.toLowerCase();
  const today = new Date().toISOString().split('T')[0];

  if (lower.includes('jadwal') || lower.includes('meeting') || lower.includes('rapat')) {
    return {
      type: 'schedule',
      title: text,
      date: today,
      startTime: '09:00',
      endTime: '10:00',
      notes: '',
      priority: 'medium',
    };
  }

  return {
    type: 'task',
    title: text,
    date: '',
    startTime: '',
    endTime: '',
    notes: '',
    priority: 'medium',
  };
}

module.exports = { parse };
