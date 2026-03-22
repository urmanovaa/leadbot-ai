"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled,
  placeholder = "Напишите сообщение...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  };

  return (
    <div className="border-t border-border bg-surface px-4 py-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none rounded-sm border border-border bg-warm-50 px-3.5 py-2.5 text-[13px] text-ink
                     focus:outline-none focus:border-accent/30
                     disabled:opacity-40 disabled:cursor-not-allowed
                     placeholder:text-warm-400 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="flex-shrink-0 w-9 h-9 rounded-sm bg-accent text-white
                     flex items-center justify-center
                     hover:bg-accent-hover active:scale-[0.97]
                     disabled:opacity-30 disabled:cursor-not-allowed
                     transition-all duration-150"
        >
          <ArrowUp size={15} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
