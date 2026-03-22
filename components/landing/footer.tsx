export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6 sm:px-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[13px] font-normal text-ink/50 tracking-wide">
          LeadBot
        </span>
        <p className="text-[11px] text-muted tracking-wide">
          © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
