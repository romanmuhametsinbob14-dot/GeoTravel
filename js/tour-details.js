// JavaScript для страницы деталей тура

document.addEventListener('DOMContentLoaded', function() {
    initTourDetailsPage();
    try { applyTourFromQuery(); } catch(_) {}
});

function initTourDetailsPage() {
    initGallery();
    initTabs();
    initBooking();
    initReviews();
}

// Apply dynamic content by id from query
function applyTourFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;
    const map = {
        '1': {
            title: 'Анталия, Турция - 7 ночей',
            badge: 'Пляжный отдых',
            price: '35 000 ₽',
            image: 'https://i.pinimg.com/originals/78/ca/35/78ca357fc5263ad3392717c74a30e9ac.jpg'
        },
        '2': {
            title: 'Хургада, Египет - 10 ночей',
            badge: 'Пляжный отдых',
            price: '42 000 ₽',
            image: 'https://avatars.mds.yandex.net/i?id=2885796b56e1516b0bd04ab00912082e_l-8375627-images-thumbs&n=13'
        },
        '3': {
            title: 'Европа: 5 столиц - 10 дней',
            badge: 'Экскурсионный',
            price: '55 000 ₽',
            image: 'https://sun9-40.userapi.com/c604525/v604525628/5a3fa/DFi66xcuVuc.jpg'
        },
        '4': {
            title: 'Стамбул - 5 дней',
            badge: 'Экскурсионный',
            price: '28 000 ₽',
            image: 'https://inbusiness.kz/uploads/2025-6/v02IfVym.jpg'
        },
        '5': {
            title: 'Тайланд: острова и джунгли - 12 дней',
            badge: 'Приключенческий',
            price: '65 000 ₽',
            image: 'https://avatars.mds.yandex.net/i?id=23f68c52c2180ceae08be4c3aa58601c_l-5482778-images-thumbs&n=13'
        },
        '6': {
            title: 'ОАЭ: пустыня и небоскребы - 8 дней',
            badge: 'Приключенческий',
            price: '48 000 ₽',
            image: 'https://cdn.fishki.net/upload/post/201401/27/1240358/394645.jpg'
        },
        '7': {
            title: 'Карловы Вары, Чехия - 10 дней',
            badge: 'Лечебно-оздоровительный',
            price: '75 000 ₽',
            image: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Karlovy_Vary_Czech.jpg'
        },
        '8': {
            title: 'Мертвое море, Израиль - 7 дней',
            badge: 'Лечебно-оздоровительный',
            price: '58 000 ₽',
            image: 'https://avatars.mds.yandex.net/i?id=c51ac7a529be4887f5820b121edb11c9_l-4283547-images-thumbs&n=13'
        }
    };
    const data = map[id];
    if (!data) return;
    const titleEl = document.querySelector('.tour-info h1');
    const badgeEl = document.querySelector('.tour-badge');
    const priceEl = document.querySelector('.tour-price .price-main');
    const mainImage = document.getElementById('mainImage');
    if (titleEl) titleEl.textContent = data.title;
    if (badgeEl) badgeEl.textContent = data.badge;
    if (priceEl) priceEl.textContent = 'от ' + data.price;
    if (mainImage) mainImage.src = data.image;
}

// Инициализация галереи
function initGallery() {
    const mainImage = document.getElementById('mainImage');
    const thumbImages = document.querySelectorAll('.thumb');
    
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
}

// Функция для смены изображения (вызывается из HTML)
function changeImage(thumb) {
    const mainImage = document.getElementById('mainImage');
    const thumbImages = document.querySelectorAll('.thumb');
    
    // Убираем активный класс со всех миниатюр
    thumbImages.forEach(t => t.classList.remove('active'));
    
    // Добавляем активный класс к текущей миниатюре
    thumb.classList.add('active');
    
    // Меняем основное изображение на большую версию
    if (mainImage) {
        let largeImageSrc = thumb.src;
        
        // Если это URL Unsplash, заменяем размер w=300 на w=1000
        if (thumb.src.includes('unsplash.com')) {
            largeImageSrc = thumb.src.replace('w=300', 'w=1000');
        }
        // Для остальных URL используем оригинальное изображение
        
        mainImage.src = largeImageSrc;
        mainImage.alt = thumb.alt;
    }
}

// Инициализация табов
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showTab(targetTab);
        });
    });
}

// Функция для показа таба (вызывается из HTML)
function showTab(tabName) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Убираем активный класс со всех кнопок и панелей
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    // Добавляем активный класс к выбранной кнопке и панели
    const activeButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    const activePane = document.getElementById(tabName);
    
    if (activeButton) activeButton.classList.add('active');
    if (activePane) activePane.classList.add('active');
}

// Инициализация бронирования
function initBooking() {
    const bookingBtn = document.querySelector('.tour-actions .btn-primary');
    if (!bookingBtn) return;

    bookingBtn.addEventListener('click', function() {
        const titleEl = document.querySelector('.tour-info h1');
        const priceEl = document.querySelector('.tour-price .price-main');
        const imageEl = document.getElementById('mainImage');
        const badgeEl = document.querySelector('.tour-badge');

        const title = titleEl ? titleEl.textContent.trim() : '';
        const priceText = priceEl ? priceEl.textContent.trim() : '';
        const price = priceText.replace(/[^0-9]/g, '');
        const image = imageEl ? imageEl.src : '';
        const category = badgeEl ? badgeEl.textContent.trim() : '';

        const params = new URLSearchParams();
        if (title) params.set('title', title);
        if (price) params.set('price', price);
        if (image) params.set('image', image);
        if (category) params.set('category', category);
        // Default adults/children
        params.set('adults', '2');
        params.set('children', '0');

        window.location.href = `booking.html?${params.toString()}`;
    });
}

// Показать модальное окно бронирования
function showBookingModal() {}

// Создать модальное окно бронирования
function createBookingModal() { return null; }

// Закрыть модальное окно
function closeModal(modal) {}

// Обработка отправки формы бронирования
function handleBookingSubmit(form, modal) {}

// Инициализация отзывов
function initReviews() {
    const reviewItems = document.querySelectorAll('.review-item');
    
    // Анимация появления отзывов при прокрутке
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    reviewItems.forEach(item => {
        observer.observe(item);
    });
}

// Добавление отзыва
function addReview(reviewData) {
    const reviewsList = document.querySelector('.reviews-list');
    if (!reviewsList) return;
    
    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item';
    reviewItem.innerHTML = `
        <div class="review-header">
            <div class="review-author">
                <img src="${reviewData.avatar || 'images/default-avatar.jpg'}" alt="${reviewData.name}" class="author-avatar">
                <div class="author-info">
                    <h4>${reviewData.name}</h4>
                    <div class="review-stars">${'★'.repeat(reviewData.rating)}</div>
                </div>
            </div>
            <div class="review-date">${new Date().toLocaleDateString('ru-RU')}</div>
        </div>
        <p>${reviewData.comment}</p>
    `;
    
    reviewsList.appendChild(reviewItem);
    
    // Анимация появления
    setTimeout(() => {
        reviewItem.classList.add('animate-in');
    }, 100);
}



