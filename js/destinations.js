// JavaScript для страницы направлений

document.addEventListener('DOMContentLoaded', function() {
    initDestinationsPage();
});

function initDestinationsPage() {
    initGallery();
    initStats();
    initScrollAnimations();
}

// Инициализация галереи
function initGallery() {
    const galleries = document.querySelectorAll('.destination-gallery');
    
    galleries.forEach(gallery => {
        const mainImage = gallery.querySelector('.main-image img');
        const thumbImages = gallery.querySelectorAll('.thumb-image');
        
        thumbImages.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Убираем активный класс со всех миниатюр
                thumbImages.forEach(t => t.classList.remove('active'));
                
                // Добавляем активный класс к текущей миниатюре
                this.classList.add('active');
                
                // Меняем основное изображение на большую версию
                if (mainImage) {
                    let largeImageSrc = this.src;
                    
                    // Если это URL Unsplash, заменяем размер w=300 на w=1000
                    if (this.src.includes('unsplash.com')) {
                        largeImageSrc = this.src.replace('w=300', 'w=1000');
                    }
                    // Для остальных URL используем оригинальное изображение
                    
                    mainImage.src = largeImageSrc;
                    mainImage.alt = this.alt;
                }
            });
        });
    });
}

// Инициализация анимации статистики
function initStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// Анимация чисел
function animateNumber(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2000; // 2 секунды
    const step = target / (duration / 16); // 60 FPS
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Форматируем число в зависимости от его значения
        if (target >= 1000) {
            element.textContent = Math.floor(current).toLocaleString('ru-RU') + '+';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Инициализация анимаций при прокрутке
function initScrollAnimations() {
    const destinationSections = document.querySelectorAll('.destination-section');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    destinationSections.forEach(section => {
        observer.observe(section);
    });
}

// Плавная прокрутка к секции
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Инициализация навигации по направлениям
function initDestinationNavigation() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initDestinationNavigation();
});



