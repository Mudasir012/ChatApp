import { useState, useRef, useEffect, useCallback } from "react";
import "./Room.css";

/* ─── DATA ─────────────────────────────────── */
const groups = [
  {
    id: 1, name: "Dev Server", icon: "⚡", description: "Engineering & shipping",
    boards: [
      { id: 1, name: "general",     topic: "Team updates & announcements", unread: 2,  pinned: true  },
      { id: 2, name: "development", topic: "Feature work and code reviews",  unread: 1,  pinned: false },
      { id: 3, name: "design",      topic: "UI ideas, mockups & assets",      unread: 0,  pinned: false },
      { id: 4, name: "random",      topic: "Memes, music, and vibes",         unread: 5,  pinned: false },
    ],
  },
  {
    id: 2, name: "Product", icon: "🚀", description: "Launches & planning",
    boards: [
      { id: 5, name: "sprint-plan",   topic: "Daily goals and sprint planning", unread: 0, pinned: false },
      { id: 6, name: "release-notes", topic: "Deploys and changelog",           unread: 0, pinned: false },
      { id: 7, name: "support",       topic: "Bug reports and fixes",           unread: 3, pinned: true  },
    ],
  },
  {
    id: 3, name: "Community", icon: "🌐", description: "Open for all",
    boards: [
      { id: 8,  name: "announcements", topic: "Server news",          unread: 0, pinned: true  },
      { id: 9,  name: "meetups",       topic: "Events and hangouts",  unread: 2, pinned: false },
      { id: 10, name: "memes",         topic: "Fun stuff from team",  unread: 6, pinned: false },
    ],
  },
];

const dms = [
  { id: 1, name: "Ali Khan",      online: true,  avatar: "https://i.pravatar.cc/40?img=1",  status: "Coding something cool" },
  { id: 2, name: "Sara Ahmed",    online: false, avatar: "https://i.pravatar.cc/40?img=2",  status: "Away" },
  { id: 3, name: "Usman Tariq",   online: true,  avatar: "https://i.pravatar.cc/40?img=3",  status: "In a meeting" },
  { id: 4, name: "Project Team",  online: false, avatar: "https://i.pravatar.cc/40?img=4",  status: "5 members" },
  { id: 5, name: "Hassan Raza",   online: false, avatar: "https://i.pravatar.cc/40?img=5",  status: "Offline" },
];

const QUICK_REPLIES = [
  "That sounds awesome! 🎉", "Got it, thanks! 👍", "I'll look into that.",
  "Haha, nice one! 😂", "Let me check and get back to you.",
  "Perfect, let's do it! 🚀", "Interesting... tell me more!", "On it! Give me a sec.",
];

const EMOJI_SET = ["👍", "❤️", "😂", "🔥", "🎉", "👀"];
const QUICK_EMOJIS = ["😊", "😂", "👍", "🔥", "🎉", "💬", "❤️", "🚀"];

const seedMessages = (key, msgs) =>
  msgs.map((m, i) => ({ ...m, id: i + 1, reactions: {} }));

