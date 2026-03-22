"use client";

import { motion } from "framer-motion";
import {
  MessageSquareText,
  BrainCircuit,
  ShieldCheck,
  Sheet,
  Clock,
  Sparkles,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: MessageSquareText,
    title: "Умный чат-виджет",
    description:
      "Встраивается на сайт за 2 минуты. Общается с клиентами естественным языком, понимает контекст.",
  },
  {
    icon: BrainCircuit,
    title: "Квалификация лидов",
    description:
      "AI задаёт уточняющие вопросы, определяет потребность и формирует структурированную заявку.",
  },
  {
    icon: Sheet,
    title: "Google Sheets",
    description:
      "Лиды автоматически сохраняются в таблицу. Имя, контакт, запрос, summary — всё на месте.",
  },
  {
    icon: ShieldCheck,
    title: "Согласие 152-ФЗ",
    description:
      "Запрашивает согласие на обработку данных перед сохранением. Вы защищены юридически.",
  },
  {
    icon: Clock,
    title: "Работает 24/7",
    description:
      "Отвечает клиентам мгновенно в любое время дня и ночи. Без перерывов.",
  },
  {
    icon: Sparkles,
    title: "GPT-4o Mini",
    description:
      "Быстрые, точные и релевантные ответы на базе новейшей модели OpenAI.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-32 px-6 sm:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
          {/* Left heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="block text-[11px] uppercase tracking-[0.25em] text-muted font-normal mb-6">
              Возможности
            </span>
            <h2 className="text-3xl sm:text-[2.5rem] font-light text-ink tracking-[-0.01em] leading-[1.15]">
              Всё для
              <br />
              автоматического
              <br />
              сбора заявок
            </h2>
          </motion.div>

          {/* Right grid */}
          <div className="space-y-0">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group grid grid-cols-[40px_1fr] gap-5 py-6 border-b border-border last:border-b-0"
              >
                <feature.icon
                  size={18}
                  strokeWidth={1.2}
                  className="text-accent mt-0.5"
                />
                <div>
                  <h3 className="font-medium text-ink text-[14px] mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-[13px] text-muted leading-[1.65] font-light">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
