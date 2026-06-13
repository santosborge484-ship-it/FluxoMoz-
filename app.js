// app.js - Lógica principal do Frontend FluxoMoz

// URL base da API (Em produção trocarás isto pelo teu domínio real)
const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    console.log("FluxoMoz Frontend Inicializado com sucesso.");
    registerServiceWorker();
    setupBottomNavigation();
    loadProducts();     // Busca os produtos na base de dados
    initBannerSlider(); // Ativa a rotação dos anúncios
}

// 1. Registo do Service Worker para PWA
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registado com sucesso no escopo: ', registration.scope);
                })
                .catch(err => {
                    console.log('Falha ao registar o ServiceWorker: ', err);
                });
        });
    }
}

// 2. Controlo visual da Navegação Inferior
function setupBottomNavigation() {
    const navItems = document.querySelectorAll('nav a');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove as classes de estado "ativo" de todos os ícones
            navItems.forEach(nav => {
                nav.classList.remove('text-fluxo-blue');
                nav.classList.add('text-gray-400');
                
                // Mudar ícone para versão "outline" (sem preenchimento)
                const icon = nav.querySelector('i');
                if(icon) {
                    icon.classList.remove('ph-fill');
                    icon.classList.add('ph');
                }
            });

            // Adiciona o estado ativo ao clicado
            e.currentTarget.classList.remove('text-gray-400');
            e.currentTarget.classList.add('text-fluxo-blue');
            
            // Mudar ícone para versão "fill" (preenchida)
            const activeIcon = e.currentTarget.querySelector('i');
            if(activeIcon) {
                activeIcon.classList.remove('ph');
                activeIcon.classList.add('ph-fill');
            }
        });
    });
}

// 3. Buscar e renderizar produtos reais do Backend
async function loadProducts() {
    const container = document.getElementById('produtos-container');
    if (!container) return; // Só executa se existir o contentor (ex: na homepage)

    try {
        const response = await fetch(`${API_URL}/products`);
        
        if (!response.ok) {
            throw new Error('Falha na comunicação com o servidor');
        }

        const products = await response.json();

        // Limpa os produtos falsos/templates
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = `<p class="text-xs text-gray-500 p-4 w-full text-center">Nenhum produto disponível no momento.</p>`;
            return;
        }

        // Injeta os produtos que vieram da base de dados
        products.forEach(produto => {
            // Se não tiver imagem, usa uma genérica
            const imagemSrc = produto.image !== 'placeholder.jpg' ? produto.image : 'https://via.placeholder.com/150?text=FluxoMoz';
            
            // Puxa o nome do vendedor ou mete um genérico se falhar
            const vendedorNome = produto.user ? produto.user.name : 'Loja Verificada';
            
            // Formata o preço (ex: 2.500,00 MT)
            const precoFormatado = produto.price.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MT';

            const productCard = `
                <a href="produto_detalhe.html?id=${produto._id}" class="snap-start shrink-0 w-[110px] bg-white rounded-lg shadow-sm overflow-hidden flex flex-col border border-gray-100">
                    <div class="aspect-square bg-gray-50 relative flex items-center justify-center overflow-hidden">
                        <img src="${imagemSrc}" class="w-full h-full object-cover" alt="${produto.name}">
                    </div>
                    <div class="p-2 flex flex-col flex-grow">
                        <h4 class="text-[11px] font-medium leading-tight line-clamp-2 mb-1 text-gray-800">${produto.name}</h4>
                        <span class="text-xs font-bold text-fluxo-blue">${precoFormatado}</span>
                        <div class="mt-auto pt-1">
                            <span class="text-[9px] text-gray-500 block truncate">${vendedorNome}</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-[8px] text-gray-400 truncate w-12">${produto.category}</span>
                                <span class="text-[8px] text-yellow-500 flex items-center"><i class="ph-fill ph-star mr-0.5"></i>5.0</span>
                            </div>
                        </div>
                    </div>
                </a>
            `;
            container.innerHTML += productCard;
        });

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        container.innerHTML = `<p class="text-xs text-fluxo-error p-4 w-full text-center">Não foi possível carregar os produtos.</p>`;
    }
}

// 4. Slider Automático de Anúncios (Pronto para receber BD da Diretoria futuramente)
function initBannerSlider() {
    const slider = document.getElementById('banner-slider');
    const dotsContainer = document.getElementById('banner-dots');
    
    if (!slider || !dotsContainer) return;

    const slides = slider.children;
    if (slides.length <= 1) return; // Se só tiver 1 anúncio, não precisa rolar

    let currentIndex = 0;
    
    setInterval(() => {
        currentIndex++;
        if (currentIndex >= slides.length) {
            currentIndex = 0;
        }

        // Calcula a posição do próximo slide e rola
        const scrollLeft = slides[currentIndex].offsetLeft;
        slider.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });

        // Atualiza as cores dos pontinhos visuais
        const dots = dotsContainer.children;
        for (let i = 0; i < dots.length; i++) {
            if (i === currentIndex) {
                dots[i].classList.replace('bg-gray-300', 'bg-fluxo-blue');
                dots[i].classList.replace('opacity-50', 'opacity-100');
            } else {
                dots[i].classList.replace('bg-fluxo-blue', 'bg-gray-300');
                dots[i].classList.replace('opacity-100', 'opacity-50');
            }
        }
    }, 4000); // Rola a cada 4 segundos automaticamente
}
