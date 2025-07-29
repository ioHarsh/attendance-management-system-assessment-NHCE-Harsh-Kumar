document.getElementById('loginForm').addEventListener('submit',async function(event) {
    event.preventDefault();
    const username=document.getElementById('username').value;
    const password=document.getElementById('password').value;
    if (!username||!password) {
        document.getElementById('errorMessage').textContent="Please enter both username and password.";
        return;
    }
    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token); 
            window.location.href='dashboard.html';
        } else {
            document.getElementById('errorMessage').textContent=data.message||"Login failed";
        }
    } catch (err) {
        console.error('Error:',err);
        document.getElementById('errorMessage').textContent = "Server error,please try again later.";
    }
});
