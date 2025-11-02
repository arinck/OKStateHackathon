// static/login.js
export var roomID;


document.addEventListener("DOMContentLoaded", () => {
  const form   = document.getElementById("loginForm");
  const errBox = document.getElementById("loginError");
  const okBox  = document.getElementById("loginOK");

  const qs = new URLSearchParams(location.search);
  const nextAfterLogin = qs.get("next") || "/";
  const requestedRoomName = (qs.get("roomName") || "").trim();

  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";


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

  async function roomExists(roomID) {
    const { exists } = await apiPOST("/api/room_exists", { roomID });
    return exists;
  }

   async function uniqueRoomID() {
    while (true) {
      const candidate = generateRoomID();
      if (!(await roomExists(candidate))) return candidate;
    }
  }

  async function createRoom(roomName, ownerID) {
    const roomID = await uniqueRoomID();
    await apiPOST("/api/room_create", { roomName, ownerID, roomID });
    return roomID;
  }

  function show(el, msg) { el.textContent = msg; el.classList.remove("d-none"); }
  function hide(el) { el.classList.add("d-none"); el.textContent = ""; }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    hide(errBox); hide(okBox);

    const data = Object.fromEntries(new FormData(form).entries());
    data.email = (data.email || "").trim().toLowerCase();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const payload = await res.json().catch(() => ({}));

      if (!res.ok || !payload.ok) {
        show(errBox, payload.error || `Login failed (${res.status})`);
        return;
      }

      show(okBox, "Signed in. Redirecting…");
      form.reset();

      // If this login was triggered by "Create Room", finish that flow
      if (requestedRoomName) {
        try {
          const roomID = await createRoom(requestedRoomName, payload.user_id);
          location.href = `/room?room_id=${encodeURIComponent(roomID)}&viewer=creator`;
          return;
        } catch (err) {
          show(errBox, `Failed to create room: ${err.message}`);
          return;
        }
      }

      // Otherwise go to next or home
      location.href = nextAfterLogin;

    } catch (err) {
      show(errBox, `Network error: ${err.message || "try again"}`);
    }
  });

});
