# RAG-система LeadBot AI

## Обзор

RAG (Retrieval-Augmented Generation) — система поиска релевантной информации из базы знаний для контекстных ответов AI-ассистента.

## Архитектура

### Источники данных

16 Markdown-файлов в `knowledge_base/`:
- `01_project_overview.md` — описание проекта
- `02_services.md` — услуги и решения
- `03_target_audience.md` — целевая аудитория
- `04_sales_process.md` — процесс продаж
- `05_lead_qualification.md` — квалификация лидов
- `06_faq.md` — частые вопросы
- `07_pricing.md` — логика стоимости
- `08_objections.md` — возражения
- `09_use_cases.md` — сценарии применения
- `10_integrations.md` — интеграции
- `11_rag_rules.md` — правила RAG
- `12_privacy_and_consent.md` — персональные данные
- `13_manager_handoff.md` — передача менеджеру
- `14_fallback_scenarios.md` — fallback-сценарии
- `15_limitations.md` — ограничения
- `16_gray_cases.md` — серые и граничные кейсы

### Чанкинг

Каждый файл разбивается на чанки по заголовкам `##`. Каждый чанк содержит:
- `id` — уникальный идентификатор (файл#номер)
- `source` — имя файла-источника
- `heading` — заголовок секции
- `content` — текст секции

Текущий объём: 116 чанков из 16 файлов.

### Гибридный поиск

#### Основной путь: Embeddings

1. При генерации индекса (`npm run build:embeddings`) каждый чанк преобразуется в embedding через OpenAI `text-embedding-3-small`
2. Индекс сохраняется в `knowledge_base/.cache/embeddings.json`
3. При запросе пользователя:
   - Создаётся embedding запроса (один API-вызов)
   - Вычисляется cosine similarity со всеми чанками
   - Возвращаются top-5 наиболее релевантных чанков
4. Чанки форматируются и добавляются в system prompt

#### Fallback: Keyword Search

Если embeddings-индекс отсутствует или OpenAI API недоступен:
1. Загружаются .md файлы из `knowledge_base/`
2. Запрос пользователя токенизируется (удаляются стоп-слова, знаки препинания)
3. Подсчитывается количество совпадений токенов с чанками
4. Возвращаются top-5 чанков по количеству совпадений

### Кэширование

- Embeddings-индекс загружается в память при первом запросе и кэшируется до перезапуска
- Чанки из .md файлов также кэшируются в памяти при первом использовании
- Индекс НЕ генерируется при cold start на Vercel

## Обновление базы знаний

1. Отредактируйте или добавьте `.md` файлы в `knowledge_base/`
2. Используйте заголовки `##` для разделения секций
3. Перегенерируйте индекс:

```bash
npm run build:embeddings
```

4. Закоммитьте обновлённый `knowledge_base/.cache/embeddings.json`

## Файлы

| Файл | Назначение |
|------|-----------|
| `lib/knowledge-base.ts` | Чтение .md файлов, чанкинг по ##, keyword search |
| `lib/rag.ts` | Загрузка embeddings-индекса, cosine similarity, fallback |
| `scripts/build-embeddings.mjs` | Скрипт генерации индекса |
| `knowledge_base/.cache/embeddings.json` | Предгенерированный индекс |

## Логирование

RAG-система логирует следующие события:
- `rag_context_found` — найден контекст (embeddings или keyword)
- `rag_fallback_keyword` — использован keyword fallback
- `rag_no_context` — контекст не найден
