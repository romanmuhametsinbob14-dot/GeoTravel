document.addEventListener('DOMContentLoaded', function() {
    initContactsPage();
});

function initContactsPage() {
    initContactForm();
    initFAQ();
    initMap();
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmit(this);
        });

        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

function handleContactFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    if (validateForm(form)) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;

        setTimeout(() => {
            travelAgency.showNotification('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.', 'success');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    removeFieldError(field);

    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Это поле обязательно для заполнения';
    }
    
    // Специфичные проверки
    if (value && fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Введите корректный email адрес';
        }
    }
    
    if (value && fieldName === 'phone') {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Введите корректный номер телефона';
        }
    }
    
    // Показываем ошибку если есть
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Показать ошибку поля
function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Убрать ошибку поля
function removeFieldError(field) {
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Инициализация FAQ
function initFAQ() {
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

// Инициализация карты
function initMap() {
    // Проверяем, загружена ли Яндекс.Карты
    if (typeof ymaps !== 'undefined') {
        ymaps.ready(function() {
            const map = new ymaps.Map('map', {
                center: [55.7558, 37.6176], // Координаты Москвы
                zoom: 15
            });
            
            // Добавляем метку
            const placemark = new ymaps.Placemark([55.7558, 37.6176], {
                balloonContent: 'Туристическое агентство "Путешествие"<br>ул. Тверская, 15'
            });
            
            map.geoObjects.add(placemark);
        });
    } else {
        // Если Яндекс.Карты не загружены, показываем заглушку
        const mapElement = document.getElementById('map');
        if (mapElement) {
            mapElement.innerHTML = '<div class="map-placeholder">Карта временно недоступна</div>';
        }
    }
}

// Копирование контактной информации
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        travelAgency.showNotification('Скопировано в буфер обмена', 'success');
    }).catch(function() {
        travelAgency.showNotification('Не удалось скопировать', 'error');
    });
}

// Инициализация кнопок копирования
function initCopyButtons() {
    const phoneNumbers = document.querySelectorAll('.phone-number');
    const emailAddresses = document.querySelectorAll('.email-address');
    
    phoneNumbers.forEach(phone => {
        phone.addEventListener('click', function() {
            copyToClipboard(this.textContent);
        });
    });
    
    emailAddresses.forEach(email => {
        email.addEventListener('click', function() {
            copyToClipboard(this.textContent);
        });
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initCopyButtons();
});



