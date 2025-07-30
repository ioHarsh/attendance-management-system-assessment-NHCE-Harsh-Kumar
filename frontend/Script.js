const apiBase = 'http://localhost:3000/api';

// -------------------- LOGIN --------------------
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${apiBase}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        // Store admin info in localStorage
        const isAdmin = data.role === 'admin';
        localStorage.setItem('isAdmin', isAdmin);

        // Redirect based on role
        window.location.href = isAdmin ? 'admin.html' : 'dashboard.html';
      } else {
        document.getElementById('loginMessage').textContent = data.message || 'Login failed';
      }
    } catch (err) {
      document.getElementById('loginMessage').textContent = 'Error occurred while logging in';
    }
  });
}

// -------------------- CLOCK IN / OUT --------------------
async function clockIn() {
  try {
    const res = await fetch(`${apiBase}/attendance/clock-in`, {
      method: 'POST',
      credentials: 'include'
    });

    const data = await res.json();
    document.getElementById('statusMessage').textContent = data.message || 'Clock-in response received';
  } catch (err) {
    document.getElementById('statusMessage').textContent = 'Error occurred while clocking in';
  }
}

async function clockOut() {
  try {
    const res = await fetch(`${apiBase}/attendance/clock-out`, {
      method: 'POST',
      credentials: 'include'
    });

    const data = await res.json();
    document.getElementById('statusMessage').textContent = data.message || 'Clock-out response received';
  } catch (err) {
    document.getElementById('statusMessage').textContent = 'Error occurred while clocking out';
  }
}

// -------------------- LOAD ATTENDANCE TABLE --------------------
const attendanceTableBody = document.getElementById('attendanceTableBody');
if (attendanceTableBody) {
  fetch(`${apiBase}/attendance/history`, {
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      attendanceTableBody.innerHTML = '';
      data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.date}</td>
          <td>${row.clockIn || ''}</td>
          <td>${row.clockOut || ''}</td>
        `;
        attendanceTableBody.appendChild(tr);
      });
    })
    .catch(() => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="3">Failed to load attendance history</td>`;
      attendanceTableBody.appendChild(tr);
    });
}