const initialMessages = {
  "channel-1": seedMessages("c1", [
    { sender: "Ali Khan", text: "Welcome to #general. Share your updates here.", time: "10:30 AM", avatar: "https://i.pravatar.cc/40?img=1", isOwn: false },
    { sender: "You",      text: "Just finished the sidebar adjustments 🙌", time: "10:32 AM", avatar: "https://i.pravatar.cc/40?img=10", isOwn: true  },
    { sender: "Sara Ahmed", text: "This feels much more like a real server now!", time: "10:33 AM", avatar: "https://i.pravatar.cc/40?img=2", isOwn: false },
    { sender: "Sara Ahmed", text: "Great work on the dark theme too 🌙", time: "10:33 AM", avatar: "https://i.pravatar.cc/40?img=2", isOwn: false },
  ]),
  "channel-2": seedMessages("c2", [
    { sender: "Dev Bot", text: "PR #42 is ready for review.", time: "9:15 AM", avatar: "https://i.pravatar.cc/40?img=8", isOwn: false },
    { sender: "You",     text: "I'll review it before standup.", time: "9:20 AM", avatar: "https://i.pravatar.cc/40?img=10", isOwn: true  },
    { sender: "Dev Bot", text: "Reminder: standup in 10 minutes!", time: "9:50 AM", avatar: "https://i.pravatar.cc/40?img=8", isOwn: false },
  ]),
  "channel-3": seedMessages("c3", [
    { sender: "Design Lead", text: "Mockups are uploaded to Figma.", time: "11:00 AM", avatar: "https://i.pravatar.cc/40?img=12", isOwn: false },
  ]),
  "channel-4": seedMessages("c4", [
    { sender: "Hassan Raza", text: "Who's up for a quick game later?", time: "Yesterday", avatar: "https://i.pravatar.cc/40?img=5", isOwn: false },
    { sender: "You",         text: "Count me in!",                      time: "Yesterday", avatar: "https://i.pravatar.cc/40?img=10", isOwn: true  },
  ]),
  "channel-7": seedMessages("c7", [
    { sender: "Usman Tariq", text: "Found a bug in the login flow — will file a ticket.", time: "2:00 PM", avatar: "https://i.pravatar.cc/40?img=3", isOwn: false },
    { sender: "You",         text: "Got it, I'll look into it now.",                      time: "2:05 PM", avatar: "https://i.pravatar.cc/40?img=10", isOwn: true  },
    { sender: "Usman Tariq", text: "Ticket #88 filed. Thanks!", time: "2:10 PM", avatar: "https://i.pravatar.cc/40?img=3", isOwn: false },
  ]),
  "dm-1": seedMessages("d1", [
    { sender: "Ali Khan", text: "Hey! How's the project going?",           time: "10:30 AM", avatar: "https://i.pravatar.cc/40?img=1", isOwn: false },
    { sender: "You",      text: "Going great! Just finished the UI work.",  time: "10:32 AM", avatar: "https://i.pravatar.cc/40?img=10", isOwn: true  },
    { sender: "Ali Khan", text: "Nice. Push it to staging when ready 👍",   time: "10:34 AM", avatar: "https://i.pravatar.cc/40?img=1", isOwn: false },
  ]),
  "dm-2": seedMessages("d2", [
    { sender: "Sara Ahmed", text: "Did you see the new design specs?", time: "9:15 AM", avatar: "https://i.pravatar.cc/40?img=2", isOwn: false },
  ]),
  "dm-3": seedMessages("d3", [
    { sender: "Usman Tariq", text: "Meeting at 3pm today?", time: "11:00 AM", avatar: "https://i.pravatar.cc/40?img=3", isOwn: false },
    { sender: "You",         text: "Yep, I'll be there!",    time: "11:01 AM", avatar: "https://i.pravatar.cc/40?img=10", isOwn: true  },
  ]),
  "dm-4": seedMessages("d4", [
    { sender: "Project Team", text: "Check out this new framework I found!", time: "Yesterday", avatar: "https://i.pravatar.cc/40?img=4", isOwn: false },
  ]),
  "dm-5": seedMessages("d5", [
    { sender: "Hassan Raza", text: "Hey, long time no see!", time: "2 days ago", avatar: "https://i.pravatar.cc/40?img=5", isOwn: false },
  ]),
};

/* ─── HELPERS ──────────────────────────────── */
const getCurrentTime = () => {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
};

const getLastMessage = (messages, roomKey) => {
  const msgs = messages[roomKey];
  if (!msgs?.length) return "No messages yet";
  const last = msgs[msgs.length - 1];
  const t = (last.isOwn ? "You: " : "") + last.text;
  return t.length > 28 ? t.slice(0, 28) + "…" : t;
};

