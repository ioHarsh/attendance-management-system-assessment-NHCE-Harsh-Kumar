document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("You are not logged in");
    window.location.href = "login.html";
    return;
  }

  fetch(`/attendance/${userId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch attendance");
      return res.json();
    })
    .then((records) => {
      const tbody = document.querySelector("#attendanceTable tbody");

      if (records.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="3">No attendance records found.</td>`;
        tbody.appendChild(row);
      } else {
        records.forEach((record) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.clockIn || "-"}</td>
            <td>${record.clockOut || "-"}</td>
          `;
          tbody.appendChild(row);
        });
      }
    })
    .catch((err) => {
      console.error("Error loading attendance:", err);
      alert("Something went wrong while loading attendance records.");
    });
});
