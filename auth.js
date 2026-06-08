<!DOCTYPE html>
<html lang="pt-MZ">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acesso Seguro - FluxoMoz</title>
    <link rel="stylesheet" href="style.css">
    <style>
        /* Estilos específicos que não sujam o CSS Global */
        body { background-color: var(--color-bg-sec); display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: var(--sp-24); }
        .auth-container { width: 100%; max-width: 440px; }
        .auth-header { text-align: center; margin-bottom: var(--sp-32); }
        .auth-card { padding: var(--sp-48) var(--sp-32); }
        .auth-tabs { display: flex; border-bottom: 2px solid var(--color-border); margin-bottom: var(--sp-32); }
        .tab-btn { flex: 1; padding: var(--sp-16); border: none; background: none; font-weight: 600; color: var(--color-text-body); cursor: pointer; transition: color 0.2s; font-size: 1rem; }
        .tab-btn.active { color: var(--color-secondary); border-bottom: 2px solid var(--color-secondary); margin-bottom: -2px; }
        .input-group { margin-bottom: var(--sp-24); }
        .input-group label { display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-primary); margin-bottom: 8px; }
        .input-group input { width: 100%; padding: 14px 16px; font-size: 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); transition: border-color 0.2s; outline: none; }
        .input-group input:focus { border-color: var(--color-secondary); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        .hidden { display: none; }
        .msg-box { margin-top: var(--sp-24); padding: 16px; border-radius: var(--radius-md); font-size: 0.875rem; text-align: center; font-weight: 500; }
        .msg-success { background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .msg-error { background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    </style>
</head>
<body>

    <div class="auth-container">
        <div class="auth-header">
            <a href="index.html" class="brand-logo" style="font-size: 2rem;">Fluxo<span>Moz</span></a>
            <p style="margin-top: 8px;">Acesso restrito a vendedores</p>
        </div>

        <main class="card auth-card">
            <div class="auth-tabs">
                <button id="tab-login" class="tab-btn active" onclick="switchTab('login')">Entrar</button>
                <button id="tab-register" class="tab-btn" onclick="switchTab('register')">Criar Conta</button>
            </div>

            <!-- Formulário de Entrada -->
            <form id="form-login" onsubmit="handleLogin(event)">
                <div class="input-group">
                    <label for="login-email">E-mail Profissional</label>
                    <input type="email" id="login-email" required placeholder="exemplo@empresa.com">
                </div>
                <div class="input-group">
                    <label for="login-password">Senha</label>
                    <input type="password" id="login-password" required placeholder="••••••••">
                </div>
                <button type="submit" class="btn btn-primary btn-w-full">Aceder à Minha Conta</button>
            </form>

            <!-- Formulário de Registo -->
            <form id="form-register" class="hidden" onsubmit="handleRegister(event)">
                <div class="input-group">
                    <label for="reg-name">Nome Completo (Conforme BI)</label>
                    <input type="text" id="reg-name" required placeholder="Para verificações KYC">
                </div>
                <div class="input-group">
                    <label for="reg-email">E-mail Profissional</label>
                    <input type="email" id="reg-email" required placeholder="exemplo@empresa.com">
                </div>
                <div class="input-group">
                    <label for="reg-phone">Telefone (Recebimentos M-Pesa/E-Mola)</label>
                    <input type="tel" id="reg-phone" required placeholder="84/85XXXXXXX">
                </div>
                <div class="input-group">
                    <label for="reg-password">Senha Segura</label>
                    <input type="password" id="reg-password" required placeholder="Mínimo 8 caracteres">
                </div>
                <button type="submit" class="btn btn-primary btn-w-full">Criar Conta Gratuitamente</button>
            </form>
            
            <div id="auth-message" class="hidden"></div>
        </main>
    </div>

    <!-- O mesmo script de conexão que criámos anteriormente -->
    <script src="auth.js"></script>
    <script>
        function switchTab(type) {
            document.getElementById('tab-login').classList.toggle('active', type === 'login');
            document.getElementById('tab-register').classList.toggle('active', type === 'register');
            document.getElementById('form-login').classList.toggle('hidden', type !== 'login');
            document.getElementById('form-register').classList.toggle('hidden', type !== 'register');
            document.getElementById('auth-message').classList.add('hidden');
        }
        // As funções de submissão (handleLogin) continuam a ser tratadas pelo auth.js
    </script>
</body>
</html>
