const form   = document.getElementById('loginForm');
const errBox = document.getElementById('loginError');
const okBox  = document.getElementById('loginOK');

function generateRoomID() {
    let arr = [];
    let capitalArr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
        "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y",
        "Z"
    ];
    let lowercaseArr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
        "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y",
        "z"
    ];
    let numbersArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let specialArr = ["!", "\"", "#", "$", "%", "&", "\'", "(", ")", "*",
        "+", "`", "-",".", "/", ":", ";", "<", "=", ">", "?", "@", "[", "\\", "]", "^", 
        "_", ",", "{", "|", "}", "~"];
    for (let i = 0; i < 6; i++) {
        let includes = true;
        let passChar;
        while (includes){
            includes = false;
            // n will be an integer in 33-126 which are all printable
            //  ASCII characters
            passChar = String.fromCharCode(Math.floor(((Math.random()*100) % 93) + 33));
            if (!true && capitalArr.includes(passChar)){
                includes = true;
            }
            if (!true && lowercaseArr.includes(passChar)){
                includes = true;
            }
            if (!true && numbersArr.includes(passChar)){
                includes = true;
            }
            if (!false && specialArr.includes(passChar)){
                includes = true;
            }
        }
        arr.push(passChar);
    }
    return arr.join("");
}

async function room_exists(roomID){
    const res = await fetch(`/api/room_exists`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ roomID })
    });
    if (!res.ok) throw new Error("Failed to check if room exists");
    const exists = await res.json();
    return exists;
}

async function insert_room(roomName, ownerID, roomID){
    const res = await fetch("/api/room_create", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ roomName, ownerID, roomID })
    });
    if (!res.ok) throw new Error("Failed to create room");
    return res.json();
}

function createRoom(roomName, userID){
  let roomID;
  do {
    roomID = generateRoomID();
    console.log(roomID);
  } while (room_exists(roomID).exists);
  // Add the room to the DB
  insert_room(roomName, userID, roomID);
}

function show(el, msg){ el.textContent = msg; el.classList.remove('d-none'); }
function hide(el){ el.classList.add('d-none'); el.textContent = ''; }


// This needs to be turned into a function and passed roomName
//    from landing.
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  hide(errBox); hide(okBox);

  const data = Object.fromEntries(new FormData(form).entries());
  data.email = (data.email || '').trim().toLowerCase();

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const payload = await res.json().catch(() => ({}));

    if (!res.ok || !payload.ok) {
      show(errBox, payload.error || `Login failed (${res.status})`);
      return;
    }

    // show success briefly
    show(okBox, `Welcome back! Redirecting...`);
    form.reset();

    createRoom(roomName, payload.user_id);

    // redirect to home (or another route)
    setTimeout(() => {
      window.location.href = '/room?room_id=defultRoom&viewer=creator';
    }, 1000);

  } catch {
    show(errBox, 'Network error, please try again.');
  }
});
