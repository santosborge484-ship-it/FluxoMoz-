// dashboard.js - Lógica Financeira Protegida do Lojista

// URL base da API ligada ao servidor oficial na Render
const API_URL = 'https://fluxomoz.onrender.com/api';

document.addEventListener('DOMContentLoaded', () => {
    checkAuthAndLoadDashboard();
});

// 1. Verifica se o lojista tem permissão para estar aqui
function checkAuthAndLoadDashboard() {
    const token = localStorage.getItem('fluxomoz_token');
    const userStr = localStorage.getItem('fluxomoz_user');

    if (!token || !userStr) {
        // Sem permissão: Chuta para a porta de entrada
        window.location.href = 'login.html';
        return;
    }

    // Preenche o nome do Lojista no topo
    const user = JSON.parse(userStr);
    document.getElementById('merchantName').innerText = user.name;

    // Vai buscar o dinheiro
    fetchWalletData(token);
}

// 2. Busca os saldos no servidor de forma segura
async function fetchWalletData(token) {
    try {
        const response = await fetch(`${API_URL}/wallet`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            // Token expirado ou inválido
            localStorage.clear();
            window.location.href = 'login.html';
            return;
        }

        const walletData = await response.json();
        
        if (response.ok) {
            // Renderiza na tela com formatação
            renderBalances(walletData);
        } else {
            console.error('Erro na carteira:', walletData.mensagem);
        }

    } catch (error) {
        console.error('Falha de conexão com o servidor', error);
    }
}

// 3. Função para formatar em Meticais (MT) e injetar no HTML
function renderBalances(wallet) {
    const formatMoney = (amount) => {
        return amount.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    document.getElementById('availableBalance').innerText = formatMoney(wallet.availableBalance);
    document.getElementById('escrowBalance').innerText = formatMoney(wallet.escrowBalance) + ' MT';
    document.getElementById('totalRevenue').innerText = formatMoney(wallet.totalRevenue) + ' MT';
}
