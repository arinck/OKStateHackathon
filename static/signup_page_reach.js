const form = document.getElementById('signupForm');
const errBox = document.getElementById('signupError');
const okBox  = document.getElementById('signupOK');

function show(el, msg){ el.textContent = msg; el.classList.remove('d-none'); }
function hide(el){ el.classList.add('d-none'); el.textContent = ''; }

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  hide(errBox); hide(okBox);

  const data = Object.fromEntries(new FormData(form).entries());
  data.fname = (data.fname || '').trim();
  data.lname = (data.lname || '').trim();
  data.email = (data.email || '').trim().toLowerCase();

  try {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const payload = await res.json().catch(() => ({}));

    if (!res.ok || !payload.ok) {
      show(errBox, payload.error || `Signup failed (${res.status})`);
      return;
    }

    show(okBox, `Account created successfully (User ID: ${payload.user_id}).`);
    form.reset();
  } catch {
    show(errBox, 'Network error, please try again.');
  }
});
