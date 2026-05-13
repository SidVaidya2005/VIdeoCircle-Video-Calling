import React, { useState, useEffect, useRef } from "react";
import { TextField, Button } from "@mui/material";
import { useChat } from "@livekit/components-react";
import styles from "../styles/videoComponent.module.css";

export default function ChatPanel({ showModal, setModal, onNewMessage }) {
  const { send, chatMessages, isSending } = useChat();
  const [message, setMessage] = useState("");
  const prevLengthRef = useRef(0);

  useEffect(() => {
    if (chatMessages.length > prevLengthRef.current) {
      onNewMessage?.();
      prevLengthRef.current = chatMessages.length;
    }
  }, [chatMessages.length, onNewMessage]);

  const sendMessage = async () => {
    if (!message.trim() || isSending) return;
    await send(message.trim());
    setMessage("");
  };

  if (!showModal) return null;

  return (
    <div className={styles.chatRoom}>
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          <h1>CHAT</h1>
          <button
            className={styles.chatCloseBtn}
            onClick={() => setModal(false)}
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        <div className={styles.chattingDisplay}>
          {chatMessages.length ? (
            chatMessages.map((msg) => (
              <div
                className={styles.chatMsg}
                key={`${msg.from?.identity}-${msg.timestamp}`}
              >
                <p className={styles.chatMsgFrom}>
                  {msg.from?.name || msg.from?.identity || "Unknown"}
                </p>
                <p className={styles.chatMsgBody}>{msg.message}</p>
              </div>
            ))
          ) : (
            <p className={styles.chatEmpty}>NO MESSAGES YET</p>
          )}
        </div>

        <div className={styles.chattingArea}>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            label="Message"
            variant="outlined"
            size="small"
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isSending || !message.trim()}
          >
            SEND
          </Button>
        </div>
      </div>
    </div>
  );
}
