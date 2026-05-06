export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6 sm:px-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <span className="text-[13px] font-normal text-ink/50 tracking-wide">
            Kamila Urmanova — AI Automation & Prompt Engineering
          </span>
          <span className="hidden sm:inline text-[11px] text-muted">·</span>
          <a
            href="https://t.me/kamiurrr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-muted hover:text-accent transition-colors"
          >
            @kamiurrr
          </a>
          <a
            href="mailto:camila-urm@yandex.ru"
            className="text-[12px] text-muted hover:text-accent transition-colors"
          >
            camila-urm@yandex.ru
          </a>
        </div>
        <p className="text-[11px] text-muted tracking-wide">
          © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
