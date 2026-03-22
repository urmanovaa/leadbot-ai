"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X } from "lucide-react";
import { ChatWindow } from "./chat-window";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-[380px] h-[560px] sm:w-[400px] sm:h-[600px] max-h-[85vh] max-w-[calc(100vw-48px)]"
          >
            <ChatWindow onClose={handleClose} onMinimize={handleMinimize} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        data-chat-trigger
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={isOpen ? handleClose : handleOpen}
        className="w-12 h-12 rounded-sm bg-accent text-white shadow-card
                   flex items-center justify-center
                   hover:bg-accent-hover transition-colors duration-200 relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              <X size={18} strokeWidth={1.5} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              <MessageSquare size={18} strokeWidth={1.5} />
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent-soft rounded-full ring-2 ring-bg" />
        )}
      </motion.button>
    </div>
  );
}
