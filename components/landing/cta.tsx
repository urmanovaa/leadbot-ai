"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-32 px-6 sm:px-10 border-t border-border">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-24 items-center">
          <div>
            <span className="block text-[11px] uppercase tracking-[0.25em] text-muted font-normal mb-6">
              Начать
            </span>
            <h2 className="text-3xl sm:text-[2.5rem] font-light text-ink tracking-[-0.01em] leading-[1.15]">
              Собирайте заявки
              <br />
              на автопилоте
            </h2>
          </div>

          <div className="lg:border-l lg:border-border lg:pl-24">
            <p className="text-[15px] text-muted leading-[1.7] font-light mb-8 max-w-sm">
              Попробуйте AI-ассистента прямо сейчас. Нажмите на иконку чата
              в правом нижнем углу экрана.
            </p>
            <button
              onClick={() =>
                document
                  .querySelector("[data-chat-trigger]")
                  ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
              }
              className="group px-6 py-3 bg-accent text-white text-[13px] font-medium rounded-sm
                         hover:bg-accent-hover transition-colors duration-200
                         inline-flex items-center gap-2"
            >
              Открыть чат
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
