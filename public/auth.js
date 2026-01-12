// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const authMessage = document.getElementById('authMessage');

// Event Listeners
document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
showRegisterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    authMessage.classList.add('hidden');
});
showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    authMessage.classList.add('hidden');
});

// Função de Login
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('username', data.username);
            showMessage('Login realizado com sucesso! Redirecionando...', 'success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            showMessage(data.error || 'Erro ao fazer login', 'error');
        }
    } catch (error) {
        showMessage('Erro de conexão. Tente novamente.', 'error');
    }
}

// Função de Cadastro
async function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('registerEmail').value.trim();
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;

    if (password.length < 6) {
        showMessage('A senha deve ter no mínimo 6 caracteres', 'error');
        return;
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Conta criada com sucesso! Faça login para continuar.', 'success');
            setTimeout(() => {
                registerForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                document.getElementById('registerFormElement').reset();
            }, 2000);
        } else {
            showMessage(data.error || 'Erro ao criar conta', 'error');
        }
    } catch (error) {
        showMessage('Erro de conexão. Tente novamente.', 'error');
    }
}

// Mostrar mensagem
function showMessage(message, type) {
    authMessage.textContent = message;
    authMessage.className = `auth-message ${type}`;
    authMessage.classList.remove('hidden');
}

// Verificar se já está logado
if (localStorage.getItem('token')) {
    window.location.href = '/';
}
