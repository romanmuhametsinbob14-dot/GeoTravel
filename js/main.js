// Основной JavaScript файл

// Загрузка header и footer
document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    try { initAuthHeader(); } catch(_) {}
});

// Загрузка header
function loadHeader() {
    const headerContainer = document.getElementById('header');
    if (headerContainer) {
        // Определяем правильный путь к header в зависимости от текущей страницы
        const isInPagesFolder = window.location.pathname.includes('/pages/');
        const headerPath = isInPagesFolder ? '../components/header.html' : 'components/header-main.html';
        
        fetch(headerPath)
            .then(response => response.text())
            .then(data => {
                headerContainer.innerHTML = data;
                // Normalize logo link and image so they work from any page (root or /pages)
                try {
                    const isInPagesFolderNow = window.location.pathname.includes('/pages/');
                    const base = isInPagesFolderNow ? '../' : '';
                    const logoLink = document.querySelector('#header .logo a');
                    const logoImg = document.querySelector('#header .logo-img');
                    if (logoLink) logoLink.setAttribute('href', base + 'index.html');
                    if (logoImg) logoImg.setAttribute('src', base + 'images/logo.png');
                } catch (_) {}
                initMobileMenu();
                try { initAuthHeader(); } catch(_) {}
            })
            .catch(error => console.error('Ошибка загрузки header:', error));
    }
}

// Загрузка footer
function loadFooter() {
    const footerContainer = document.getElementById('footer');
    if (footerContainer) {
        // Определяем правильный путь к footer в зависимости от текущей страницы
        const isInPagesFolder = window.location.pathname.includes('/pages/');
        const footerPath = isInPagesFolder ? '../components/footer.html' : 'components/footer.html';
        
        fetch(footerPath)
            .then(response => response.text())
            .then(data => {
                footerContainer.innerHTML = data;
                try {
                    const isInPagesFolderNow = window.location.pathname.includes('/pages/');
                    const base = isInPagesFolderNow ? '../' : '';
                    // Нормализуем ссылки футера на страницы
                    const footerRoot = footerContainer.querySelector('.footer');
                    if (footerRoot) {
                        const anchors = footerRoot.querySelectorAll('a[href]');
                        anchors.forEach(a => {
                            const href = a.getAttribute('href');
                            if (!href) return;
                            // Если ссылка уже абсолютная или якорь — пропускаем
                            if (/^https?:\/\//.test(href) || href.startsWith('#')) return;
                            // Приводим ссылки к pages/* относительно текущего уровня
                            const cleaned = href.replace(/^\.\.\//, '');
                            if (cleaned.startsWith('pages/')) {
                                a.setAttribute('href', base + cleaned);
                            }
                        });
                    }
                } catch (_) {}
            })
            .catch(error => console.error('Ошибка загрузки footer:', error));
    }
}

// Минимальная реализация initAuthHeader без зависимости от auth.js
function initAuthHeader() {
    const isInPagesFolderNow = window.location.pathname.includes('/pages/');
    const base = isInPagesFolderNow ? '../pages/' : 'pages/';
    const headerRoot = document.getElementById('header');
    if (!headerRoot) return;
    const actions = headerRoot.querySelector('.header-actions');
    const mobileContact = headerRoot.querySelector('.mobile-contact');
    if (!actions && !mobileContact) return;

    let currentUser = null;
    try { currentUser = localStorage.getItem('gt_current_user'); } catch (_) {}

    const setActions = (container) => {
        if (!container) return;
        container.innerHTML = '';
        if (currentUser) {
            const acc = document.createElement('a'); acc.className = 'btn btn-outline'; acc.href = base + 'account.html'; acc.textContent = 'Личный кабинет';
            const logout = document.createElement('a'); logout.className = 'btn'; logout.href = '#'; logout.textContent = 'Выйти';
            logout.addEventListener('click', function(e){ e.preventDefault(); try { localStorage.removeItem('gt_current_user'); } catch(_){} window.location.reload(); });
            container.appendChild(acc); container.appendChild(logout);
        } else {
            const login = document.createElement('a'); login.className = 'btn btn-primary'; login.href = base + 'login.html'; login.textContent = 'Войти';
            const reg = document.createElement('a'); reg.className = 'btn btn-outline'; reg.href = base + 'register.html'; reg.textContent = 'Регистрация';
            container.appendChild(login); container.appendChild(reg);
        }
    };

    setActions(actions);
    setActions(mobileContact);
}


// Мобильное меню
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
    
    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
    
    // Обработка выпадающих меню в мобильной версии
    mobileDropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });
    
    // Закрытие мобильного меню при клике вне его
    document.addEventListener('click', function(e) {
        if (mobileNav && mobileNav.classList.contains('active')) {
            if (!mobileNav.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobileNav.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        }
    });
}


// Плавная прокрутка для якорных ссылок
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Анимация появления элементов при прокрутке
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами с классом animate-on-scroll
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Инициализация анимаций при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
});

// Обработка форм
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Skip globally handled forms (e.g., auth)
        if (form.matches('[data-skip-global="true"]')) return;
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    });
}

// Обработка отправки формы
function handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Показываем сообщение об успешной отправке
    showNotification('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.', 'success');
    
    // Очищаем форму
    form.reset();
}

// Показ уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Закрытие по клику
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
}

// Скрытие уведомления
function hideNotification(notification) {
    notification.classList.add('hide');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Инициализация форм при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initForms();
});

// Утилиты
const utils = {
    // Форматирование цены
    formatPrice: function(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    },
    
    // Форматирование даты
    formatDate: function(date) {
        return new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },
    
    // Дебаунс функция
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Экспорт для использования в других файлах
window.travelAgency = {
    utils: utils,
    showNotification: showNotification
};



