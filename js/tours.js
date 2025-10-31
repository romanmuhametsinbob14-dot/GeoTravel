// JavaScript для страницы туров

document.addEventListener('DOMContentLoaded', function() {
    initToursPage();
});

function initToursPage() {
    initFilters();
    initSearchFormFilters();
    initTourCards();
}

// Инициализация фильтров
function initFilters() {
    const filterForm = document.querySelector('.filters-form');
    const tourCards = document.querySelectorAll('.tour-card');
    
    if (!filterForm) return;
    
    // Обработка отправки формы фильтров
    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        filterTours();
    });
    
    function filterTours() {
        const selectedTypes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        
        const selectElement = document.querySelector('.form-select');
        const selectedNights = selectElement ? selectElement.value : '';
        
        tourCards.forEach(card => {
            let show = true;
            
            // Фильтр по типу тура
            if (selectedTypes.length > 0) {
                const cardType = card.dataset.type;
                if (!selectedTypes.includes(cardType)) {
                    show = false;
                }
            }
            
            // Показываем/скрываем карточку
            if (show) {
                card.style.display = 'block';
                card.classList.add('animate-in');
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Фильтрация по форме в секции поиска (Куда/Ночей/Дата)
function initSearchFormFilters() {
    const form = document.querySelector('.tour-search-form');
    const destinationSelect = document.getElementById('destination');
    const nightsSelect = document.getElementById('nights');
    const dateInput = document.getElementById('date');

    if (!form) return;

    function parseNightsFromCard(card) {
        // Ищем число ночей в блоках деталей или описании
        const details = Array.from(card.querySelectorAll('.detail-item span'))
            .map(el => el.textContent.toLowerCase());
        const desc = (card.querySelector('.card-text')?.textContent || '').toLowerCase();
        const allTexts = details.concat([desc]);
        let nights = null;
        for (const t of allTexts) {
            const m = t.match(/(\d{1,2})\s*ноч/i);
            if (m) { nights = parseInt(m[1], 10); break; }
        }
        return Number.isFinite(nights) ? nights : null;
    }

    function matchNights(nights, rangeValue) {
        if (!rangeValue || !nights) return true;
        switch (rangeValue) {
            case '3-5':
                return nights >= 3 && nights <= 5;
            case '6-8':
                return nights >= 6 && nights <= 8;
            case '9-14':
                return nights >= 9 && nights <= 14;
            case '15+':
                return nights >= 15;
            default:
                return true;
        }
    }

    function matchDestination(card, destValue) {
        if (!destValue) return true;
        const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
        const map = {
            'turkey': ['турция', 'анталия', 'стамбул'],
            'egypt': ['египет', 'хургада', 'шарм'],
            'thailand': ['тайланд', 'пхукет', 'самуи', 'бангкок'],
            'europe': ['европа', 'париж', 'рим', 'берлин', 'прага']
        };
        const keywords = map[destValue] || [];
        return keywords.some(k => title.includes(k));
    }

    function runFilter() {
        const destVal = destinationSelect ? destinationSelect.value : '';
        const nightsVal = nightsSelect ? nightsSelect.value : '';
        // Дата в статическом каталоге не фильтрует, игнорируем

        const cards = document.querySelectorAll('.tour-card');
        let anyShown = false;
        cards.forEach(card => {
            const nights = parseNightsFromCard(card);
            const okDest = matchDestination(card, destVal);
            const okNights = matchNights(nights, nightsVal);
            const show = okDest && okNights;
            card.style.display = show ? 'block' : 'none';
            if (show) anyShown = true;
        });

        // Если все скрыты — можно показать уведомление
        if (!anyShown) {
            try { travelAgency.showNotification('По заданным условиям туры не найдены', 'info'); } catch(_) {}
        }
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        runFilter();
    });

    // Применяем только по кнопке (submit)
}

// Извлечение цены из текста
function extractPrice(priceText) {
    const match = priceText.match(/[\d\s]+/);
    if (match) {
        return parseInt(match[0].replace(/\s/g, ''));
    }
    return 0;
}

// Инициализация карточек туров
function initTourCards() {
    const tourCards = document.querySelectorAll('.tour-card');
    
    tourCards.forEach(card => {
        // Добавляем анимацию при наведении
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Добавляем функциональность "Добавить в избранное"
        const favoriteBtn = card.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleFavorite(this, card);
            });
        }

        // Кнопка Забронировать: пробрасываем корректные параметры в booking.html
        const bookBtn = card.querySelector('.book-btn');
        if (bookBtn) {
            bookBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const title = card.querySelector('.card-title')?.textContent.trim() || '';
                const priceText = card.querySelector('.card-price')?.textContent || '';
                const price = (priceText.match(/[\d\s]+/)?.[0] || '').replace(/\s/g, '');
                const image = card.querySelector('.card-img')?.src || '';
                const category = card.querySelector('.tour-badge')?.textContent.trim() || '';
                const params = new URLSearchParams();
                if (title) params.set('title', title);
                if (price) params.set('price', price);
                if (image) params.set('image', image);
                if (category) params.set('category', category);
                params.set('adults', '2');
                params.set('children', '0');
                window.location.href = `booking.html?${params.toString()}`;
            });
        }
    });

    // Проставляем состояние избранного из localStorage
    applyFavoritesState();
}

