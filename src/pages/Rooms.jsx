import { useState, useRef, useEffect } from "react";
import "./Room.css";

const initialMessages = {
  1: [
    { id: 1, sender: "Ali Khan", text: "Hey! How's the project going?", time: "10:30 AM", avatar: "https://i.pravatar.cc/40?img=1", isOwn: false },
    { id: 2, sender: "You", text: "Going great! Just finished the UI components.", time: "10:32 AM", avatar: "https://i.pravatar.cc/40?img=10", isOwn: true },
    { id: 3, sender: "Ali Khan", text: "Nice! Can you push it to the repo?", time: "10:33 AM", avatar: "https://i.pravatar.cc/40?img=1", isOwn: false },
    { id: 4, sender: "You", text: "Sure, give me 5 minutes 🚀", time: "10:34 AM", avatar: "https://i.pravatar.cc/40?img=10", isOwn: true },
  ],
  2: [
    { id: 1, sender: "Sara Ahmed", text: "Did you see the new design specs?", time: "9:15 AM", avatar: "https://i.pravatar.cc/40?img=2", isOwn: false },
    { id: 2, sender: "You", text: "Yes! They look amazing. Love the color scheme.", time: "9:20 AM", avatar: "https://i.pravatar.cc/40?img=10", isOwn: true },
  ],
  3: [
    { id: 1, sender: "Usman Tariq", text: "Meeting at 3pm today?", time: "11:00 AM", avatar: "https://i.pravatar.cc/40?img=3", isOwn: false },
  ],
  4: [
    { id: 1, sender: "Hassan Raza", text: "Check out this new framework I found!", time: "Yesterday", avatar: "https://i.pravatar.cc/40?img=4", isOwn: false },
    { id: 2, sender: "Ali Khan", text: "Looks interesting, what's the performance like?", time: "Yesterday", avatar: "https://i.pravatar.cc/40?img=1", isOwn: false },
    { id: 3, sender: "You", text: "I've used it before — it's blazing fast ⚡", time: "Yesterday", avatar: "https://i.pravatar.cc/40?img=10", isOwn: true },
    { id: 4, sender: "Sara Ahmed", text: "Let's try it in our next sprint", time: "Today", avatar: "https://i.pravatar.cc/40?img=2", isOwn: false },
    { id: 5, sender: "Usman Tariq", text: "I'll set up the boilerplate tonight", time: "Today", avatar: "https://i.pravatar.cc/40?img=3", isOwn: false },
  ],
  5: [
    { id: 1, sender: "Hassan Raza", text: "Hey, long time no see!", time: "2 days ago", avatar: "https://i.pravatar.cc/40?img=5", isOwn: false },
  ],
};

