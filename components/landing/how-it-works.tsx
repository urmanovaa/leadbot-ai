"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Клиент пишет в чат",
    description:
      "Виджет на вашем сайте привлекает внимание. Клиент начинает диалог с AI-ассистентом.",
  },
  {
    number: "02",
    title: "AI квалифицирует",
    description:
      "Ассистент задаёт уточняющие вопросы, понимает задачу и определяет потребности.",
  },
  {
    number: "03",
    title: "Собирает контакт",
    description:
      "После квалификации запрашивает Telegram или номер телефона для связи.",
  },
  {
    number: "04",
    title: "Лид в таблице",
    description:
      "Заявка с именем, контактом и описанием задачи попадает в Google Sheets.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6 sm:px-10 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <span className="block text-[11px] uppercase tracking-[0.25em] text-muted font-normal mb-6">
            Процесс
          </span>
          <h2 className="text-3xl sm:text-[2.5rem] font-light text-ink tracking-[-0.01em] leading-[1.15] max-w-md">
            От первого сообщения
            до готовой заявки
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`py-8 lg:py-0 lg:pr-10 ${
                index < steps.length - 1 ? "lg:border-r border-border" : ""
              } ${index > 0 ? "lg:pl-10" : ""} ${
                index < steps.length - 1 ? "border-b lg:border-b-0 border-border" : ""
              }`}
            >
              <span className="block text-[11px] text-accent font-medium tracking-wider mb-4">
                {step.number}
              </span>
              <h3 className="font-medium text-ink text-[15px] mb-3 leading-tight">
                {step.title}
              </h3>
              <p className="text-[13px] text-muted leading-[1.65] font-light">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
