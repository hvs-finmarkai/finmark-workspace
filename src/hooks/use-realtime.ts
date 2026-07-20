import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Status } from "@/types";

type StatusChangePayload = {
  new: Status;
  old: Status;
};

export function useRealtime(onStatusChange: (payload: StatusChangePayload) => void) {
  const callbackRef = useRef(onStatusChange);
  callbackRef.current = onStatusChange;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const channel = supabase
      .channel("status-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Status",
        },
        (payload) => {
          callbackRef.current(payload as unknown as StatusChangePayload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
