"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, User } from "lucide-react";

function ChatPreview() {
  const messages = [
    { role: "bot", text: "Здравствуйте! Чем могу помочь?" },
    { role: "user", text: "Нужен чат-бот для интернет-магазина" },
    { role: "bot", text: "Отлично. Какие задачи он должен решать?" },
    { role: "user", text: "Консультировать по товарам и собирать заявки" },
    { role: "bot", text: "Понял. Могу передать заявку специалисту. Оставьте Telegram или номер." },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      className="relative w-full max-w-[320px]"
    >
      <div className="bg-surface rounded-sm border border-border shadow-card overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-[12px] font-medium text-ink/70">Ассистент</span>
          </div>
          <span className="text-[10px] text-muted">онлайн</span>
        </div>

        {/* Messages */}
        <div className="p-4 space-y-3 h-[256px] overflow-hidden">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.3, duration: 0.4 }}
              className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0
                ${msg.role === "user" ? "bg-accent/10" : "bg-warm-200"}`}
              >
                {msg.role === "user" ? (
                  <User size={10} strokeWidth={1.5} className="text-accent" />
                ) : (
                  <Bot size={10} strokeWidth={1.5} className="text-muted" />
                )}
              </div>
              <div
                className={`px-3 py-2 text-[11px] leading-relaxed max-w-[78%] ${
                  msg.role === "user"
                    ? "bg-accent text-white rounded-sm"
                    : "bg-warm-100 text-ink/70 rounded-sm"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full py-20">
        {/* Top line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-px bg-border mb-16 origin-left"
        />

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-start">
          {/* Left — editorial text */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="block text-[11px] uppercase tracking-[0.25em] text-muted font-normal mb-10"
            >
              Интеллектуальная квалификация заявок
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-[2.75rem] sm:text-[3.25rem] lg:text-[3.75rem] font-light text-ink leading-[1.08] tracking-[-0.02em]"
            >
              AI-ассистент, который
              <br />
              превращает{" "}
              <em className="font-normal italic text-accent not-italic" style={{ fontStyle: "italic" }}>
                диалоги
              </em>
              <br />
              в заявки
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="h-px w-24 bg-accent/40 my-8 origin-left"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-[15px] sm:text-base text-muted leading-[1.7] max-w-sm font-light"
            >
              Отвечает клиентам, уточняет задачу и&nbsp;автоматически сохраняет лиды
              в&nbsp;Google&nbsp;Sheets.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <button
                onClick={() =>
                  document
                    .querySelector("[data-chat-trigger]")
                    ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
                }
                className="group px-6 py-3 bg-accent text-white text-[13px] font-medium rounded-sm
                           hover:bg-accent-hover transition-colors duration-200
                           flex items-center gap-2"
              >
                Начать диалог
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <a
                href="#how-it-works"
                className="px-6 py-3 text-[13px] font-medium text-ink/60 border border-border rounded-sm
                           hover:border-ink/20 hover:text-ink transition-all duration-200"
              >
                Как это работает
              </a>
            </motion.div>
          </div>

          {/* Right — product showcase */}
          <div className="flex justify-center lg:justify-end lg:pt-8">
            <ChatPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
