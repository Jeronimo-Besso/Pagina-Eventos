const API_URL = "http://localhost:8000/auth"
const form = document.getElementById("loginForm");
const messageDiv = document.getElementById("message")
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageDiv.style.display = "none";
    messageDiv.textContent = ""

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value

    try {
        const res = await fetch("http://localhost:8000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" }, //esto es importante para que el backend entienda el formato
            body: new URLSearchParams({
                username: email,
                password: password,
            }),
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => null);
            let detail = errData?.detail || "Error desconocido";
            throw new Error(detail);
        }

        const data = await res.json()

        // Guardar token en localStorage
        localStorage.setItem("token", data.access_token)

        messageDiv.className = "success-message";
        messageDiv.textContent = "Login exitoso! Ya podés crear eventos.";
        messageDiv.style.display = "block";

        //agregar condicion para que verifique si es o no admin
        //esta funcion busca hacer eso , abajo esta la ida al
        let userRol = ''
        verificarRol()
        async function verificarRol() {
            const res = await fetch(`${API_URL}/${email}`);
            if (!res.ok) {
                const err = await res.json().catch(() => ({ detail: "Error desconocido" }));
                alert("Error: " + err.detail);
            } else {
                //aca hay q tomar el return de el endpoint, y ver para donde redirigir
                const data = await res.json();
                userRol = data.rol
                console.log(userRol)
                if (userRol === 'Administrador') {
                    window.location.href = 'http://127.0.0.1:5500/app/frontend/index.html'
                } else {
                    window.location.href = 'http://127.0.0.1:5500/app/frontend/usuario.html';
                }
            //esto manda al html que toque
            }
        }
        form.reset();
    } catch (error) {
        messageDiv.className = "error-message";
        messageDiv.textContent = "Error: " + error.message;
        messageDiv.style.display = "block"; //se muestra el mensaje de error
    }
});