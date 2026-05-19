import { useEffect, useRef, useState } from "react";

/**
 * Auto-save com debounce. Chama saveFn 800ms depois que `value` muda.
 * Retorna o status: 'idle' | 'saving' | 'saved' | 'error'
 */
export function useAutoSave<T>(value: T, saveFn: (v: T) => Promise<void>, delay = 800) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const firstRender = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStatus("saving");
    timeoutRef.current = setTimeout(async () => {
      try {
        await saveFn(value);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 1500);
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    }, delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return status;
}
