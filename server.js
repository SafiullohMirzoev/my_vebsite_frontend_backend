require('dotenv').config();
const path = require('path');
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const BOT_USERNAME = process.env.BOT_USERNAME || 'ustoyor_service_bot';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'safiyulloh_dev';
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '992990906023';
const PHONE_NUMBER = process.env.PHONE_NUMBER || '992711822211';

if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
  console.error('❌ BOT_TOKEN or ADMIN_CHAT_ID is missing in .env');
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function clean(value) {
  return String(value || '').trim().slice(0, 1000);
}

function leadMessage(data) {
  return `🔥 Новая заявка UstoYor Service / DEVCRAFT\n\n` +
    `👤 Имя: ${clean(data.name) || 'Не указано'}\n` +
    `📞 Телефон: ${clean(data.phone) || 'Не указано'}\n` +
    `🏢 Бизнес: ${clean(data.business) || 'Не указано'}\n` +
    `🛠 Услуга: ${clean(data.service) || 'Не указано'}\n` +
    `📦 Пакет: ${clean(data.packageName) || 'Не выбран'}\n` +
    `💬 Сообщение: ${clean(data.message) || 'Не указано'}\n\n` +
    `🌐 Источник: сайт\n` +
    `🤖 Бот: @${BOT_USERNAME}`;
}

app.get('/api/config', (req, res) => {
  res.json({
    botUsername: BOT_USERNAME,
    adminUsername: ADMIN_USERNAME,
    whatsappNumber: WHATSAPP_NUMBER,
    phoneNumber: PHONE_NUMBER
  });
});

app.post('/api/lead', async (req, res) => {
  try {
    const { name, phone, service } = req.body || {};
    if (!clean(name) || !clean(phone) || !clean(service)) {
      return res.status(400).json({ ok: false, message: 'Заполните имя, телефон и услугу.' });
    }

    await bot.sendMessage(ADMIN_CHAT_ID, leadMessage(req.body), {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Написать админу', url: `https://t.me/${ADMIN_USERNAME}` }],
          [{ text: 'WhatsApp клиента', url: `https://wa.me/${String(phone).replace(/\D/g, '')}` }]
        ]
      }
    });

    res.json({ ok: true, message: 'Заявка отправлена.' });
  } catch (error) {
    console.error('Lead error:', error.message);
    res.status(500).json({ ok: false, message: 'Ошибка отправки заявки.' });
  }
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
    'Ассалому алейкум! Я бот UstoYor Service. Здесь можно заказать сайт, CRM-систему или Telegram-бот для бизнеса.',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Открыть сайт', url: `http://localhost:${PORT}` }],
          [{ text: 'Написать в WhatsApp', url: `https://wa.me/${WHATSAPP_NUMBER}` }],
          [{ text: 'Связаться в Telegram', url: `https://t.me/${ADMIN_USERNAME}` }]
        ]
      }
    }
  );
});

bot.on('message', async (msg) => {
  if (msg.text && msg.text.startsWith('/start')) return;
  if (String(msg.chat.id) === String(ADMIN_CHAT_ID)) return;

  const from = msg.from || {};
  const text = msg.text || msg.caption || '[медиа/файл]';
  await bot.sendMessage(ADMIN_CHAT_ID,
    `📩 Сообщение в бот\n\n` +
    `👤 ${from.first_name || ''} ${from.last_name || ''}\n` +
    `🔗 @${from.username || 'нет username'}\n` +
    `🆔 ${msg.chat.id}\n\n` +
    `💬 ${text}`
  );

  bot.sendMessage(msg.chat.id, 'Спасибо! Ваше сообщение отправлено администратору. Скоро с вами свяжутся.');
});

app.listen(PORT, () => {
  console.log(`✅ Website: http://localhost:${PORT}`);
  console.log(`✅ Telegram bot: @${BOT_USERNAME}`);
});