// Переключение избранного
function toggleFavorite(button, cardEl) {
    const user = getCurrentUser();
    if (!user) {
        travelAgency.showNotification('Войдите, чтобы использовать избранное', 'info');
        window.location.href = '../pages/login.html';
        return;
    }

    const tourId = cardEl?.getAttribute('data-id') || cardEl?.querySelector('a.btn')?.href || cardEl?.querySelector('.card-title')?.textContent;
    if (!tourId) return;

    const favorites = getFavorites(user);
    const idx = favorites.indexOf(tourId);
    if (idx >= 0) {
        favorites.splice(idx, 1);
        button.classList.remove('favorited');
        button.innerHTML = '<i class="icon-heart-empty"></i> В избранное';
        travelAgency.showNotification('Тур удален из избранного', 'info');
    } else {
        favorites.push(tourId);
        button.classList.add('favorited');
        button.innerHTML = '<i class="icon-heart-filled"></i> В избранном';
        travelAgency.showNotification('Тур добавлен в избранное', 'success');
    }
    setFavorites(user, favorites);
}

function applyFavoritesState() {
    const user = getCurrentUser();
    if (!user) return;
    const favorites = getFavorites(user);
    document.querySelectorAll('.tour-card').forEach(card => {
        const tourId = card.getAttribute('data-id') || card.querySelector('a.btn')?.href || card.querySelector('.card-title')?.textContent;
        const btn = card.querySelector('.favorite-btn');
        if (!btn || !tourId) return;
        if (favorites.includes(tourId)) {
            btn.classList.add('favorited');
            btn.innerHTML = '<i class="icon-heart-filled"></i> В избранном';
        }
    });
}

function getCurrentUser() {
    try { return localStorage.getItem('gt_current_user') || null; } catch(e) { return null; }
}

function getFavorites(user) {
    try {
        const raw = localStorage.getItem(`gt_favorites_${user}`);
        return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
}

function setFavorites(user, arr) {
    try { localStorage.setItem(`gt_favorites_${user}`, JSON.stringify(arr)); } catch(e) {}
}

// Сортировка туров
function sortTours(sortBy) {
    const toursGrid = document.querySelector('.tours-grid');
    const tourCards = Array.from(toursGrid.querySelectorAll('.tour-card'));
    
    tourCards.sort((a, b) => {
        switch (sortBy) {
            case 'price-asc':
                return extractPrice(a.querySelector('.card-price').textContent) - 
                       extractPrice(b.querySelector('.card-price').textContent);
            case 'price-desc':
                return extractPrice(b.querySelector('.card-price').textContent) - 
                       extractPrice(a.querySelector('.card-price').textContent);
            case 'name-asc':
                return a.querySelector('.card-title').textContent.localeCompare(
                    b.querySelector('.card-title').textContent
                );
            case 'name-desc':
                return b.querySelector('.card-title').textContent.localeCompare(
                    a.querySelector('.card-title').textContent
                );
            default:
                return 0;
        }
    });
    
    // Перестраиваем DOM
    tourCards.forEach(card => {
        toursGrid.appendChild(card);
    });
}

// Поиск туров
function searchTours(query) {
    const tourCards = document.querySelectorAll('.tour-card');
    const searchQuery = query.toLowerCase();
    
    tourCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-text').textContent.toLowerCase();
        
        if (title.includes(searchQuery) || description.includes(searchQuery)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Инициализация поиска
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', travelAgency.utils.debounce(function() {
            searchTours(this.value);
        }, 300));
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
});



