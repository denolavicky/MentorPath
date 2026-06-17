import { useState } from "react";
import { Link } from "react-router-dom";
import MenteeLayout from "../../components/layout/MenteeLayout.jsx";

const allNotifications = [
  { id: "1", type: "session_booked", title: "Session confirmed!", message: "Your session with Amara Okafor is confirmed for tomorrow at 3:00 PM.", time: "2 hours ago", read: false, icon: "📅", color: "#6366f1", link: "/my-sessions" },
  { id: "2", type: "message", title: "New message from Amara Okafor", message: "Hey! Looking forward to our session tomorrow. Make sure to prepare your portfolio link.", time: "3 hours ago", read: false, icon: "💬", color: "#10b981", link: "/messages" },
  { id: "3", type: "roadmap", title: "New roadmap published", message: "Amara Okafor just published a new roadmap: 'System Design for Beginners'", time: "Yesterday", read: false, icon: "🗺️", color: "#f59e0b", link: "/roadmaps" },
  { id: "4", type: "review_reminder", title: "Leave a review", message: "How was your session with Chioma Eze? Share your experience to help other mentees.", time: "2 days ago", read: true, icon: "⭐", color: "#f59e0b", link: "/session/3/review" },
  { id: "5", type: "session_reminder", title: "Session in 24 hours", message: "Reminder: You have a session with Tunde Adeyemi tomorrow at 6:00 PM.", time: "2 days ago", read: true, icon: "⏰", color: "#8b5cf6", link: "/my-sessions" },
  { id: "6", type: "mentor_approved", title: "Mentor now available", message: "Kwame Mensah you saved is now accepting bookings again.", time: "3 days ago", read: true, icon: "🌟", color: "#10b981", link: "/explore" },
  { id: "7", type: "subscription", title: "1 free session remaining", message: "You've used 2 of your 3 free sessions this month. Upgrade to Pro for unlimited access.", time: "4 days ago", read: true, icon: "💳", color: "#6366f1", link: "/subscription" },
  { id: "8", type: "message", title: "New message from Tunde Adeyemi", message: "Great progress on your portfolio! Can't wait to see the final version.", time: "5 days ago", read: true, icon: "💬", color: "#10b981", link: "/messages" },
];

const typeFilters = [
  { key: "all", label: "All" },
  { key: "session_booked", label: "Sessions" },
  { key: "message", label: "Messages" },
  { key: "roadmap", label: "Roadmaps" },
  { key: "review_reminder", label: "Reviews" },
  { key: "subscription", label: "Subscription" },
];

function NotificationItem({ notification, onRead }) {
  return (
    <div onClick={() => onRead(notification.id)} style={{
      display: "flex", gap: "14px", padding: "16px 20px",
      background: notification.read ? "white" : "#fafafe",
      borderLeft: `3px solid ${notification.read ? "transparent" : notification.color}`,
      borderBottom: "1px solid #f8fafc",
      cursor: "pointer", transition: "background 0.15s",
    }}
      onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
      onMouseLeave={e => e.currentTarget.style.background = notification.read ? "white" : "#fafafe"}
    >
      {/* Icon */}
      <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `${notification.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
        {notification.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "4px" }}>
          <span style={{ fontSize: "14px", fontWeight: notification.read ? "600" : "800", color: "#0f172a" }}>{notification.title}</span>
          <span style={{ fontSize: "11px", color: "#94a3b8", whiteSpace: "nowrap", flexShrink: 0 }}>{notification.time}</span>
        </div>
        <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5", marginBottom: "8px" }}>{notification.message}</p>
        <Link to={notification.link} onClick={e => e.stopPropagation()} style={{ fontSize: "12px", fontWeight: "700", color: notification.color, textDecoration: "none" }}>
          View →
        </Link>
      </div>

      {/* Unread dot */}
      {!notification.read && (
        <div style={{ width: "8px", height: "8px", background: notification.color, borderRadius: "50%", flexShrink: 0, marginTop: "6px" }} />
      )}
    </div>
  );
}

function NotificationsContent() {
  const [notifications, setNotifications] = useState(allNotifications);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleReadAll = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filtered = notifications.filter(n =>
    filter === "all" ? true : n.type === filter
  );

  return (
    <div style={{ padding: "32px", maxWidth: "700px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
            Notifications
            {unreadCount > 0 && (
              <span style={{ marginLeft: "10px", background: "#6366f1", color: "white", fontSize: "12px", fontWeight: "700", padding: "2px 8px", borderRadius: "100px" }}>
                {unreadCount}
              </span>
            )}
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Stay up to date with your sessions, messages, and more.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleReadAll} style={{ background: "white", border: "1px solid #e5e7eb", color: "#6366f1", padding: "8px 16px", borderRadius: "9px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
        {typeFilters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: "7px 14px", borderRadius: "9px", border: "none", cursor: "pointer",
            fontSize: "12px", fontWeight: "600",
            background: filter === f.key ? "#6366f1" : "white",
            color: filter === f.key ? "white" : "#64748b",
            border: filter === f.key ? "none" : "1px solid #e5e7eb",
            transition: "all 0.15s",
          }}>
            {f.label}
            {f.key === "all" && unreadCount > 0 && (
              <span style={{ marginLeft: "6px", background: filter === f.key ? "rgba(255,255,255,0.3)" : "#6366f1", color: "white", fontSize: "10px", fontWeight: "800", padding: "1px 5px", borderRadius: "100px" }}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {filtered.length > 0 ? (
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", overflow: "hidden" }}>
          {filtered.map((notification, i) => (
            <NotificationItem key={notification.id} notification={notification} onRead={handleRead} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "80px", background: "white", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔔</div>
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>No notifications</h3>
          <p style={{ color: "#64748b", fontSize: "14px" }}>You're all caught up!</p>
        </div>
      )}
    </div>
  );
}

export default function MenteeNotifications() {
  return (
    <MenteeLayout>
      <NotificationsContent />
    </MenteeLayout>
  );
}
