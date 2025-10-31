// JavaScript для страницы галереи

document.addEventListener('DOMContentLoaded', function() {
    initGalleryPage();
});

function initGalleryPage() {
    initFilters();
    initPagination();
    initLightbox();
    initLoadMore();
}

// Данные галереи
const galleryData = [
    { src: 'https://getmecar.ru/wp-content/uploads/2024/02/11-e1651558649220.jpg', title: 'Отель Delphin Imperial', description: 'Анталия, Турция', category: 'hotels' },
    { src: 'https://avatars.mds.yandex.net/i?id=706c15ff4fe613186f39db881365388b_l-7758910-images-thumbs&n=13', title: 'Пляж в Анталии', description: 'Турция', category: 'beaches' },
    { src: 'https://inbusiness.kz/uploads/2025-6/v02IfVym.jpg', title: 'Стамбул', description: 'Турция', category: 'cities' },
    { src: 'https://sun9-40.userapi.com/c604525/v604525628/5a3fa/DFi66xcuVuc.jpg', title: 'Каппадокия', description: 'Турция', category: 'nature' },
    { src: 'https://avatars.mds.yandex.net/i?id=aba51126b020fb3731fecf9fbe56b3fd_l-8168927-images-thumbs&n=13', title: 'Отель в Хургаде', description: 'Египет', category: 'hotels' },
    { src: 'https://cdn.fishki.net/upload/post/201401/27/1240358/394645.jpg', title: 'Красное море', description: 'Египет', category: 'beaches' },
    { src: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', title: 'Каир', description: 'Египет', category: 'cities' },
    { src: 'https://images.unsplash.com/photo-1544989164-31dc3c645987?w=1200', title: 'Пирамиды Гизы', description: 'Египет', category: 'nature' },
    { src: 'https://sun9-85.userapi.com/impf/xGC0HdQyAGxHYmSn37kEBzItLPYfUbN3-uEueA/0I2a3RP_CQM.jpg?size=1920x768&quality=95&crop=0,60,1220,487&sign=e8c48d3696f4621ad6049632cf00851c&type=cover_group', title: 'Отель в Тайланде', description: 'Пхукет', category: 'hotels' },
    { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200', title: 'Пляж в Тайланде', description: 'Пхукет', category: 'beaches' },
    { src: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1200', title: 'Тайская кухня', description: 'Тайланд', category: 'food' },
    { src: 'https://images.unsplash.com/photo-1582562124811-c09040d0fb1a?w=1200', title: 'Джунгли Тайланда', description: 'Тайланд', category: 'nature' }
];

let currentImageIndex = 0;
let currentFilter = 'all';
let currentView = 'grid';

// Инициализация фильтров
function initFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Убираем активный класс со всех вкладок
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // Добавляем активный класс к текущей вкладке
            this.classList.add('active');
            
            // Фильтруем галерею
            filterGallery(filter, galleryItems);
            currentFilter = filter;
        });
    });
}

// Фильтрация галереи
function filterGallery(filter, galleryItems) {
    galleryItems.forEach(item => {
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

// Инициализация переключения вида
function initViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const galleryGrid = document.getElementById('galleryGrid');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Убираем активный класс со всех кнопок
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс к текущей кнопке
            this.classList.add('active');
            
            // Переключаем вид
            toggleView(view, galleryGrid);
            currentView = view;
        });
    });
}

// Переключение вида
function toggleView(view, galleryGrid) {
    if (view === 'list') {
        galleryGrid.classList.add('list-view');
    } else {
        galleryGrid.classList.remove('list-view');
    }
}

// Пагинация (1 и 2)
function initPagination() {
    const pageButtons = document.querySelectorAll('.page-btn');
    const galleryItems = Array.from(document.querySelectorAll('#galleryGrid .gallery-item'));
    if (!galleryItems.length) return;
    const perHalf = Math.ceil(galleryItems.length / 2);

    function showPage(page) {
        galleryItems.forEach((item, idx) => {
            const onPage1 = idx < perHalf;
            const shouldShow = page === 1 ? onPage1 : !onPage1;
            item.style.display = shouldShow ? 'block' : 'none';
        });
    }

    pageButtons.forEach(btn => {
        btn.addEventListener('click', function(){
            pageButtons.forEach(b=>b.classList.remove('active'));
            this.classList.add('active');
            const page = Number(this.dataset.page) || 1;
            showPage(page);
        });
    });

    // initial
    showPage(1);
}

// Инициализация лайтбокса
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    
    // Закрытие по клику на overlay
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

// Открыть лайтбокс
function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    currentImageIndex = index;
    const imageData = galleryData[index];
    
    lightboxImage.src = imageData.src;
    lightboxImage.alt = imageData.title;
    lightboxTitle.textContent = imageData.title;
    lightboxDescription.textContent = imageData.description;
    lightboxCounter.textContent = `${index + 1} из ${galleryData.length}`;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Закрыть лайтбокс
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Предыдущее изображение
function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryData.length) % galleryData.length;
    openLightbox(currentImageIndex);
}

// Следующее изображение
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryData.length;
    openLightbox(currentImageIndex);
}

// Инициализация кнопки "Загрузить еще"
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreImages();
        });
    }
}

// Загрузить больше изображений
function loadMoreImages() {
    // В реальном приложении здесь будет AJAX запрос
    // Пока что просто показываем сообщение
    travelAgency.showNotification('Все изображения загружены', 'info');
}

// Анимация появления элементов при прокрутке
function initScrollAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
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
    
    galleryItems.forEach(item => {
        observer.observe(item);
    });
}

// Инициализация анимаций при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
});

// Функция для добавления нового изображения в галерею
function addGalleryImage(imageData) {
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.dataset.category = imageData.category;
    
    galleryItem.innerHTML = `
        <div class="gallery-image">
            <img src="${imageData.src}" alt="${imageData.title}">
            <div class="gallery-overlay">
                <button class="gallery-btn" onclick="openLightbox(${galleryData.length})">
                    <i class="icon-zoom"></i>
                </button>
            </div>
        </div>
        <div class="gallery-info">
            <h3>${imageData.title}</h3>
            <p>${imageData.description}</p>
        </div>
    `;
    
    galleryGrid.appendChild(galleryItem);
    galleryData.push(imageData);
    
    // Анимация появления
    setTimeout(() => {
        galleryItem.classList.add('animate-in');
    }, 100);
}

// Экспорт функций для использования в других файлах
window.Gallery = {
    openLightbox: openLightbox,
    closeLightbox: closeLightbox,
    addGalleryImage: addGalleryImage
};




