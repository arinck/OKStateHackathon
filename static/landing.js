// static/landing.js
document.addEventListener("DOMContentLoaded", () => {
  const createBtn = document.getElementById("createBtn");
  const joinBtn   = document.getElementById("joinBtn");
  const roomNameInput = document.getElementById("roomName");
  const joinIdInput   = document.getElementById("joinId");

  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  function generateRoomID(len = 6) {
    let out = "";
    for (let i = 0; i < len; i++) out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    return out;
  }

  async function apiPOST(path, body) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }

  async function getUserIdOrRedirect() {
    const res = await fetch("/api/user_id");
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      alert("Please sign in to create a room.");
      const next = encodeURIComponent(location.pathname + location.search);
      location.href = `/login_reach?next=${next}&roomName=${encodeURIComponent(roomNameInput.value.trim() || "")}`;
      throw new Error("Not authenticated");
    }
    if (!res.ok || !data.user_id) throw new Error(data.error || "Auth error");
    return data.user_id;
  }

  async function uniqueRoomID() {
    while (true) {
      const candidate = generateRoomID();
      const { exists } = await apiPOST("/api/room_exists", { roomID: candidate });
      if (!exists) return candidate;
    }
  }

  async function createRoomOnServer(roomName) {
    const ownerID = await getUserIdOrRedirect();
    const roomID  = await uniqueRoomID();
    await apiPOST("/api/room_create", { roomName, ownerID, roomID });
    return roomID;
  }

  createBtn.addEventListener("click", async () => {
    const roomName = roomNameInput.value.trim();
    if (!roomName) return alert("Enter a room name first");
    try {
      const roomID = await createRoomOnServer(roomName);
      location.href = `/room?room_id=${encodeURIComponent(roomID)}&viewer=creator`;
    } catch (err) {
      if (err.message !== "Not authenticated") {
        console.error("Create room failed:", err);
        alert(`Failed to create room\n${err.message}`);
      }
    }
  });

  joinBtn.addEventListener("click", () => {
    const roomID = (joinIdInput.value || "").trim();
    if (!roomID) return alert("Enter a Room ID first");
    location.href = `/room?room_id=${encodeURIComponent(roomID)}&viewer=guest`;
  });
});
