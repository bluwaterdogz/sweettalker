import { useState, useCallback } from "react";

export interface Message {
  id: string;
  text: string;
  speaker: "user1" | "user2";
  timestamp: number;
}

export const useConversation = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<"user1" | "user2">(
    "user1"
  );

  const addMessage = useCallback(
    (text: string) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        speaker: currentSpeaker,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setCurrentSpeaker((prev) => (prev === "user1" ? "user2" : "user1"));

      return newMessage;
    },
    [currentSpeaker]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentSpeaker("user1");
  }, []);

  return {
    messages,
    currentSpeaker,
    addMessage,
    clearMessages,
  };
};
