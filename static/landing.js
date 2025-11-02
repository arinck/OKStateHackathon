
// Wait for the DOM to finish loading
document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("createBtn");
    const roomName = document.getElementById("roomName");
    const joinBtn = document.getElementById("joinBtn");
    const joinIdInput = document.getElementById("joinId");


    // Generate QR Code when button is clicked
    generateBtn.addEventListener("click", () => {
        qrContainer.innerHTML = ""; // clear any previous QR code
        
        // Call login function in login_page_reach.js
        login_function(roomName);

        console.log("QR Code generated!");
    });

    // Log the Join ID value when the button is clicked
    joinBtn.addEventListener("click", () => {
        const enteredId = joinIdInput.value.trim();
        if (enteredId) {
            console.log("Join ID entered:", enteredId);
            window.location.href = `/login_linked?roomId=${enteredId}&viewer=creator`;
        } else {
            console.log("No ID entered.");
        }
    });
});