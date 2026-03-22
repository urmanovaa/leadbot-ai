"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { RotateCcw, X, Minus } from "lucide-react";
import { ChatMessage, ChatStage, CollectedData, ChatApiResponse } from "@/lib/types";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { QuickActions } from "./quick-actions";
import { ConsentActions } from "./consent-actions";
import { TypingIndicator } from "./typing-indicator";

interface ChatWindowProps {
  onClose: () => void;
  onMinimize: () => void;
}

const GREETING_MESSAGE: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Здравствуйте! 👋 Я AI-консультант по digital-услугам. Чем могу помочь?\n\nВыберите тему или напишите свой вопрос:",
  timestamp: Date.now(),
};

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

export function ChatWindow({ onClose, onMinimize }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING_MESSAGE]);
  const [stage, setStage] = useState<ChatStage>("greeting");
  const [collectedData, setCollectedData] = useState<CollectedData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const sendMessage = async (content: string) => {
    setError(null);
    setShowQuickActions(false);

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const apiMessages = updatedMessages
        .filter((m) => m.id !== "greeting")
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          stage,
          collectedData,
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка сервера");
      }

      const data: ChatApiResponse = await response.json();

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: data.reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStage(data.stage);
      setCollectedData(data.collectedData);
    } catch {
      setError("Не удалось получить ответ. Попробуйте ещё раз.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsent = async (agreed: boolean) => {
    if (agreed) {
      const consentMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: "Подтверждаю согласие на обработку персональных данных",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, consentMessage]);
      setCollectedData((prev) => ({ ...prev, consentGiven: true }));
      setIsLoading(true);

      try {
        const allMessages = [...messages, consentMessage];
        const apiMessages = allMessages
          .filter((m) => m.id !== "greeting")
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            stage: "consent_request",
            collectedData: { ...collectedData, consentGiven: true },
          }),
        });

        if (!response.ok) throw new Error("Ошибка");

        const data: ChatApiResponse = await response.json();

        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: data.reply,
            timestamp: Date.now(),
          },
        ]);
        setStage(data.stage);
        setCollectedData(data.collectedData);
      } catch {
        setError("Ошибка при отправке. Попробуйте ещё раз.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "user",
          content: "Отказываюсь от обработки данных",
          timestamp: Date.now(),
        },
        {
          id: generateId(),
          role: "assistant",
          content:
            "Понимаю, без проблем. Если передумаете — напишите. Буду рад помочь! 😊",
          timestamp: Date.now(),
        },
      ]);
      setStage("qualification");
    }
  };

  const handleReset = () => {
    setMessages([GREETING_MESSAGE]);
    setStage("greeting");
    setCollectedData({});
    setIsLoading(false);
    setShowQuickActions(true);
    setError(null);
  };

  return (
    <div className="flex flex-col w-full h-full bg-warm-50 rounded-sm shadow-elevated overflow-hidden border border-border">
      {/* Header — warm, light */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <div>
            <h3 className="font-medium text-[13px] text-ink leading-tight">Ассистент</h3>
            <p className="text-[10px] text-muted mt-0.5">Онлайн</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleReset}
            className="w-7 h-7 rounded-sm hover:bg-warm-200 flex items-center justify-center transition-colors"
            title="Начать заново"
          >
            <RotateCcw size={13} strokeWidth={1.5} className="text-muted" />
          </button>
          <button
            onClick={onMinimize}
            className="w-7 h-7 rounded-sm hover:bg-warm-200 flex items-center justify-center transition-colors"
            title="Свернуть"
          >
            <Minus size={13} strokeWidth={1.5} className="text-muted" />
          </button>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-sm hover:bg-warm-200 flex items-center justify-center transition-colors"
            title="Закрыть"
          >
            <X size={13} strokeWidth={1.5} className="text-muted" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-5 space-y-4 scroll-smooth"
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>

        {isLoading && <TypingIndicator />}

        {error && (
          <div className="px-5">
            <div className="text-[12px] text-red-700/70 bg-red-50/50 rounded-sm px-4 py-2.5 border border-red-100/50">
              {error}
            </div>
          </div>
        )}

        {showQuickActions && stage === "greeting" && (
          <QuickActions actions={[]} onSelect={sendMessage} />
        )}

        {stage === "consent_request" &&
          !collectedData.consentGiven &&
          !isLoading && <ConsentActions onConsent={handleConsent} />}
      </div>

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        disabled={isLoading}
        placeholder={
          stage === "completed"
            ? "Заявка оформлена. Есть ещё вопросы?"
            : "Напишите сообщение..."
        }
      />
    </div>
  );
}
