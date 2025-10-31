// JavaScript для страницы деталей новости

document.addEventListener('DOMContentLoaded', function() {
    initNewsDetailPage();
});

function initNewsDetailPage() {
    initSocialShare();
    initNewsletter();
    initRelatedNews();
    initScrollAnimations();
}

// Инициализация социальных кнопок
function initSocialShare() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.classList[1]; // vk, facebook, telegram, whatsapp
            shareToSocial(platform);
        });
    });
}

// Поделиться в социальных сетях
function shareToSocial(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const text = encodeURIComponent(document.querySelector('.news-excerpt p').textContent);
    
    let shareUrl = '';
    
    switch (platform) {
        case 'vk':
            shareUrl = `https://vk.com/share.php?url=${url}&title=${title}&description=${text}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${url}&text=${title}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${title} ${url}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Инициализация подписки на новости
function initNewsletter() {
    const newsletterForm = document.querySelector('.sidebar-newsletter');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSubmit(this);
        });
    }
}

// Обработка подписки на новости
function handleNewsletterSubmit(form) {
    const email = form.querySelector('input[type="email"]').value;
    
    if (!email) {
        travelAgency.showNotification('Введите email адрес', 'error');
        return;
    }
    
    // Показываем индикатор загрузки
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Подписываем...';
    submitBtn.disabled = true;
    
    // Имитация подписки
    setTimeout(() => {
        travelAgency.showNotification('Спасибо! Вы успешно подписались на наши новости.', 'success');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Инициализация похожих новостей
function initRelatedNews() {
    const relatedItems = document.querySelectorAll('.related-item');
    
    relatedItems.forEach(item => {
        item.addEventListener('click', function() {
            // В реальном приложении здесь будет переход к конкретной новости
            window.location.href = 'news-detail.html';
        });
    });
}

// Анимация появления элементов при прокрутке
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.hotel-item, .related-item, .tour-item');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Функция для копирования ссылки на новость
function copyNewsLink() {
    const url = window.location.href;
    
    navigator.clipboard.writeText(url).then(function() {
        travelAgency.showNotification('Ссылка скопирована в буфер обмена', 'success');
    }).catch(function() {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        travelAgency.showNotification('Ссылка скопирована в буфер обмена', 'success');
    });
}

// Функция для печати новости
function printNews() {
    window.print();
}

// Функция для добавления новости в избранное
function addToFavorites() {
    const newsId = getNewsIdFromUrl();
    
    // Получаем сохраненные избранные новости
    let favorites = JSON.parse(localStorage.getItem('favoriteNews') || '[]');
    
    if (favorites.includes(newsId)) {
        // Удаляем из избранного
        favorites = favorites.filter(id => id !== newsId);
        travelAgency.showNotification('Новость удалена из избранного', 'info');
    } else {
        // Добавляем в избранное
        favorites.push(newsId);
        travelAgency.showNotification('Новость добавлена в избранное', 'success');
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('favoriteNews', JSON.stringify(favorites));
    
    // Обновляем UI
    updateFavoriteButton(favorites.includes(newsId));
}

// Получить ID новости из URL
function getNewsIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '1';
}

// Обновить кнопку избранного
function updateFavoriteButton(isFavorite) {
    const favoriteBtn = document.querySelector('.favorite-btn');
    if (favoriteBtn) {
        if (isFavorite) {
            favoriteBtn.classList.add('favorited');
            favoriteBtn.innerHTML = '<i class="icon-heart-filled"></i> В избранном';
        } else {
            favoriteBtn.classList.remove('favorited');
            favoriteBtn.innerHTML = '<i class="icon-heart-empty"></i> В избранное';
        }
    }
}

// Инициализация кнопок действий
function initActionButtons() {
    // Добавляем кнопки действий в заголовок новости
    const newsHeader = document.querySelector('.news-header .container');
    if (newsHeader) {
        const actionButtons = document.createElement('div');
        actionButtons.className = 'news-actions';
        actionButtons.innerHTML = `
            <button class="action-btn" onclick="copyNewsLink()" title="Копировать ссылку">
                <i class="icon-link"></i>
            </button>
            <button class="action-btn" onclick="printNews()" title="Печать">
                <i class="icon-print"></i>
            </button>
            <button class="action-btn favorite-btn" onclick="addToFavorites()" title="В избранное">
                <i class="icon-heart-empty"></i>
            </button>
        `;
        
        newsHeader.appendChild(actionButtons);
        
        // Проверяем, есть ли новость в избранном
        const newsId = getNewsIdFromUrl();
        const favorites = JSON.parse(localStorage.getItem('favoriteNews') || '[]');
        updateFavoriteButton(favorites.includes(newsId));
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initActionButtons();
});

// Экспорт функций для использования в других файлах
window.NewsDetail = {
    copyNewsLink: copyNewsLink,
    printNews: printNews,
    addToFavorites: addToFavorites
};




