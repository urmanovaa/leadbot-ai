"use client";

import { motion } from "framer-motion";
import { ChatMessage } from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex px-5 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 text-[13px] leading-[1.6] whitespace-pre-wrap ${
          isUser
            ? "bg-accent text-white rounded-sm"
            : "bg-warm-200/60 text-ink/80 rounded-sm"
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}
