import { useState, useEffect } from "react";

export function useCurrentTime() {
  const [time, setTime] = useState(() => {
    if (typeof window === "undefined") return "";
    return new Date().toLocaleTimeString();
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return time;
}
