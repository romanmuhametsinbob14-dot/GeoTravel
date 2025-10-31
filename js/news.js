// JavaScript для страницы новостей

document.addEventListener('DOMContentLoaded', function() {
    initNewsPage();
});

function initNewsPage() {
    initFilters();
    initSearch();
    initPagination();
    initNewsletter();
}

// Инициализация фильтров
function initFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const newsItems = document.querySelectorAll('.news-item');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Убираем активный класс со всех вкладок
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // Добавляем активный класс к текущей вкладке
            this.classList.add('active');
            
            // Фильтруем новости
            filterNews(filter, newsItems);
        });
    });
}

// Фильтрация новостей
function filterNews(filter, newsItems) {
    newsItems.forEach(item => {
        const category = item.dataset.category;
        
        if (filter === 'all' || category === filter) {
            item.classList.remove('hidden');
            item.style.display = 'block';
        } else {
            item.classList.add('hidden');
            item.style.display = 'none';
        }
    });
}

// Инициализация поиска
function initSearch() {
    const searchInput = document.getElementById('newsSearch');
    const newsItems = document.querySelectorAll('.news-item');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchQuery = this.value.toLowerCase().trim();
            
            newsItems.forEach(item => {
                const title = item.querySelector('.news-title').textContent.toLowerCase();
                const excerpt = item.querySelector('.news-excerpt').textContent.toLowerCase();
                const category = item.querySelector('.news-category').textContent.toLowerCase();
                
                if (title.includes(searchQuery) || excerpt.includes(searchQuery) || category.includes(searchQuery)) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }
            });
            
            // Показываем сообщение, если ничего не найдено
            const visibleItems = Array.from(newsItems).filter(item => !item.classList.contains('hidden'));
            showNoResultsMessage(visibleItems.length === 0 && searchQuery !== '');
        });
    }
}

// Показать сообщение "Ничего не найдено"
function showNoResultsMessage(show) {
    let noResultsMessage = document.getElementById('noResultsMessage');
    
    if (show && !noResultsMessage) {
        noResultsMessage = document.createElement('div');
        noResultsMessage.id = 'noResultsMessage';
        noResultsMessage.className = 'no-results-message';
        noResultsMessage.innerHTML = `
            <div class="no-results-content">
                <i class="icon-search"></i>
                <h3>Ничего не найдено</h3>
                <p>Попробуйте изменить поисковый запрос или выберите другую категорию</p>
            </div>
        `;
        
        const newsGrid = document.getElementById('newsGrid');
        newsGrid.appendChild(noResultsMessage);
    } else if (!show && noResultsMessage) {
        noResultsMessage.remove();
    }
}

// Инициализация пагинации
function initPagination() {
    const pageNumbers = document.querySelectorAll('.page-number');
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');
    
    let currentPage = 1;
    const itemsPerPage = 6;
    const newsItems = document.querySelectorAll('.news-item');
    const totalPages = Math.ceil(newsItems.length / itemsPerPage);
    
    // Обработчики для номеров страниц
    pageNumbers.forEach((pageNumber, index) => {
        pageNumber.addEventListener('click', function() {
            const page = index + 1;
            if (page > totalPages) {
                showNoMorePagesMessage();
                return;
            }
            showPage(page, newsItems, itemsPerPage);
            updatePagination(page, totalPages);
        });
    });
    
    // Обработчики для кнопок "Предыдущая" и "Следующая"
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage, newsItems, itemsPerPage);
                updatePagination(currentPage, totalPages);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                showPage(currentPage, newsItems, itemsPerPage);
                updatePagination(currentPage, totalPages);
            }
        });
    }
}

// Показать страницу
function showPage(page, newsItems, itemsPerPage) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    newsItems.forEach((item, index) => {
        if (index >= startIndex && index < endIndex) {
            item.style.display = 'block';
            item.classList.remove('hidden');
        } else {
            item.style.display = 'none';
            item.classList.add('hidden');
        }
    });
}

// Обновить пагинацию
function updatePagination(currentPage, totalPages) {
    const pageNumbers = document.querySelectorAll('.page-number');
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');
    
    // Обновляем номера страниц
    pageNumbers.forEach((pageNumber, index) => {
        const page = index + 1;
        if (page === currentPage) {
            pageNumber.classList.add('active');
        } else {
            pageNumber.classList.remove('active');
        }
        
        // Скрываем номера страниц, которые не нужны
        if (page > totalPages) {
            pageNumber.classList.add('disabled');
            pageNumber.setAttribute('aria-disabled', 'true');
        } else {
            pageNumber.classList.remove('disabled');
            pageNumber.removeAttribute('aria-disabled');
        }
    });
    
    // Обновляем кнопки "Предыдущая" и "Следующая"
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }
}

function showNoMorePagesMessage() {
    let el = document.getElementById('noMoreNews');
    if (!el) {
        el = document.createElement('div');
        el.id = 'noMoreNews';
        el.style.margin = '20px 0';
        el.style.textAlign = 'center';
        el.style.color = '#666';
        el.textContent = 'Больше новостей нет';
        const container = document.querySelector('.news-list .container') || document.getElementById('newsGrid')?.parentElement;
        (container || document.body).appendChild(el);
        setTimeout(()=>{ if(el) el.remove(); }, 2000);
    }
}

// Инициализация подписки на новости
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
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
    const agreement = form.querySelector('input[type="checkbox"]').checked;
    
    if (!email) {
        travelAgency.showNotification('Введите email адрес', 'error');
        return;
    }
    
    if (!agreement) {
        travelAgency.showNotification('Необходимо согласие с политикой конфиденциальности', 'error');
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

// Анимация появления новостей при прокрутке
function initScrollAnimations() {
    const newsItems = document.querySelectorAll('.news-item');
    
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
    
    newsItems.forEach(item => {
        observer.observe(item);
    });
}

// Инициализация анимаций при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
});

// Функция для добавления новой новости
function addNewsItem(title, excerpt, category, date, image, badge = 'Новое') {
    const newsGrid = document.getElementById('newsGrid');
    const newsItem = document.createElement('article');
    newsItem.className = 'news-item';
    newsItem.dataset.category = category;
    
    newsItem.innerHTML = `
        <div class="news-image">
            <img src="${image}" alt="${title}">
            <div class="news-badge">${badge}</div>
        </div>
        <div class="news-content">
            <div class="news-meta">
                <span class="news-date">${date}</span>
                <span class="news-category">${category}</span>
            </div>
            <h2 class="news-title">${title}</h2>
            <p class="news-excerpt">${excerpt}</p>
            <a href="news-detail.html" class="read-more">Читать далее</a>
        </div>
    `;
    
    newsGrid.appendChild(newsItem);
    
    // Анимация появления
    setTimeout(() => {
        newsItem.classList.add('animate-in');
    }, 100);
}

// Экспорт функций для использования в других файлах
window.News = {
    addNewsItem: addNewsItem,
    filterNews: filterNews
};




