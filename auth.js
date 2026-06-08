const API_URL = 'https://fluxomoz.onrender.com/api/auth';

function switchTab(type) {
    const isLogin = type === 'login';
    const isReg = type === 'register';
    const isOtp = type === 'otp';

    document.getElementById('tabs-container').classList.toggle('hidden', isOtp);
    
    if(!isOtp) {
        document.getElementById('tab-login').classList.toggle('active', isLogin);
        document.getElementById('tab-register').classList.toggle('active', isReg);
    }

    document.getElementById('form-login').classList.toggle('hidden', !isLogin);
    document.getElementById('form-register').classList.toggle('hidden', !isReg);
    document.getElementById('form-otp').classList.toggle('hidden', !isOtp);
    document.getElementById('auth-message').classList.add('hidden');
}

function showMessage(text, isSuccess = false) {
    const msgBox = document.getElementById('auth-message');
    msgBox.innerText = text;
    msgBox.className = `msg-box ${isSuccess ? 'msg-success' : 'msg-error'}`;
    msgBox.classList.remove('hidden');
}

// 1. REGISTAR CONTA
async function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;
    const password = document.getElementById('reg-password').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password })
        });

        const result = await response.json();

        if (result.status === 'success') {
            // Guarda o ID temporariamente para a verificação OTP
            document.getElementById('temp-user-id').value = result.data.userId;
            
            // AVISO DE TESTE: Exibe o código gerado no ecrã para não precisarmos de e-mail real agora
            showMessage(`Registo concluído! O seu CÓDIGO DE TESTE é: ${result.data._development_otp}`, true);
            
            // Muda para o ecrã do OTP
            setTimeout(() => { switchTab('otp'); }, 2000);
        } else {
            showMessage(result.message);
        }
    } catch (error) {
        showMessage('Erro de conexão com o servidor da FluxoMoz.');
    }
}

// 2. VERIFICAR OTP
async function handleVerifyOtp(event) {
    event.preventDefault();
    const userId = document.getElementById('temp-user-id').value;
    const otpCode = document.getElementById('otp-code').value;

    try {
        const response = await fetch(`${API_URL}/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, otpCode })
        });

        const result = await response.json();

        if (result.status === 'success') {
            showMessage('Identidade verificada! A entrar no painel...', true);
            localStorage.setItem('fluxomoz_token', result.data.token);
            localStorage.setItem('fluxomoz_user_name', result.data.name);
            
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
        } else {
            showMessage(result.message);
        }
    } catch (error) {
        showMessage('Erro de conexão com o servidor.');
    }
}

// 3. ENTRAR (LOGIN)
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.status === 'success') {
            localStorage.setItem('fluxomoz_token', result.data.token);
            localStorage.setItem('fluxomoz_user_name', result.data.name);
            window.location.href = 'dashboard.html';
        } else if (result.requiresOtp) {
            // Se tentou entrar mas nunca verificou o OTP
            document.getElementById('temp-user-id').value = result.userId;
            showMessage('A sua conta ainda precisa de ser verificada.', false);
            setTimeout(() => { switchTab('otp'); }, 1500);
        } else {
            showMessage(result.message);
        }
    } catch (error) {
        showMessage('Erro de conexão com o servidor.');
    }
}
