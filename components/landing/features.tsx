"use client";

import { motion } from "framer-motion";
import {
  MessageSquareText,
  BrainCircuit,
  Sheet,
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
    title: "AI-боты для заявок",
    description:
      "Боты, которые отвечают клиентам, уточняют задачу, собирают контакты и передают готовую заявку.",
  },
  {
    icon: BrainCircuit,
    title: "FAQ-ассистенты",
    description:
      "Ассистенты, которые отвечают на типовые вопросы по базе знаний, услугам, срокам и процессу работы.",
  },
  {
    icon: Sheet,
    title: "Автоматизация документов",
    description:
      "Помощники для подготовки ТЗ, описаний, инструкций, брифов и других рабочих материалов.",
  },
  {
    icon: Sparkles,
    title: "AI-инструменты для специалистов",
    description:
      "Решения, которые помогают быстрее искать, структурировать и обрабатывать информацию.",
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
              Услуги
            </span>
            <h2 className="text-3xl sm:text-[2.5rem] font-light text-ink tracking-[-0.01em] leading-[1.15]">
              Что я могу
              <br />
              автоматизировать
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