/* ─── COMPONENT ────────────────────────────── */
export default function Rooms() {
  const [activeRoom, setActiveRoom]       = useState({ type: "channel", id: 1 });
  const [selectedGroupId, setSelectedGroupId] = useState(1);
  const [activePanel, setActivePanel]     = useState("group");
  const [messages, setMessages]           = useState(initialMessages);
  const [inputValue, setInputValue]       = useState("");
  const [searchQuery, setSearchQuery]     = useState("");
  const [isTyping, setIsTyping]           = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showJumpPill, setShowJumpPill]   = useState(false);
  const [unreadCounts, setUnreadCounts]   = useState(() => {
    const map = {};
    groups.forEach(g => g.boards.forEach(b => { map[`channel-${b.id}`] = b.unread; }));
    dms.forEach(d => { map[`dm-${d.id}`] = d.unread || 0; });
    return map;
  });

  const messagesEndRef    = useRef(null);
  const messagesScrollRef = useRef(null);
  const inputRef          = useRef(null);

  const activeRoomKey = `${activeRoom.type}-${activeRoom.id}`;

  const allBoards      = groups.flatMap(g => g.boards);
  const selectedGroup  = groups.find(g => g.id === selectedGroupId);
  const activatedRoom  = activeRoom.type === "channel"
    ? allBoards.find(b => b.id === activeRoom.id)
    : dms.find(d => d.id === activeRoom.id);

  const normalizedQuery = searchQuery.toLowerCase();
  const filteredDms     = dms.filter(d => d.name.toLowerCase().includes(normalizedQuery));

  /* clear unread on room switch */
  useEffect(() => {
    setUnreadCounts(prev => ({ ...prev, [activeRoomKey]: 0 }));
  }, [activeRoomKey]);

  /* scroll to bottom */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, activeRoomKey, scrollToBottom]);

  /* jump pill */
  useEffect(() => {
    const el = messagesScrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowJumpPill(distFromBottom > 200);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  /* focus input on room switch */
  useEffect(() => { inputRef.current?.focus(); }, [activeRoom.id]);

  /* navigation */
  const handleGroupClick = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    setSelectedGroupId(groupId);
    setActivePanel("group");
    setActiveRoom({ type: "channel", id: group.boards[0].id });
    setSearchQuery("");
  };

  const openDMPanel = () => {
    setActivePanel("dms");
    setSelectedGroupId(null);
    setActiveRoom({ type: "dm", id: dms[0].id });
    setSearchQuery("");
  };

  /* send message */
  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: "You",
      text: inputValue.trim(),
      time: getCurrentTime(),
      avatar: "https://i.pravatar.cc/40?img=10",
      isOwn: true,
      reactions: {},
    };
    setMessages(prev => ({
      ...prev,
      [activeRoomKey]: [...(prev[activeRoomKey] || []), newMsg],
    }));
    setInputValue("");
    setShowEmojiPicker(false);

    if (activatedRoom) {
      setIsTyping(true);
      const delay = 900 + Math.random() * 1600;
      setTimeout(() => {
        setIsTyping(false);
        const reply = {
          id: Date.now() + 1,
          sender: activeRoom.type === "channel" ? "Server Bot" : activatedRoom.name,
          text: QUICK_REPLIES[Math.floor(Math.random() * QUICK_REPLIES.length)],
          time: getCurrentTime(),
          avatar: activeRoom.type === "channel" ? "https://i.pravatar.cc/40?img=15" : activatedRoom.avatar,
          isOwn: false,
          reactions: {},
        };
        setMessages(prev => ({
          ...prev,
          [activeRoomKey]: [...(prev[activeRoomKey] || []), reply],
        }));
      }, delay);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  /* react to message */
  const handleReact = (msgId, emoji) => {
    setMessages(prev => {
      const msgs = prev[activeRoomKey] || [];
      return {
        ...prev,
        [activeRoomKey]: msgs.map(msg => {
          if (msg.id !== msgId) return msg;
          const reactions = { ...msg.reactions };
          if (!reactions[emoji]) reactions[emoji] = { count: 0, mine: false };
          if (reactions[emoji].mine) {
            reactions[emoji] = { count: reactions[emoji].count - 1, mine: false };
            if (reactions[emoji].count === 0) delete reactions[emoji];
          } else {
            reactions[emoji] = { count: reactions[emoji].count + 1, mine: true };
          }
          return { ...msg, reactions };
        }),
      };
    });
  };

  const addEmoji = (emoji) => {
    setInputValue(prev => prev + emoji);
    inputRef.current?.focus();
  };

  /* total unread per group */
  const groupUnread = (groupId) => {
    const g = groups.find(x => x.id === groupId);
    if (!g) return 0;
    return g.boards.reduce((sum, b) => sum + (unreadCounts[`channel-${b.id}`] || 0), 0);
  };

  const dmTotalUnread = dms.reduce((sum, d) => sum + (unreadCounts[`dm-${d.id}`] || 0), 0);

  /* message grouping helper */
  const isGrouped = (msgs, idx) => {
    if (idx === 0) return false;
    return msgs[idx].sender === msgs[idx - 1].sender &&
      msgs[idx].isOwn === msgs[idx - 1].isOwn;
  };

  /* online count */
  const onlineCount = dms.filter(d => d.online).length;

  /* boards filtered */
  const filteredBoards = (selectedGroup?.boards || []).filter(b =>
    b.name.toLowerCase().includes(normalizedQuery) ||
    b.topic.toLowerCase().includes(normalizedQuery)
  );

  /* ── RENDER ── */
  return (
    <section className="rooms-page">
      <div className="rooms-bg">
        <div className="rooms-orb rooms-orb-a" />
        <div className="rooms-orb rooms-orb-b" />
        <div className="rooms-orb rooms-orb-c" />
        <div className="rooms-noise" />
      </div>

      <div className="rooms-container">
        {/* ════ SIDEBAR ════ */}
        <aside className="sidebar">
          {/* Primary strip */}
          <div className="sidebar-primary">
            <div className="sidebar-logo">⚡</div>

            <div className="group-list">
              {groups.map(group => {
                const u = groupUnread(group.id);
                return (
                  <button
                    key={group.id}
                    type="button"
                    className={`group-item ${selectedGroupId === group.id && activePanel === "group" ? "active" : ""}`}
                    onClick={() => handleGroupClick(group.id)}
                    title={group.name}
                    style={{ position: "relative" }}
                  >
                    <span>{group.icon}</span>
                    {u > 0 && (
                      <span style={{
                        position: "absolute", top: -3, right: -3,
                        background: "var(--red)", color: "#fff",
                        fontSize: 9, fontWeight: 700,
                        width: 16, height: 16, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "2px solid var(--bg-deep)", fontFamily: "var(--font-display)",
                      }}>{u > 9 ? "9+" : u}</span>
                    )}
                  </button>
                );
              })}

              <div className="group-divider" />

              <button
                type="button"
                className={`dm-toggle ${activePanel === "dms" ? "active" : ""}`}
                onClick={openDMPanel}
                title="Direct Messages"
                style={{ position: "relative" }}
              >
                DM
                {dmTotalUnread > 0 && (
                  <span style={{
                    position: "absolute", top: -3, right: -3,
                    background: "var(--red)", color: "#fff",
                    fontSize: 9, fontWeight: 700,
                    width: 16, height: 16, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "2px solid var(--bg-deep)", fontFamily: "var(--font-display)",
                  }}>{dmTotalUnread > 9 ? "9+" : dmTotalUnread}</span>
                )}
              </button>
            </div>

            {/* User avatar at bottom */}
            <div style={{ marginTop: "auto", padding: "0 0 4px" }}>
              <div className="chat-avatar-wrap" style={{ cursor: "pointer" }}>
                <img className="chat-avatar" src="https://i.pravatar.cc/40?img=10" alt="You" />
                <span className="status-indicator online" />
              </div>
            </div>
          </div>

          {/* Secondary panel */}
          <div className="sidebar-secondary">
            <div className="sidebar-secondary-header">
              <div>
                <p className="workspace-title">
                  {activePanel === "dms" ? "Messages" : selectedGroup?.name || "Channels"}
                </p>
                <p className="workspace-subtitle">
                  {activePanel === "dms"
                    ? `${onlineCount} online now`
                    : selectedGroup?.description || "Pick a board"}
                </p>
              </div>
              <button className="workspace-action" title="New">+</button>
            </div>

            <div className="sidebar-search">
              <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder={activePanel === "dms" ? "Search people…" : "Search channels…"}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="panel-list">
              {activePanel === "dms" ? (
                filteredDms.length > 0 ? filteredDms.map(chat => (
                  <button
                    key={chat.id}
                    type="button"
                    className={`panel-item ${activeRoom.type === "dm" && activeRoom.id === chat.id ? "active" : ""}`}
                    onClick={() => { setActiveRoom({ type: "dm", id: chat.id }); }}
                  >
                    <div className="chat-avatar-wrap">
                      <img className="chat-avatar" src={chat.avatar} alt={chat.name} />
                      <span className={`status-indicator ${chat.online ? "online" : "offline"}`} />
                    </div>
                    <div className="panel-item-info">
                      <span className="panel-item-title">{chat.name}</span>
                      <span className="panel-item-meta">{getLastMessage(messages, `dm-${chat.id}`)}</span>
                    </div>
                    {(unreadCounts[`dm-${chat.id}`] || 0) > 0 &&
                      <div className="channel-badge">{unreadCounts[`dm-${chat.id}`]}</div>}
                  </button>
                )) : (
                  <div className="no-results">No conversations found</div>
                )
              ) : (
                filteredBoards.length > 0 ? filteredBoards.map(board => (
                  <button
                    key={board.id}
                    type="button"
                    className={`panel-item ${activeRoom.type === "channel" && activeRoom.id === board.id ? "active" : ""}`}
                    onClick={() => setActiveRoom({ type: "channel", id: board.id })}
                  >
                    <div className="panel-item-info">
                      <span className="panel-item-title" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ color: "var(--text-3)", fontSize: 11, fontWeight: 400 }}>#</span>
                        {board.name}
                        {board.pinned && <span style={{ fontSize: 10, opacity: 0.5, marginLeft: 2 }}>📌</span>}
                      </span>
                      <span className="panel-item-meta">{board.topic}</span>
                    </div>
                    {(unreadCounts[`channel-${board.id}`] || 0) > 0 &&
                      <div className="channel-badge">{unreadCounts[`channel-${board.id}`]}</div>}
                  </button>
                )) : (
                  <div className="no-results">No channels found</div>
                )
              )}
            </div>

            <div className="sidebar-footer">
              <div className="sidebar-footer-left">
                <div className="chat-avatar-wrap">
                  <img className="chat-avatar" src="https://i.pravatar.cc/40?img=10" alt="You" />
                  <span className="status-indicator online" />
                </div>
                <div className="sidebar-footer-info">
                  <div className="footer-name">Mudasir</div>
                  <div className="footer-status">● Online</div>
                </div>
              </div>
              <div className="sidebar-footer-actions">
                <button className="action-btn" title="Mute">🎙</button>
                <button className="action-btn" title="Settings">⚙️</button>
              </div>
            </div>
          </div>
        </aside>

        {/* ════ CHAT AREA ════ */}
        <div className="chat-area">
          <div className="chat-body">
            <div className="chat-panel">

              {/* Header */}
              <div className="chat-header">
                <div className="header-left">
                  <div className="header-channel-icon">
                    {activeRoom.type === "channel"
                      ? <span style={{ color: "var(--text-3)", fontSize: 13, fontWeight: 400 }}>#</span>
                      : activatedRoom?.avatar
                        ? <img src={activatedRoom.avatar} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                        : "?"}
                  </div>
                  <div className="header-info">
                    <h2 className="header-name">
                      {activeRoom.type === "channel"
                        ? activatedRoom?.name || "general"
                        : activatedRoom?.name || "DM"}
                    </h2>
                    <p className="header-status">
                      {activeRoom.type === "channel" ? (
                        activatedRoom?.topic
                      ) : (
                        <>
                          {activatedRoom?.online && <span className="header-online-dot" />}
                          {activatedRoom?.status}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="header-actions">
                  <button className="header-btn" title="Members">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
                      <path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.87" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontSize: 11, fontFamily: "var(--font-display)" }}>
                      {onlineCount} online
                    </span>
                  </button>
                  <div className="header-divider" />
                  <button className="header-btn" title="Search">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="7"/>
                      <path d="M16 16L21 21" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button className="header-btn" title="Settings">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container" ref={messagesScrollRef}>
                {/* Channel intro */}
                {(messages[activeRoomKey]?.length || 0) > 0 && (
                  <div className="chat-beginning">
                    <div className="beginning-icon">
                      {activeRoom.type === "channel" ? "#" : activatedRoom?.avatar
                        ? <img src={activatedRoom.avatar} alt="" style={{ width: 36, height: 36, borderRadius: "50%" }} />
                        : "💬"}
                    </div>
                    <h3>
                      {activeRoom.type === "channel"
                        ? `Welcome to #${activatedRoom?.name}`
                        : `Chat with ${activatedRoom?.name}`}
                    </h3>
                    <p>
                      {activeRoom.type === "channel"
                        ? activatedRoom?.topic
                        : "Your direct messages are just between you two."}
                    </p>
                  </div>
                )}

                {/* Empty state */}
                {(!messages[activeRoomKey] || messages[activeRoomKey].length === 0) && (
                  <div className="chat-beginning">
                    <div className="beginning-icon">💬</div>
                    <h3>Start the conversation</h3>
                    <p>Be the first to say something in {activeRoom.type === "channel" ? `#${activatedRoom?.name}` : activatedRoom?.name}</p>
                  </div>
                )}

                <div className="date-divider">Today</div>

                {/* Message list */}
                {(messages[activeRoomKey] || []).map((message, idx, arr) => {
                  const grouped = isGrouped(arr, idx);
                  return (
                    <div
                      key={message.id}
                      className={`message-group ${message.isOwn ? "own" : ""} ${grouped ? "grouped" : ""}`}
                    >
                      {!grouped
                        ? <img className="message-avatar" src={message.avatar} alt={message.sender} />
                        : <div className="avatar-ghost" />}
                      <div className="message-content">
                        {!grouped && (
                          <div className="message-meta">
                            <span className="message-sender">{message.sender}</span>
                            <span className="message-time">{message.time}</span>
                          </div>
                        )}
                        <div className="message-bubble">
                          {/* Reaction bar */}
                          <div className="react-bar">
                            {EMOJI_SET.map(e => (
                              <button key={e} className="react-btn" onClick={() => handleReact(message.id, e)}>
                                {e}
                              </button>
                            ))}
                          </div>
                          <p>{message.text}</p>
                        </div>
                        {/* Reactions display */}
                        {Object.keys(message.reactions || {}).length > 0 && (
                          <div className="reactions">
                            {Object.entries(message.reactions).map(([emoji, data]) => (
                              <button
                                key={emoji}
                                className={`reaction-chip ${data.mine ? "mine" : ""}`}
                                onClick={() => handleReact(message.id, emoji)}
                              >
                                <span>{emoji}</span>
                                <span className="reaction-count">{data.count}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Typing */}
                {isTyping && (
                  <div className="typing-indicator">
                    {activeRoom.type === "dm" && activatedRoom?.avatar && (
                      <img src={activatedRoom.avatar} alt="" style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0 }} />
                    )}
                    <div className="typing-bubbles">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                    <span className="typing-label">
                      {activeRoom.type === "channel" ? "Bot" : activatedRoom?.name} is typing…
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Jump to bottom pill */}
              <button
                className={`jump-pill ${showJumpPill ? "visible" : ""}`}
                onClick={scrollToBottom}
              >
                ↓ Jump to latest
              </button>

              {/* Input */}
              <div className="chat-input-area">
                {showEmojiPicker && (
                  <div className="emoji-picker">
                    {QUICK_EMOJIS.map(e => (
                      <button key={e} type="button" className="emoji-btn" onClick={() => addEmoji(e)}>
                        {e}
                      </button>
                    ))}
                  </div>
                )}
                <div className="input-wrapper">
                  <button
                    type="button"
                    className="input-action-btn"
                    onClick={() => setShowEmojiPicker(p => !p)}
                    title="Emoji"
                  >
                    😊
                  </button>
                  <textarea
                    className="message-input"
                    placeholder={`Message ${activeRoom.type === "channel" ? "#" + (activatedRoom?.name || "general") : activatedRoom?.name || ""}…`}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    ref={inputRef}
                    rows={1}
                  />
                  <button
                    type="button"
                    className={`send-btn ${inputValue.trim() ? "active" : ""}`}
                    onClick={handleSend}
                    title="Send"
                  >
                    ➤
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}