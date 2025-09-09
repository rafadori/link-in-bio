// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da página
    const profileImg = document.getElementById('profileImg');
    const socialLinks = document.querySelectorAll('.social-link');
    const card = document.querySelector('.card');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    const loadingScreen = document.getElementById('loading-screen');
    
    // Verificar se elementos críticos existem
    if (!body) {
        console.error('Body element not found');
        return;
    }

    // Loading Screen Control
    function hideLoadingScreen() {
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1500); // Show loading for 1.5 seconds
        }
    }

    // Lazy Loading para imagens
    function setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // Performance Optimization
    function optimizePerformance() {
        // Preload critical resources
        const criticalImages = ['./assets/profilepic.jpg'];
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
        
        // Setup lazy loading
    setupLazyLoading();
}

// Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// Google Analytics Integration
function initializeAnalytics() {
    // Check if analytics is enabled in config
    fetch('./config.json')
        .then(response => response.json())
        .then(config => {
            if (config.features.analytics) {
                // Load Google Analytics
                const script = document.createElement('script');
                script.async = true;
                script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
                document.head.appendChild(script);
                
                // Initialize gtag
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'GA_MEASUREMENT_ID');
                
                // Track page view
                gtag('event', 'page_view', {
                    page_title: document.title,
                    page_location: window.location.href
                });
                
                // Track social link clicks
                document.querySelectorAll('.social-link').forEach(link => {
                    link.addEventListener('click', (e) => {
                        const platform = e.currentTarget.dataset.platform;
                        gtag('event', 'social_click', {
                            social_platform: platform,
                            link_url: e.currentTarget.href
                        });
                    });
                });
                
                // Track theme toggle
                if (themeToggle) {
                    themeToggle.addEventListener('click', () => {
                        const currentTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
                        gtag('event', 'theme_toggle', {
                            theme_switched_to: currentTheme
                        });
                    });
                }
            }
        })
        .catch(error => {
            console.log('Config not loaded, analytics disabled:', error);
        });
}

    // Animação de entrada dos links sociais
    function animateLinksOnLoad() {
        socialLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(-30px)';
            
            setTimeout(() => {
                link.style.transition = 'all 0.5s ease';
                link.style.opacity = '1';
                link.style.transform = 'translateX(0)';
            }, 300 + (index * 100));
        });
    }

    // Efeito de clique na foto de perfil
    profileImg.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            this.style.transform = 'scale(1.05)';
        }, 100);
        
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
        
        // Efeito de partículas (opcional)
        createParticles(this);
    });

    // Efeito de hover aprimorado para os links
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Efeito de clique
        link.addEventListener('click', function(e) {
            // Adiciona efeito de ripple
            createRipple(e, this);
            
            // Animação de clique
            this.style.transform = 'translateY(-1px) scale(0.98)';
            
            setTimeout(() => {
                this.style.transform = 'translateY(-3px) scale(1.02)';
            }, 150);
        });
    });

    // Função para criar efeito ripple
    function createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Função para criar partículas na foto de perfil
    function createParticles(element) {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                left: ${centerX}px;
                top: ${centerY}px;
                pointer-events: none;
                z-index: 1000;
                animation: particle-${i} 1s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            // Criar animação única para cada partícula
            const angle = (i * 45) * (Math.PI / 180);
            const distance = 50 + Math.random() * 30;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            const keyframes = `
                @keyframes particle-${i} {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(${endX}px, ${endY}px) scale(0);
                        opacity: 0;
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.textContent = keyframes;
            document.head.appendChild(style);
            
            setTimeout(() => {
                particle.remove();
                style.remove();
            }, 1000);
        }
    }

    // Efeito de paralaxe suave no cartão
    document.addEventListener('mousemove', function(e) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPercent = (clientX / innerWidth - 0.5) * 2;
        const yPercent = (clientY / innerHeight - 0.5) * 2;
        
        card.style.transform = `
            perspective(1000px) 
            rotateY(${xPercent * 2}deg) 
            rotateX(${-yPercent * 2}deg)
        `;
    });

    // Reset do efeito paralaxe quando o mouse sai da janela
    document.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });

    // Adicionar CSS para o efeito ripple
    const rippleCSS = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = rippleCSS;
    document.head.appendChild(style);

    // Funções do Modo Escuro
    function initTheme() {
        // Verificar preferência salva no localStorage
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            enableDarkMode();
        } else {
            enableLightMode();
        }
    }
    
    function enableDarkMode() {
        if (body) {
            body.classList.add('dark-theme');
        }
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
        }
        localStorage.setItem('theme', 'dark');
    }
    
    function enableLightMode() {
        if (body) {
            body.classList.remove('dark-theme');
        }
        if (themeIcon) {
            themeIcon.className = 'fas fa-moon';
        }
        localStorage.setItem('theme', 'light');
    }
    
    function toggleTheme() {
        if (body && body.classList.contains('dark-theme')) {
            enableLightMode();
            showToast('Modo claro ativado');
        } else {
            enableDarkMode();
            showToast('Modo escuro ativado');
        }
    }
    
    // Event listener para o botão toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Detectar mudanças na preferência do sistema
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    enableDarkMode();
                } else {
                    enableLightMode();
                }
            }
        });
    }

    // Função para copiar email ao clicar
    const emailLink = document.querySelector('[data-platform="email"]');
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = 'contato@exemplo.com';
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    showToast('Email copiado para a área de transferência!');
                });
            } else {
                // Fallback para navegadores mais antigos
                const textArea = document.createElement('textarea');
                textArea.value = email;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast('Email copiado para a área de transferência!');
            }
        });
    }

    // Função para mostrar toast de notificação
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            z-index: 1000;
            animation: toastSlideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // CSS para animações do toast
    const toastCSS = `
        @keyframes toastSlideIn {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        
        @keyframes toastSlideOut {
            from {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
            }
        }
    `;
    
    const toastStyle = document.createElement('style');
    toastStyle.textContent = toastCSS;
    document.head.appendChild(toastStyle);

    // Inicializar tema e animações
    initTheme();
    setTimeout(animateLinksOnLoad, 500);
    
    // Initialize performance optimizations
    optimizePerformance();
    
    // Hide loading screen when page is ready
    hideLoadingScreen();
    
    // Register Service Worker
    registerServiceWorker();
    
    // Initialize Analytics
    initializeAnalytics();

    // Adicionar efeito de loading
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
});