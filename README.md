# LeadBot AI — AI-ассистент для генерации лидов

**Автоматическая квалификация клиентов, RAG по базе знаний, Telegram-уведомления и сбор заявок в Google Sheets.**

LeadBot AI — это AI-менеджер по первичной обработке входящих заявок. Общается с посетителями сайта, отвечает на вопросы из базы знаний, квалифицирует потребности через естественный диалог, собирает контактные данные с согласием на обработку и автоматически передаёт структурированные заявки вашей команде.

---

## Возможности

- **RAG по базе знаний** — Ответы на основе 16 документов базы знаний. Гибридный поиск: embeddings (text-embedding-3-small) + keyword fallback.
- **Разговорный AI** — Естественный диалог на базе GPT-4o Mini. Понимает контекст, задаёт уточняющие вопросы и ведёт клиента к оформлению заявки.
- **Умная квалификация** — 5-стадийный пайплайн: приветствие → квалификация → запрос контакта → согласие → лид сохранён.
- **Статусы лидов** — Автоматическое определение cold / warm / hot по содержанию диалога.
- **Telegram-уведомления** — Мгновенное уведомление менеджера о новом лиде через Telegram Bot API.
- **Сбор контактов** — Автоматическое распознавание Telegram-ников и номеров телефонов из свободного текста.
- **Согласие по 152-ФЗ** — Встроенный механизм получения согласия на обработку персональных данных.
- **Google Sheets** — Заявки с полной информацией попадают в таблицу через webhook.
- **Логирование** — Структурированные логи всех событий: стадии, RAG, OpenAI, Telegram, ошибки.
- **Премиальный UI** — Тёплый минималистичный дизайн в стиле quiet luxury.

---

## Стек технологий

| Слой | Технология |
|------|-----------|
| Фреймворк | Next.js 14 (App Router) |
| Язык | TypeScript |
| Стили | Tailwind CSS |
| AI (чат) | OpenAI GPT-4o Mini |
| AI (RAG) | OpenAI text-embedding-3-small |
| Анимации | Framer Motion |
| Иконки | Lucide React |
| Хранение лидов | Google Sheets (Apps Script webhook) |
| Уведомления | Telegram Bot API |

---

## Как это работает

```
Клиент открывает чат → AI приветствует → задаёт уточняющие вопросы
→ ищет ответы в базе знаний (RAG) → понимает задачу
→ запрашивает контакт → запрашивает согласие
→ сохраняет лид в Google Sheets → отправляет уведомление в Telegram
```

### Стадии диалога

| Стадия | Что происходит |
|--------|---------------|
| `greeting` | AI представляется, показывает быстрые действия |
| `qualification` | 2–3 уточняющих вопроса о задаче клиента |
| `contact_request` | Запрос Telegram или номера телефона |
| `consent_request` | Согласие по 152-ФЗ с кнопками подтверждения/отказа |
| `completed` | Лид сохранён, Telegram-уведомление отправлено |

### RAG-поиск

При каждом сообщении пользователя система ищет релевантную информацию в базе знаний:

1. **Основной путь** — cosine similarity по предгенерированным embeddings (text-embedding-3-small)
2. **Fallback** — keyword search по чанкам, если embeddings-индекс недоступен

Найденные чанки передаются в system prompt как контекст для ответа.

### Данные лида в Google Sheets

```
createdAt | name | contact | contactType | task | business | goal | timeline | leadStatus | consentGiven | summary | source | rawConversation | telegramSent
```

---

## Быстрый старт

### Требования

- Node.js 18+
- Ключ OpenAI API
- URL вебхука Google Apps Script
- Telegram Bot Token и Chat ID (для уведомлений)

### Установка

```bash
git clone https://github.com/urmanovaa/leadbot-ai.git
cd leadbot-ai
npm install
```

### Переменные окружения

Скопируйте `.env.example` в `.env.local` и заполните значения:

```bash
cp .env.example .env.local
```

```env
OPENAI_API_KEY=sk-your-key-here
GOOGLE_SCRIPT_WEBHOOK_URL=https://script.google.com/macros/s/your-script-id/exec
TELEGRAM_BOT_TOKEN=123456789:ABC-your-token
TELEGRAM_CHAT_ID=-100your-chat-id
```

### Генерация RAG-индекса

Перед первым запуском сгенерируйте embeddings-индекс базы знаний:

```bash
npm run build:embeddings
```

Индекс сохраняется в `knowledge_base/.cache/embeddings.json`. Его нужно перегенерировать при обновлении файлов в `knowledge_base/`.

### Запуск

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000). Нажмите на иконку чата в правом нижнем углу.

---

## Структура проекта

```
app/
  page.tsx                        Лендинг
  layout.tsx                      Корневой layout
  api/chat/route.ts               AI-чат эндпоинт (RAG + квалификация + логирование)
  api/lead/route.ts               Ручная отправка лида

components/
  chat/
    chat-widget.tsx               Плавающая кнопка чата
    chat-window.tsx               Основной контейнер чата + логика
    message-bubble.tsx            Компонент сообщения
    chat-input.tsx                Ввод с авто-ресайзом
    quick-actions.tsx             Кнопки быстрых действий
    consent-actions.tsx           UI согласия (152-ФЗ)
    typing-indicator.tsx          Анимация набора текста
  landing/
    hero.tsx, features.tsx, how-it-works.tsx, cta.tsx, footer.tsx

lib/
  types.ts                        TypeScript-интерфейсы (ChatStage, LeadStatus, LeadPayload)
  openai.ts                       Клиент OpenAI
  prompts.ts                      Системный промпт (на основе system_prompt.md + RAG)
  rag.ts                          RAG-поиск (embeddings + keyword fallback)
  knowledge-base.ts               Чтение и чанкинг .md файлов
  lead-status.ts                  Определение cold/warm/hot
  contact-parser.ts               Парсер Telegram/телефона
  lead-summary.ts                 Генератор summary
  google-sheets.ts                Интеграция с Google Sheets webhook
  telegram.ts                     Telegram Bot API уведомления
  logger.ts                       Структурированное логирование

knowledge_base/                   16 документов базы знаний (.md)
knowledge_base/.cache/            Предгенерированный embeddings-индекс

scripts/
  build-embeddings.mjs            Скрипт генерации embeddings-индекса

prompts/
  system_prompt.md                Описание роли и правил AI-ассистента

docs/
  rag.md                          Документация RAG-системы
  testing.md                      Тестовые сценарии
```

---

## Обновление базы знаний

1. Добавьте или отредактируйте `.md` файлы в `knowledge_base/`
2. Перегенерируйте индекс: `npm run build:embeddings`
3. Закоммитьте обновлённый `knowledge_base/.cache/embeddings.json`

---

## Деплой на Vercel

1. Добавьте переменные окружения в настройках Vercel (Settings → Environment Variables)
2. Закоммитьте `knowledge_base/.cache/embeddings.json` в репозиторий
3. Деплой произойдёт автоматически при push

Embeddings-индекс читается из файла при первом запросе и кэшируется в памяти. Генерация embeddings при cold start не происходит.

---

**Создано на** Next.js, TypeScript, OpenAI и Google Sheets.

**Лицензия:** MIT
