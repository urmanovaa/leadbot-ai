"use client";

import { motion } from "framer-motion";
import { QuickAction } from "@/lib/types";

interface QuickActionsProps {
  actions: QuickAction[];
  onSelect: (message: string) => void;
}

const defaultActions: QuickAction[] = [
  { label: "Какие услуги есть?", message: "Какие услуги вы предоставляете?" },
  { label: "Хочу AI-бота", message: "Хочу AI-бота для бизнеса" },
  { label: "Нужна автоматизация", message: "Нужна автоматизация процессов" },
  { label: "Сколько стоит?", message: "Сколько стоят ваши услуги?" },
];

export function QuickActions({ actions = defaultActions, onSelect }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 px-5 py-1">
      {actions.map((action, index) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 + index * 0.06, duration: 0.2 }}
          onClick={() => onSelect(action.message)}
          className="px-3 py-1.5 text-[12px] font-normal rounded-sm
                     border border-border bg-surface text-muted
                     hover:border-accent/30 hover:text-accent
                     active:scale-[0.97] transition-all duration-150 cursor-pointer"
        >
          {action.label}
        </motion.button>
      ))}
    </div>
  );
}
