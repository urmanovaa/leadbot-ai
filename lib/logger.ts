type LogLevel = "info" | "warn" | "error";

type LogEvent =
  | "chat_message_received"
  | "stage_transition"
  | "rag_context_found"
  | "rag_fallback_keyword"
  | "rag_no_context"
  | "lead_status_determined"
  | "lead_saved_to_sheet"
  | "lead_save_failed"
  | "telegram_notification_sent"
  | "telegram_notification_failed"
  | "telegram_skipped_missing_env"
  | "openai_request_started"
  | "openai_request_completed"
  | "openai_request_failed"
  | "consent_given"
  | "consent_refused"
  | "fallback_triggered";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  event: LogEvent;
  data?: Record<string, unknown>;
}

function formatEntry(entry: LogEntry): string {
  const base = `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.event}`;
  if (entry.data && Object.keys(entry.data).length > 0) {
    return `${base} ${JSON.stringify(entry.data)}`;
  }
  return base;
}

function log(level: LogLevel, event: LogEvent, data?: Record<string, unknown>) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    data,
  };

  const formatted = formatEntry(entry);

  switch (level) {
    case "error":
      console.error(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    default:
      console.log(formatted);
  }
}

export const logger = {
  info(event: LogEvent, data?: Record<string, unknown>) {
    log("info", event, data);
  },
  warn(event: LogEvent, data?: Record<string, unknown>) {
    log("warn", event, data);
  },
  error(event: LogEvent, data?: Record<string, unknown>) {
    log("error", event, data);
  },
};
