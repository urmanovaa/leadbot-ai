"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

interface ConsentActionsProps {
  onConsent: (agreed: boolean) => void;
}

export function ConsentActions({ onConsent }: ConsentActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-5 my-1 p-4 bg-accent-light rounded-sm border border-accent-soft/50"
    >
      <div className="flex items-start gap-3 mb-3">
        <ShieldCheck size={15} strokeWidth={1.3} className="text-accent flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-ink/60 leading-relaxed font-light">
          Нажимая «Подтверждаю», вы даёте согласие на обработку персональных данных
          в соответствии с 152-ФЗ для связи по вашему запросу.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onConsent(true)}
          className="flex-1 px-4 py-2 text-[12px] font-medium rounded-sm
                     bg-accent text-white hover:bg-accent-hover
                     active:scale-[0.98] transition-all"
        >
          Подтверждаю
        </button>
        <button
          onClick={() => onConsent(false)}
          className="px-4 py-2 text-[12px] font-normal rounded-sm
                     border border-border text-muted hover:bg-warm-100
                     active:scale-[0.98] transition-all"
        >
          Отказ
        </button>
      </div>
    </motion.div>
  );
}
