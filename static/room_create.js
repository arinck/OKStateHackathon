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

        // Generate a new QR code using QRCode.js
        new QRCode(qrContainer, {
            text: `http://127.0.0.1:5000/login_linked?roomId=${joinIdInput.value}`, // Replace with your target URL or data
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
            window.location.href = `/login_linked?roomId=${enteredId}`;

        } else {
            console.log("No ID entered.");
        }
    });
});