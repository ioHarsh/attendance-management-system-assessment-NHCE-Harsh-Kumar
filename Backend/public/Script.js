// public/script.js
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const clockInBtn = document.getElementById("clockInBtn");
  const clockOutBtn = document.getElementById("clockOutBtn");
  const historyBtn = document.getElementById("historyBtn");
  const messageDiv = document.getElementById("message");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        window.location.href = "dashboard.html";
      } else {
        messageDiv.innerText = data.message;
      }
    });
  }

  if (clockInBtn) {
    clockInBtn.addEventListener("click", async () => {
      const res = await fetch("/api/attendance/clockin", { method: "POST" });
      const data = await res.json();
      messageDiv.innerText = data.message || "Failed to clock in";
    });
  }

  if (clockOutBtn) {
    clockOutBtn.addEventListener("click", async () => {
      const res = await fetch("/api/attendance/clockout", { method: "POST" });
      const data = await res.json();
      messageDiv.innerText = data.message || "Failed to clock out";
    });
  }

  if (historyBtn) {
    historyBtn.addEventListener("click", async () => {
      const res = await fetch("/api/attendance/history");
      const data = await res.json();

      const historyTable = document.getElementById("historyTable");
      historyTable.innerHTML = "";

      data.forEach(record => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${record.clockIn}</td><td>${record.clockOut || "Still working"}</td>`;
        historyTable.appendChild(row);
      });
    });
  }
});
