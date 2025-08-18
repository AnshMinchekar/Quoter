import { useEffect, useRef, useState } from "react";

export function useLocalSetting<T>(key: string, initial: T) {
  const isSSR = typeof window === "undefined";
  const [value, setValue] = useState<T>(() => {
    if (isSSR) return initial;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);

  return [value, setValue] as const;
}

export default function useLocalSettings<S extends object>(key: string, initial: S) {
  return useLocalSetting<S>(key, initial);
}
