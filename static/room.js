// ---- Demo data (replace with your real data source) ----
const ROOM_NAME = "[dummy_value]";
const attendees = [
    { first: "Ada",   last: "Lovelace",  linkedin: "https://www.linkedin.com/in/example1", png: "" },
    { first: "Alan",  last: "Turing",    linkedin: "https://www.linkedin.com/in/example2", png: "" },
    { first: "Grace", last: "Hopper",    linkedin: "https://www.linkedin.com/in/example3", png: "" },
];

// ---- Render logic ----
const roomNameEl = document.getElementById("roomName");
const tbody = document.getElementById("rows");
const emptyState = document.getElementById("emptyState");
const rowTpl = document.getElementById("rowTemplate");

roomNameEl.textContent = ROOM_NAME;

function renderRows(list) {
    tbody.innerHTML = "";
    if (!list || list.length === 0) {
    emptyState.hidden = false;
    return;
    }
    emptyState.hidden = true;

    list.forEach(person => {
    const tr = rowTpl.content.firstElementChild.cloneNode(true);
    tr.querySelector(".fn").textContent = person.first ?? "";
    tr.querySelector(".ln").textContent = person.last ?? "";

    const btn = tr.querySelector(".connect-btn");
    btn.addEventListener("click", () => {
        if (person.linkedin) {
        window.open(person.linkedin, "_blank", "noopener,noreferrer");
        }
    });

    const img = tr.querySelector(".avatar");
    if (person.png) {
        img.src = person.png;
        img.alt = `${person.first ?? ""} ${person.last ?? ""} PNG`;
        img.classList.remove("avatar"); // keep same styles; already applied via class
        img.classList.add("avatar");
    } else {
        // No PNG provided — show text placeholder in the styled box
        img.replaceWith(Object.assign(document.createElement("div"), {
        className: "avatar",
        textContent: "PNG"
        }));
    }

    tbody.appendChild(tr);
    });
}

// Initial render (dynamic growth: call renderRows with a longer array later)
renderRows(attendees);

// Example: dynamically add another row later
// setTimeout(() => {
//   attendees.push({ first: "Katherine", last: "Johnson", linkedin: "https://www.linkedin.com/in/example4", png: "" });
//   renderRows(attendees);
// }, 2000);