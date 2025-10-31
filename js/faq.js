// JavaScript для страницы FAQ

document.addEventListener('DOMContentLoaded', function() {
    initFAQPage();
});

function initFAQPage() {
    initFAQItems();
    initSearch();
    initCategories();
}

// Инициализация FAQ элементов
function initFAQItems() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Закрываем все остальные элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Переключаем текущий элемент
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

// Инициализация поиска
function initSearch() {
    const searchInput = document.getElementById('faqSearch');
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchQuery = this.value.toLowerCase().trim();
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                
                if (question.includes(searchQuery) || answer.includes(searchQuery)) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }
            });
            
            // Показываем сообщение, если ничего не найдено
            const visibleItems = Array.from(faqItems).filter(item => !item.classList.contains('hidden'));
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
        
        const faqItems = document.querySelector('.faq-items');
        faqItems.appendChild(noResultsMessage);
    } else if (!show && noResultsMessage) {
        noResultsMessage.remove();
    }
}

// Инициализация категорий
function initCategories() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Убираем активный класс со всех кнопок
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс к текущей кнопке
            this.classList.add('active');
            
            // Фильтруем элементы
            filterByCategory(category, faqItems);
        });
    });
}

// Фильтрация по категории
function filterByCategory(category, faqItems) {
    faqItems.forEach(item => {
        const itemCategory = item.dataset.category;
        
        if (category === 'all' || itemCategory === category) {
            item.classList.remove('hidden');
            item.style.display = 'block';
        } else {
            item.classList.add('hidden');
            item.style.display = 'none';
        }
    });
    
    // Очищаем поиск при смене категории
    const searchInput = document.getElementById('faqSearch');
    if (searchInput) {
        searchInput.value = '';
    }
}

// Анимация появления элементов при прокрутке
function initScrollAnimations() {
    const faqItems = document.querySelectorAll('.faq-item');
    
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
    
    faqItems.forEach(item => {
        observer.observe(item);
    });
}

// Инициализация анимаций при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
});

// Функция для добавления нового FAQ элемента
function addFAQItem(question, answer, category = 'all') {
    const faqItems = document.querySelector('.faq-items');
    const newItem = document.createElement('div');
    newItem.className = 'faq-item';
    newItem.dataset.category = category;
    
    newItem.innerHTML = `
        <div class="faq-question">
            <h3>${question}</h3>
            <i class="icon-arrow"></i>
        </div>
        <div class="faq-answer">
            <p>${answer}</p>
        </div>
    `;
    
    faqItems.appendChild(newItem);
    
    // Добавляем обработчик клика
    const questionElement = newItem.querySelector('.faq-question');
    questionElement.addEventListener('click', function() {
        const isActive = newItem.classList.contains('active');
        
        // Закрываем все остальные элементы
        const allItems = document.querySelectorAll('.faq-item');
        allItems.forEach(otherItem => {
            if (otherItem !== newItem) {
                otherItem.classList.remove('active');
            }
        });
        
        // Переключаем текущий элемент
        if (isActive) {
            newItem.classList.remove('active');
        } else {
            newItem.classList.add('active');
        }
    });
    
    // Анимация появления
    setTimeout(() => {
        newItem.classList.add('animate-in');
    }, 100);
}

// Экспорт функций для использования в других файлах
window.FAQ = {
    addFAQItem: addFAQItem,
    filterByCategory: filterByCategory
};




