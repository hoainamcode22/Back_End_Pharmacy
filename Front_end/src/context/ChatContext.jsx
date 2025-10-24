import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// Simple in-memory + localStorage conversation store for demo
// Conversation shape: { id, title?, attachment?: { type: 'product'|'prescription', id, name, price?, image? },
//   messages: [{ id, from: 'me'|'admin'|'bot', text, at }] }
const ChatContext = createContext();

function loadStore() {
  try { return JSON.parse(localStorage.getItem("ph_chat") || "{}"); } catch { return {}; }
}
function saveStore(data) {
  try { localStorage.setItem("ph_chat", JSON.stringify(data)); } catch {}
}

export function ChatProvider({ children }) {
  const [store, setStore] = useState(loadStore);
  useEffect(() => { saveStore(store); }, [store]);

  const threads = useMemo(() => store.threads || [], [store]);
  const currentId = useMemo(() => store.currentId || null, [store]);
  const current = useMemo(() => threads.find(t => t.id === currentId) || null, [threads, currentId]);

  const openThread = (thread) => {
    setStore((s) => {
      const exists = (s.threads || []).find((t) => t.id === thread.id);
      const threads = exists ? s.threads.map(t => t.id === thread.id ? { ...exists, ...thread } : t) : [ ...(s.threads||[]), { ...thread, messages: thread.messages || [] } ];
      return { ...s, threads, currentId: thread.id };
    });
  };

  const prefillAndOpen = (attachment, opts = {}) => {
    const id = `${attachment.type}:${attachment.id}`;
    const title = opts.title || (attachment.type === 'product' ? `Tư vấn sản phẩm: ${attachment.name}` : `Tư vấn đơn thuốc #${attachment.id}`);
    openThread({ id, title, attachment });
  };

  const send = (text) => {
    if (!store.currentId) return;
    setStore((s) => {
      const threads = (s.threads || []).map((t) => {
        if (t.id !== s.currentId) return t;
        const msg = { id: Date.now(), from: 'me', text, at: new Date().toISOString() };
        return { ...t, messages: [...(t.messages||[]), msg] };
      });
      return { ...s, threads };
    });
  };

  const value = { threads, current, currentId, openThread, prefillAndOpen, send };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  return useContext(ChatContext);
}
