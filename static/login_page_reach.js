const form   = document.getElementById('loginForm');
const errBox = document.getElementById('loginError');
const okBox  = document.getElementById('loginOK');

function show(el, msg){ el.textContent = msg; el.classList.remove('d-none'); }
function hide(el){ el.classList.add('d-none'); el.textContent = ''; }

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

    // redirect to home (or another route)
    setTimeout(() => {
      window.location.href = '/room?room_id=defultRoom&viewer=creator';
    }, 1000);

  } catch {
    show(errBox, 'Network error, please try again.');
  }
});
