# UstoYor Service — сайт + Telegram-бот

Проект включает:
- сайт с услугами: Web, CRM, Telegram-боты;
- кнопки Telegram и WhatsApp;
- форму заявки;
- сервер Node.js;
- Telegram-бот, который отправляет заявки администратору.

## Как запустить

1. Открой папку проекта в VS Code.
2. В терминале напиши:

```bash
npm install
npm start
```

3. Открой сайт:

```text
http://localhost:3000
```

## Настройки

Все данные находятся в файле `.env`:

```env
BOT_TOKEN=токен_бота
ADMIN_CHAT_ID=твой_telegram_id
BOT_USERNAME=ustoyor_service_bot
ADMIN_USERNAME=safiyulloh_dev
WHATSAPP_NUMBER=992990906023
PHONE_NUMBER=992711822211
PORT=3000
```

## Важно

Не выкладывай `.env` в GitHub, потому что там находится токен Telegram-бота.
Если токен уже был отправлен кому-то или опубликован, лучше создать новый токен через @BotFather.

## Проверка бота

Открой Telegram-бота `@ustoyor_service_bot` и нажми Start.
Затем отправь заявку через сайт — она должна прийти админу с ID `6087695070`.