export default function Rooms() {
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const chats = [
    { id: 1, name: "Ali Khan", unread: 2, online: true, avatar: "https://i.pravatar.cc/40?img=1", status: "Coding something cool..." },
    { id: 2, name: "Sara Ahmed", unread: 0, online: false, avatar: "https://i.pravatar.cc/40?img=2", status: "Away" },
    { id: 3, name: "Usman Tariq", unread: 1, online: true, avatar: "https://i.pravatar.cc/40?img=3", status: "In a meeting" },
    { id: 4, name: "Project Team", unread: 5, online: false, avatar: "https://i.pravatar.cc/40?img=4", status: "5 members" },
    { id: 5, name: "Hassan Raza", unread: 0, online: false, avatar: "https://i.pravatar.cc/40?img=5", status: "Offline" },
  ];

  const quickEmojis = ["😀", "😂", "❤️", "🔥", "👍", "🎉", "💯", "✨", "🚀", "😎"];

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activatedChat = chats.find((chat) => chat.id === activeId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeId]);

  useEffect(() => {
    if (activeId) {
      inputRef.current?.focus();
    }
  }, [activeId]);

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleSend = () => {
    if (!inputValue.trim() || !activeId) return;

    const newMsg = {
      id: Date.now(),
      sender: "You",
      text: inputValue.trim(),
      time: getCurrentTime(),
      avatar: "https://i.pravatar.cc/40?img=10",
      isOwn: true,
    };

    setMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMsg],
    }));
    setInputValue("");
    setShowEmojiPicker(false);

    // Simulate reply after a delay
    if (activatedChat) {
      setIsTyping(true);
      const replies = [
        "That sounds awesome! 🎉",
        "Got it, thanks! 👍",
        "I'll look into that.",
        "Haha, nice one! 😂",
        "Let me check and get back to you.",
        "Perfect, let's do it! 🚀",
        "Interesting... tell me more!",
        "On it! Give me a sec.",
      ];
      const delay = 1000 + Math.random() * 2000;
      setTimeout(() => {
        setIsTyping(false);
        const reply = {
          id: Date.now() + 1,
          sender: activatedChat.name,
          text: replies[Math.floor(Math.random() * replies.length)],
          time: getCurrentTime(),
          avatar: activatedChat.avatar,
          isOwn: false,
        };
        setMessages((prev) => ({
          ...prev,
          [activeId]: [...(prev[activeId] || []), reply],
        }));
      }, delay);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji) => {
    setInputValue((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const getLastMessage = (chatId) => {
    const msgs = messages[chatId];
    if (!msgs || msgs.length === 0) return "No messages yet";
    const last = msgs[msgs.length - 1];
    const prefix = last.isOwn ? "You: " : "";
    const text = prefix + last.text;
    return text.length > 30 ? text.slice(0, 30) + "..." : text;
  };

  return (
    <section className="rooms-page">
      {/* Background effects */}
      <div className="rooms-bg">
        <div className="rooms-orb rooms-orb-a" />
        <div className="rooms-orb rooms-orb-b" />
        <div className="rooms-noise" />
      </div>

      <div className="rooms-container">
        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-content">
            {/* Search */}
            <div className="sidebar-search">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Nav Items */}
          <div className="sidebar-nav">
            <div className="nav-item">
              <span className="nav-icon">👤</span>
              <span>Friends</span>
            </div>
            <div className="nav-item active-item">
              <span className="nav-icon">💬</span>
              <span>Messages</span>
              <span className="nav-badge">
                {chats.reduce((sum, c) => sum + c.unread, 0)}
              </span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">🎙️</span>
              <span>Voice</span>
            </div>
          </div>

          {/* Section Header */}
          <div className="sidebar-section-header">
            <span>Direct Messages</span>
            <button className="add-btn" title="New message">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Chat List */}
          <div className="chat-list">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${activeId === chat.id ? "active" : ""}`}
                onClick={() => setActiveId(chat.id)}
              >
                <div className="chat-avatar-wrap">
                  <img className="chat-avatar" src={chat.avatar} alt={chat.name} />
                  <span className={`status-indicator ${chat.online ? "online" : "offline"}`} />
                </div>
                <div className="chat-item-info">
                  <span className="chat-item-name">{chat.name}</span>
                  <span className="chat-item-preview">{getLastMessage(chat.id)}</span>
                </div>
                {chat.unread > 0 && <div className="unread-badge">{chat.unread}</div>}
              </div>
            ))}
            {filteredChats.length === 0 && (
              <div className="no-results">No conversations found</div>
            )}
          </div>
        </div>

          {/* User Footer */}
          <div className="sidebar-footer">
            <div className="sidebar-footer-left">
              <div className="chat-avatar-wrap">
                <img className="chat-avatar" src="https://i.pravatar.cc/40?img=10" alt="You" />
                <span className="status-indicator online" />
              </div>
              <div className="sidebar-footer-info">
                <div className="footer-name">Mudasir Hussain</div>
                <div className="footer-status">Online</div>
              </div>
            </div>
            <div className="sidebar-footer-actions">
              <button className="action-btn" title="Mute">🎙</button>
              <button className="action-btn" title="Deafen">🎧</button>
              <button className="action-btn" title="Settings">⚙️</button>
            </div>
          </div>
        </aside>

        {/* ── CHAT AREA ── */}
        <main className="chat-area">
          <div className="chat-body">
            {activatedChat ? (
              <div className="chat-panel">
              {/* Chat Header */}
              <div className="chat-header">
                <div className="header-left">
                  <div className="chat-avatar-wrap">
                    <img className="chat-avatar" src={activatedChat.avatar} alt={activatedChat.name} />
                    <span className={`status-indicator ${activatedChat.online ? "online" : "offline"}`} />
                  </div>
                  <div className="header-info">
                    <h2 className="header-name">{activatedChat.name}</h2>
                    <p className="header-status">{activatedChat.status}</p>
                  </div>
                </div>
                <div className="header-actions">
                  <button className="header-btn" title="Voice Call">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22 16.92V20a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3.09a2 2 0 0 1 2 1.72c.12.89.32 1.76.59 2.59a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.49-1.25a2 2 0 0 1 2.11-.45c.83.27 1.7.47 2.59.59A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button className="header-btn" title="Video Call">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M16 10L22 7V17L16 14V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button className="header-btn" title="Pin">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container">
                {/* Chat beginning */}
                <div className="chat-beginning">
                  <img className="beginning-avatar" src={activatedChat.avatar} alt={activatedChat.name} />
                  <h3>{activatedChat.name}</h3>
                  <p>This is the beginning of your direct message history with <strong>{activatedChat.name}</strong>.</p>
                </div>

                {(messages[activeId] || []).map((msg) => (
                  <div key={msg.id} className={`message ${msg.isOwn ? "own" : ""}`}>
                    {!msg.isOwn && (
                      <img className="message-avatar" src={msg.avatar} alt={msg.sender} />
                    )}
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-sender">{msg.sender}</span>
                        <span className="message-time">{msg.time}</span>
                      </div>
                      <div className="message-bubble">
                        <p>{msg.text}</p>
                      </div>
                    </div>
                    {msg.isOwn && (
                      <img className="message-avatar" src={msg.avatar} alt={msg.sender} />
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="message">
                    <img className="message-avatar" src={activatedChat.avatar} alt={activatedChat.name} />
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="chat-input-area">
                {showEmojiPicker && (
                  <div className="emoji-picker">
                    {quickEmojis.map((emoji, i) => (
                      <button key={i} className="emoji-btn" onClick={() => addEmoji(emoji)}>
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
                <div className="input-wrapper">
                  <button
                    className="input-action-btn"
                    title="Add attachment"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={`Message ${activatedChat.name}...`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="message-input"
                  />
                  <button
                    className="input-action-btn"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    title="Emoji"
                  >
                    😊
                  </button>
                  <button
                    className={`send-btn ${inputValue.trim() ? "active" : ""}`}
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    title="Send message"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h2>Welcome to ChatApp</h2>
              <p>Select a conversation from the sidebar to start chatting</p>
              <div className="empty-features">
                <div className="empty-feature">
                  <span>🔒</span>
                  <span>End-to-end encrypted</span>
                </div>
                <div className="empty-feature">
                  <span>⚡</span>
                  <span>Real-time messaging</span>
                </div>
                <div className="empty-feature">
                  <span>🎙️</span>
                  <span>Voice & video calls</span>
                </div>
              </div>
            </div>
          )}
          </div>
        </main>
      </div>
    </section>
  );
}
