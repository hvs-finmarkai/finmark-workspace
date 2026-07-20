import { create } from "zustand";
import { StatusType } from "@/types";

interface StatusState {
  status: StatusType;
  statusMessage: string;
  setStatus: (status: StatusType) => void;
  setStatusMessage: (msg: string) => void;
  updateStatus: (status: StatusType, message: string) => Promise<void>;
}

export const useStatusStore = create<StatusState>((set) => ({
  status: StatusType.AVAILABLE,
  statusMessage: "",
  setStatus: (status) => set({ status }),
  setStatusMessage: (statusMessage) => set({ statusMessage }),
  updateStatus: async (status, message) => {
    const res = await fetch("/api/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, statusMessage: message }),
    });

    if (res.ok) {
      set({ status, statusMessage: message });
    }
  },
}));
