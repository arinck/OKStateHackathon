import { generateRoomID } from "./gen_room_id";

async function room_exists(roomID){
    const r = await fetch(`/api/rooms/${roomID}/exists`);
    if (!r.ok) throw new Error("Failed to check room");
    const { exists } = await r.json();
    return exists;
}

async function insert_room(roomName, ownerID, roomID){
    const r = await fetch("/api/room_create", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ roomName, ownerID, roomID })
    });
    if (!r.ok) throw new Error("Failed to create room");
    return r.json();
}

async function getUserID(){
    const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
    const payload = await res.json().catch(() => ({}));
    return payload;
}

// Wait for the DOM to finish loading
document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("createBtn");
    const roomName = document.getElementById("roomName");
    const joinBtn = document.getElementById("joinBtn");
    const joinIdInput = document.getElementById("joinId");

    // Create a container for the QR code dynamically (if not already in HTML)
    let qrContainer = document.getElementById("qrcode");
    if (!qrContainer) {
        qrContainer = document.createElement("div");
        qrContainer.id = "qrcode";
        qrContainer.style.marginTop = "20px";
        document.body.appendChild(qrContainer);
    }

    // Generate QR Code when button is clicked
    generateBtn.addEventListener("click", () => {
        qrContainer.innerHTML = ""; // clear any previous QR code
        let roomID;
        do {
            roomID = generateRoomID();
        } while (room_exists(roomID));
        // Add the room to the DB
        const payloadYes = getUserID();
        insert_room(roomName, payloadYes.user_id, roomID);

        // Generate a new QR code using QRCode.js
        new QRCode(qrContainer, {
            text: "https://example.com", // Replace with your target URL or data
            width: 200,
            height: 200,
        });

        console.log("QR Code generated!");
    });

    // Log the Join ID value when the button is clicked
    joinBtn.addEventListener("click", () => {
        const enteredId = joinIdInput.value.trim();
        if (enteredId) {
            console.log("Join ID entered:", enteredId);
        } else {
            console.log("No ID entered.");
        }
    });
});