import { roomID } from "./login_page_reach.js";
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

    //generateBtn.addEventListener("click", () => {
    qrContainer.innerHTML = ""; // clear any previous QR code

    new QRCode(qrContainer, {
        text: `http://127.0.0.1:5000/login_linked?roomId=${roomID}`, // Replace with your target URL or data
        width: 200,
        height: 200,
    });

    console.log(roomID);
    //});


    // we prob dont need this
    // // Log the Join ID value when the button is clicked
    // joinBtn.addEventListener("click", () => {
    //     const enteredId = joinIdInput.value.trim();
    //     if (enteredId) {
    //         console.log("Join ID entered:", enteredId);
    //         window.location.href = `/login_linked?roomId=${enteredId}`;

    //     } else {
    //         console.log("No ID entered.");
    //     }
    // });
});