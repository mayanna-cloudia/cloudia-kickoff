import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={isDark ? "Tema claro" : "Tema escuro"}
      className={cn(
        "group relative inline-flex h-9 w-16 items-center rounded-full border border-border bg-secondary/60 px-1 transition-colors hover:bg-secondary cursor-pointer",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border transition-transform duration-300",
          isDark ? "translate-x-0" : "translate-x-7",
        )}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-primary" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-primary" />
        )}
      </span>
      <Sun
        className={cn(
          "absolute right-2 h-3.5 w-3.5 transition-opacity",
          isDark ? "opacity-40 text-muted-foreground" : "opacity-0",
        )}
      />
      <Moon
        className={cn(
          "absolute left-2 h-3.5 w-3.5 transition-opacity",
          isDark ? "opacity-0" : "opacity-40 text-muted-foreground",
        )}
      />
    </button>
  );
}
