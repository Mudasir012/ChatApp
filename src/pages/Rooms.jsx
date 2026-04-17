import { useState } from "react";
import "./Room.css";

export default function Rooms() {
  const [activeId, setActiveId] = useState(null);

  const chats = [
    {
      id: 1,
      name: "Ali Khan",
      unread: 2,
      online: true,
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    {
      id: 2,
      name: "Sara Ahmed",
      unread: 0,
      online: false,
      avatar: "https://i.pravatar.cc/40?img=2",
    },
    {
      id: 3,
      name: "Usman Tariq",
      unread: 1,
      online: true,
      avatar: "https://i.pravatar.cc/40?img=3",
    },///test commit
    {
      id: 4,
      name: "Project Team",
      unread: 5,
      online: false,
      avatar: "https://i.pravatar.cc/40?img=4",
    },
    {
      id: 5,
      name: "Hassan Raza",
      unread: 0,
      online: false,
      avatar: "https://i.pravatar.cc/40?img=5",
    },
  ];
  const activatedChat = chats.find((chat) => chat.id === activeId);
  return (
    <section className="chat-rooms">
      <div className="dc-sidebar">
        {/* Search bar */}
        <div className="dc-search">Find or start a conversation</div>

        {/* Top nav items */}
        <div className="dc-nav">
          <div className="dc-nav-item">
            <span className="dc-nav-icon">👤</span>
            Friends
          </div>
          <div className="dc-nav-item">
            <span className="dc-nav-icon">⊕</span>
            Nitro
          </div>
          <div className="dc-nav-item">
            <span className="dc-nav-icon">🛍</span>
            Shop
            <span className="dc-tag">NEW</span>
          </div>
          <div className="dc-nav-item active-purple">
            <span className="dc-nav-icon">◎</span>
            Quests
            <span className="dc-tag">NEW</span>
          </div>
        </div>

        {/* DM section header */}
        <div className="dc-dm-header">
          <span>Direct Messages</span>
          <span className="dc-plus">＋</span>
        </div>

        {/* DM list */}
        <div className="dc-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`dc-item ${activeId === chat.id ? "active" : ""}`}
              onClick={() => setActiveId(chat.id)}
            >
              <div className="dc-avatar-wrap">
                <img className="dc-avatar" src={chat.avatar} alt={chat.name} />
                <span
                  className={`dc-status ${chat.online ? "online" : "offline"}`}
                ></span>
              </div>
              <span className="dc-name">{chat.name}</span>
              {chat.unread > 0 && <div className="dc-badge">{chat.unread}</div>}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="dc-footer">
          <div className="dc-footer-left">
            <div className="dc-avatar-wrap">
              <img
                className="dc-footer-avatar"
                src="https://i.pravatar.cc/40?img=10"
                alt="You"
              />
              <span className="dc-status online"></span>
            </div>
            <div>
              <div className="dc-footer-name">Mudasir Hussain</div>
              <div className="dc-footer-tag">i dont know wtf im doing</div>
            </div>
          </div>
          <div className="dc-footer-icons">
            <button className="dc-icon-btn">🎙</button>
            <button className="dc-icon-btn">🎧</button>
            <button className="dc-icon-btn">⚙</button>
          </div>
        </div>
      </div>
      <div className="chat">
        {activatedChat ? (
          <>
            <div className="chat-header">
              <div className="person-info">
                <img src={activatedChat.avatar} alt={activatedChat.name} />
                <div className="name-and-status">
                  <h2>{activatedChat.name}</h2>
                  <p className="">
                    {activatedChat?.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="call-options">
                <button className="voice-call">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 16.92V20a2 2 0 0 1-2.18 2 
  19.86 19.86 0 0 1-8.63-3.07 
  19.5 19.5 0 0 1-6-6 
  19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3.09a2 2 0 0 1 
  2 1.72c.12.89.32 1.76.59 2.59a2 2 0 0 1-.45 
  2.11L8.09 9.91a16 16 0 0 0 6 6l1.49-1.25a2 2 0 0 1 
  2.11-.45c.83.27 1.7.47 2.59.59A2 2 0 0 1 22 16.92z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <button className="video-call">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="2"
                      y="6"
                      width="14"
                      height="12"
                      rx="2"
                      stroke="currentColor"
                      stroke-width="2"
                    />

                    <path
                      d="M16 10L22 7V17L16 14V10Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="chat-message">
              <p>Start conversation with {activatedChat.name}</p>
            </div>
            <div className="chat-input">
              <input
                type="text"
                name=""
                id=""
                placeholder="Type a message..."
              />
              <button>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 2L11 13"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />

                  <path
                    d="M22 2L15 22L11 13L2 9L22 2Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <h1>Select a chat</h1>
        )}
      </div>
    </section>
  );
}
