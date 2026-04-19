  import { useState, useRef, useEffect, useCallback } from "react";
  import { getMessages, postMessage, searchUsers, getGroups, createGroup, createBoard, getDMs, createDM } from "../utils/api";
  import useDebounce from "../hooks/useDebounce";
  import "./Room.css";

  const QUICK_REPLIES = ["That sounds awesome! 🎉", "Got it, thanks! 👍", "I'll look into that.", "Perfect, let's do it! 🚀"];
  const EMOJI_SET = ["👍", "❤️", "😂", "🔥", "🎉", "👀"];
  const QUICK_EMOJIS = ["😊", "😂", "👍", "🔥", "🎉", "💬", "❤️", "🚀"];

  import logoSvg from "../assets/logo.svg";

  /* ─── HELPERS ─── */
  const getCurrentTime = () => {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, "0");
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ap}`;
  };

  const isGrouped = (msgs, idx) => {
    if (idx === 0) return false;
    return msgs[idx].sender?._id === msgs[idx - 1].sender?._id;
  };

  /* ─── COMPONENT ─── */
  export default function Rooms({ user }) {
    const [activeRoom, setActiveRoom] = useState({ type: null, id: null });
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [activePanel, setActivePanel] = useState("dms");
    
    const [groups, setGroups] = useState([]);
    const [dms, setDms] = useState([]);
    const [messages, setMessages] = useState({});
    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const debouncedQuery = useDebounce(searchQuery, 300);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showJumpPill, setShowJumpPill] = useState(false);

    // Modals
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showBoardModal, setShowBoardModal] = useState(false);
    const [newGroupForm, setNewGroupForm] = useState({ name: "", description: "", icon: "🌐", memberSearch: "", selectedMembers: [] });
    const [newGroupResults, setNewGroupResults] = useState([]);
    const debouncedGroupSearch = useDebounce(newGroupForm.memberSearch, 300);
    const [newBoardForm, setNewBoardForm] = useState({ name: "", topic: "", icon: "#" });

    const messagesEndRef = useRef(null);
    const messagesScrollRef = useRef(null);
    const inputRef = useRef(null);

    const activeRoomKey = activeRoom.id ? `${activeRoom.type}-${activeRoom.id}` : null;

    /* Data Fetching */
    const refreshSidebar = useCallback(async () => {
      try {
        const [fetchedGroups, fetchedDMs] = await Promise.all([getGroups(), getDMs()]);
        setGroups(fetchedGroups || []);
        setDms(fetchedDMs || []);
        
        // Auto-select first DM if nothing selected
        if (!activeRoom.id && fetchedDMs?.length > 0) {
          setActiveRoom({ type: "dm", id: fetchedDMs[0]._id });
        }
      } catch (err) {
        console.error("Failed to fetch sidebar data:", err);
      }
    }, [activeRoom.id]);

    useEffect(() => { 
      // eslint-disable-next-line react-hooks/set-state-in-effect
      refreshSidebar(); 
    }, [refreshSidebar]);

    useEffect(() => {
      if (!activeRoomKey) return;
      const fetchRoomMessages = async () => {
        try {
          const roomMessages = await getMessages(activeRoomKey);
          if (Array.isArray(roomMessages)) {
            setMessages(prev => ({ ...prev, [activeRoomKey]: roomMessages }));
          }
        } catch (err) {
          console.error("Failed to load room messages:", err);
        }
      };
      fetchRoomMessages();
    }, [activeRoomKey]);

    useEffect(() => {
      if (activePanel === "dms" && debouncedQuery) {
        searchUsers(debouncedQuery).then(setSearchResults).catch(console.error);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearchResults([]);
      }
    }, [debouncedQuery, activePanel]);

    useEffect(() => {
      if (debouncedGroupSearch) {
        searchUsers(debouncedGroupSearch).then(setNewGroupResults).catch(console.error);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNewGroupResults([]);
      }
    }, [debouncedGroupSearch]);

    /* Scrolling */
    const scrollToBottom = useCallback(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages, activeRoomKey, scrollToBottom]);

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

    useEffect(() => { inputRef.current?.focus(); }, [activeRoom.id]);

    /* Navigation */
    const handleGroupClick = (groupId) => {
      const group = groups.find(g => g._id === groupId);
      if (!group) return;
      setSelectedGroupId(groupId);
      setActivePanel("group");
      if (group.boards?.length > 0) {
        setActiveRoom({ type: "channel", id: group.boards[0]._id });
      } else {
        setActiveRoom({ type: null, id: null });
      }
      setSearchQuery("");
    };

    const openDMPanel = () => {
      setActivePanel("dms");
      setSelectedGroupId(null);
      if (dms.length > 0) setActiveRoom({ type: "dm", id: dms[0]._id });
      else setActiveRoom({ type: null, id: null });
      setSearchQuery("");
    };

    const handleStartDM = async (targetUser) => {
      try {
        const dm = await createDM(targetUser._id);
        await refreshSidebar();
        setActiveRoom({ type: "dm", id: dm._id });
        setSearchQuery("");
      } catch (err) {
        console.error("Failed to start DM:", err);
      }
    };

    /* Sending Messages */
    const handleSend = () => {
      if (!inputValue.trim() || !activeRoomKey) return;
      const messageText = inputValue.trim();
      
      // Optimistic UI update
      const tempMsg = {
        _id: Date.now().toString(),
        sender: user,
        text: messageText,
        time: getCurrentTime(),
        reactions: {}
      };

      setMessages(prev => ({
        ...prev,
        [activeRoomKey]: [...(prev[activeRoomKey] || []), tempMsg],
      }));
      setInputValue("");
      setShowEmojiPicker(false);

      postMessage({ roomKey: activeRoomKey, text: messageText })
        .then(saved => {
          setMessages(prev => ({
            ...prev,
            [activeRoomKey]: prev[activeRoomKey].map(msg =>
              msg._id === tempMsg._id ? saved : msg
            ),
          }));
        })
        .catch(err => console.error("Failed to save message:", err));
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const addEmoji = (emoji) => {
      setInputValue(prev => prev + emoji);
      inputRef.current?.focus();
    };

    /* Modals */
    const submitCreateGroup = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          name: newGroupForm.name,
          description: newGroupForm.description,
          icon: newGroupForm.icon,
          members: newGroupForm.selectedMembers.map(m => m._id)
        };
        const newGroup = await createGroup(payload);
        setShowGroupModal(false);
        setNewGroupForm({ name: "", description: "", icon: "🌐", memberSearch: "", selectedMembers: [] });
        await refreshSidebar();
        handleGroupClick(newGroup._id);
      } catch (err) {
        console.error(err);
      }
    };

    const submitCreateBoard = async (e) => {
      e.preventDefault();
      if (!selectedGroupId) return;
      try {
        const payload = {
          name: newBoardForm.name,
          topic: newBoardForm.topic,
          icon: newBoardForm.icon
        };
        const newBoard = await createBoard(selectedGroupId, payload);
        setShowBoardModal(false);
        setNewBoardForm({ name: "", topic: "", icon: "#" });
        await refreshSidebar();
        setActiveRoom({ type: "channel", id: newBoard._id });
      } catch (err) {
        console.error(err);
      }
    };

    /* Data Lookups */
    const allBoards = groups.flatMap(g => g.boards || []);
    const selectedGroup = groups.find(g => g._id === selectedGroupId);
    let activatedRoom = null;
    if (activeRoom.type === "channel") {
      activatedRoom = allBoards.find(b => b._id === activeRoom.id);
    } else if (activeRoom.type === "dm") {
      const dm = dms.find(d => d._id === activeRoom.id);
      if (dm) {
        const otherUser = dm.participants.find(p => p._id !== user.id) || dm.participants[0];
        activatedRoom = { ...dm, name: otherUser.name || otherUser.username, avatar: otherUser.avatar, status: otherUser.status };
      }
    }

    const normalizedQuery = searchQuery.toLowerCase();
    const filteredBoards = (selectedGroup?.boards || []).filter(b =>
      b.name.toLowerCase().includes(normalizedQuery) || b.topic.toLowerCase().includes(normalizedQuery)
    );
    
    // Render
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
              <div className="sidebar-logo">
                <img src={logoSvg} alt="Logo" style={{ width: 28, height: 28, borderRadius: '50%' }} />
              </div>
              <div className="group-list">
                {groups.map(group => (
                  <button
                    key={group._id}
                    type="button"
                    className={`group-item ${selectedGroupId === group._id && activePanel === "group" ? "active" : ""}`}
                    onClick={() => handleGroupClick(group._id)}
                    title={group.name}
                  >
                    <span>{group.icon}</span>
                  </button>
                ))}
                
                <button className="group-item" onClick={() => setShowGroupModal(true)} title="Add Group" style={{ background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.2)" }}>
                  <span>+</span>
                </button>

                <div className="group-divider" />
                <button
                  type="button"
                  className={`dm-toggle ${activePanel === "dms" ? "active" : ""}`}
                  onClick={openDMPanel}
                  title="Direct Messages"
                >
                  DM
                </button>
              </div>
              {/* User avatar */}
              <div style={{ marginTop: "auto", padding: "0 0 4px" }}>
                <div className="chat-avatar-wrap">
                  <img className="chat-avatar" src={user.avatar} alt="You" />
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
                    {activePanel === "dms" ? `${dms.length} conversations` : selectedGroup?.description || "Pick a board"}
                  </p>
                </div>
                {activePanel === "group" && (
                  <button className="workspace-action" onClick={() => setShowBoardModal(true)} title="New Board">+</button>
                )}
              </div>

              <div className="sidebar-search">
                <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder={activePanel === "dms" ? "Search users to DM…" : "Search channels…"}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="panel-list">
                {activePanel === "dms" ? (
                  <>
                    {searchResults.length > 0 && searchQuery && (
                      <div style={{ padding: "10px", fontSize: "12px", color: "var(--primary)", fontWeight: "bold" }}>Search Results</div>
                    )}
                    {searchResults.map(u => (
                      <button key={u._id} className="search-result-item" onClick={() => handleStartDM(u)}>
                        <img src={u.avatar} alt={u.name} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className="name">{u.name || u.username}</span>
                          <span className="username">@{u.username}</span>
                        </div>
                      </button>
                    ))}
                    {searchQuery && searchResults.length === 0 && <div className="no-results">No users found</div>}

                    {!searchQuery && dms.length > 0 && dms.map(chat => {
                      const otherUser = chat.participants.find(p => p._id !== user.id) || chat.participants[0];
                      return (
                        <button
                          key={chat._id}
                          type="button"
                          className={`panel-item ${activeRoom.type === "dm" && activeRoom.id === chat._id ? "active" : ""}`}
                          onClick={() => setActiveRoom({ type: "dm", id: chat._id })}
                        >
                          <div className="chat-avatar-wrap">
                            <img className="chat-avatar" src={otherUser?.avatar} alt={otherUser?.name} />
                            <span className="status-indicator online" />
                          </div>
                          <div className="panel-item-info">
                            <span className="panel-item-title">{otherUser?.name || otherUser?.username}</span>
                            <span className="panel-item-meta">{otherUser?.status || "Hey there!"}</span>
                          </div>
                        </button>
                      )
                    })}
                    {!searchQuery && dms.length === 0 && <div className="no-results">No recent messages</div>}
                  </>
                ) : (
                  filteredBoards.length > 0 ? filteredBoards.map(board => (
                    <button
                      key={board._id}
                      type="button"
                      className={`panel-item ${activeRoom.type === "channel" && activeRoom.id === board._id ? "active" : ""}`}
                      onClick={() => setActiveRoom({ type: "channel", id: board._id })}
                    >
                      <div className="panel-item-info">
                        <span className="panel-item-title" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ color: "var(--text-3)", fontSize: 13, fontWeight: 400 }}>{board.icon}</span>
                          {board.name}
                        </span>
                        <span className="panel-item-meta">{board.topic}</span>
                      </div>
                    </button>
                  )) : (
                    <div className="no-results">No channels found</div>
                  )
                )}
              </div>

              <div className="sidebar-footer">
                <div className="sidebar-footer-left">
                  <div className="chat-avatar-wrap">
                    <img className="chat-avatar" src={user.avatar} alt="You" />
                    <span className="status-indicator online" />
                  </div>
                  <div className="sidebar-footer-info">
                    <div className="footer-name">{user.name || user.username}</div>
                    <div className="footer-status">{user.status || "Online"}</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ════ CHAT AREA ════ */}
          <div className="chat-area">
            <div className="chat-body">
              {activeRoomKey ? (
              <div className="chat-panel">
                <div className="chat-header">
                  <div className="header-left">
                    <div className="header-channel-icon">
                      {activeRoom.type === "channel"
                        ? <span style={{ color: "var(--text-3)", fontSize: 16 }}>{activatedRoom?.icon || "#"}</span>
                        : activatedRoom?.avatar
                          ? <img src={activatedRoom.avatar} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                          : "?"}
                    </div>
                    <div className="header-info">
                      <h2 className="header-name">
                        {activatedRoom?.name || "general"}
                      </h2>
                      <p className="header-status">
                        {activeRoom.type === "channel" ? activatedRoom?.topic : activatedRoom?.status}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="messages-container" ref={messagesScrollRef}>
                  <div className="chat-beginning">
                    <div className="beginning-icon">
                      {activeRoom.type === "channel" ? activatedRoom?.icon : activatedRoom?.avatar
                        ? <img src={activatedRoom.avatar} alt="" style={{ width: 36, height: 36, borderRadius: "50%" }} />
                        : "💬"}
                    </div>
                    <h3>
                      {activeRoom.type === "channel" ? `Welcome to ${activatedRoom?.name}` : `Chat with ${activatedRoom?.name}`}
                    </h3>
                    <p>This is the start of your conversation.</p>
                  </div>

                  <div className="date-divider">History</div>

                  {(messages[activeRoomKey] || []).map((message, idx, arr) => {
                    const grouped = isGrouped(arr, idx);
                    const isOwn = message.sender?._id === user.id;
                    
                    return (
                      <div key={message._id} className={`message-group ${isOwn ? "own" : ""} ${grouped ? "grouped" : ""}`}>
                        {!grouped ? <img className="message-avatar" src={message.sender?.avatar} alt={message.sender?.name} /> : <div className="avatar-ghost" />}
                        <div className="message-content">
                          {!grouped && (
                            <div className="message-meta">
                              <span className="message-sender">{message.sender?.name || message.sender?.username || "Unknown"}</span>
                              <span className="message-time">{message.time}</span>
                            </div>
                          )}
                          <div className="message-bubble">
                            <p>{message.text}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <button className={`jump-pill ${showJumpPill ? "visible" : ""}`} onClick={scrollToBottom}>
                  ↓ Jump to latest
                </button>

                {/* Input */}
                <div className="chat-input-area">
                  {showEmojiPicker && (
                    <div className="emoji-picker">
                      {QUICK_EMOJIS.map(e => (
                        <button key={e} type="button" className="emoji-btn" onClick={() => addEmoji(e)}>{e}</button>
                      ))}
                    </div>
                  )}
                  <div className="input-wrapper">
                    <button type="button" className="input-action-btn" onClick={() => setShowEmojiPicker(p => !p)}>😊</button>
                    <textarea
                      className="message-input"
                      placeholder={`Message ${activeRoom.type === "channel" ? activatedRoom?.name : activatedRoom?.name}…`}
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      ref={inputRef}
                      rows={1}
                    />
                    <button type="button" className={`send-btn ${inputValue.trim() ? "active" : ""}`} onClick={handleSend}>➤</button>
                  </div>
                </div>
              </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-3)' }}>
                  Select a room or DM to start chatting
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MODALS */}
        {showGroupModal && (
          <div className="modal-overlay" onClick={() => setShowGroupModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create a Group</h2>
                <p>Start a new community or project team.</p>
              </div>
              <form onSubmit={submitCreateGroup} className="modal-body">
                <label>Group Name <input type="text" required value={newGroupForm.name} onChange={e => setNewGroupForm(p => ({...p, name: e.target.value}))} /></label>
                <label>Description <input type="text" value={newGroupForm.description} onChange={e => setNewGroupForm(p => ({...p, description: e.target.value}))} /></label>
                <label>Icon (Emoji) <input type="text" maxLength={2} value={newGroupForm.icon} onChange={e => setNewGroupForm(p => ({...p, icon: e.target.value}))} /></label>
                
                <label>Add Members
                  <input type="text" placeholder="Search by name..." value={newGroupForm.memberSearch} onChange={e => setNewGroupForm(p => ({...p, memberSearch: e.target.value}))} />
                </label>
                {newGroupResults.length > 0 && (
                  <div style={{ maxHeight: 100, overflowY: 'auto', background: 'var(--bg-deep)', borderRadius: 8, padding: 4 }}>
                    {newGroupResults.map(u => (
                      <button type="button" key={u._id} className="search-result-item" onClick={() => {
                        if (!newGroupForm.selectedMembers.find(m => m._id === u._id)) {
                          setNewGroupForm(p => ({ ...p, selectedMembers: [...p.selectedMembers, u], memberSearch: "" }));
                        }
                      }}>
                        <img src={u.avatar} alt={u.name} />
                        <span className="name">{u.name || u.username}</span>
                      </button>
                    ))}
                  </div>
                )}
                {newGroupForm.selectedMembers.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {newGroupForm.selectedMembers.map(m => (
                      <div key={m._id} style={{ background: 'var(--primary)', color: 'white', padding: '4px 8px', borderRadius: 12, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        {m.name || m.username}
                        <button type="button" style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }} onClick={() => setNewGroupForm(p => ({ ...p, selectedMembers: p.selectedMembers.filter(sm => sm._id !== m._id) }))}>×</button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setShowGroupModal(false)}>Cancel</button>
                  <button type="submit" className="btn-submit">Create Group</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showBoardModal && (
          <div className="modal-overlay" onClick={() => setShowBoardModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create a Board</h2>
                <p>Add a new topic to {selectedGroup?.name}</p>
              </div>
              <form onSubmit={submitCreateBoard} className="modal-body">
                <label>Board Name <input type="text" required value={newBoardForm.name} onChange={e => setNewBoardForm(p => ({...p, name: e.target.value}))} /></label>
                <label>Topic <input type="text" value={newBoardForm.topic} onChange={e => setNewBoardForm(p => ({...p, topic: e.target.value}))} /></label>
                <label>Icon (Emoji) <input type="text" maxLength={2} value={newBoardForm.icon} onChange={e => setNewBoardForm(p => ({...p, icon: e.target.value}))} /></label>
                
                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setShowBoardModal(false)}>Cancel</button>
                  <button type="submit" className="btn-submit">Create Board</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </section>
    );
  }