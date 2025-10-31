// JavaScript для страницы бронирования

document.addEventListener('DOMContentLoaded', function() {
    initBookingPage();
});

function initBookingPage() {
    prefillFromParams();
    try { prefillFromProfile(); } catch(_) {}
    initBookingForm();
    initPriceCalculation();
    initParticipantManagement();
}

// Инициализация формы бронирования
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBookingSubmit(this);
        });
        
        // Валидация в реальном времени
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

// Обработка отправки формы бронирования
function handleBookingSubmit(form) {
    if (validateForm(form)) {
        // Показываем индикатор загрузки
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Обработка...';
        submitBtn.disabled = true;
        
        // Имитация отправки
        setTimeout(() => {
            travelAgency.showNotification('Бронирование успешно оформлено! Мы свяжемся с вами в ближайшее время.', 'success');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Перенаправляем на страницу подтверждения
            setTimeout(() => {
                window.location.href = 'booking-confirmation.html';
            }, 2000);
        }, 3000);
    }
}

// Валидация формы
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Дополнительная валидация для участников
    const participants = form.querySelectorAll('.participant-item');
    participants.forEach((participant, index) => {
        const participantFields = participant.querySelectorAll('[required]');
        participantFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
    });
    
    return isValid;
}

// Валидация отдельного поля
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Убираем предыдущие ошибки
    removeFieldError(field);
    
    // Проверка на обязательность
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Это поле обязательно для заполнения';
    }
    
    // Специфичные проверки
    if (value && fieldName.includes('email')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Введите корректный email адрес';
        }
    }
    
    if (value && fieldName.includes('phone')) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Введите корректный номер телефона';
        }
    }
    
    if (value && fieldName.includes('passport')) {
        const passportRegex = /^[0-9]{4}\s[0-9]{6}$/;
        if (!passportRegex.test(value)) {
            isValid = false;
            errorMessage = 'Введите серию и номер паспорта в формате: 1234 567890';
        }
    }
    
    if (value && fieldName.includes('birthDate')) {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 0 || age > 120) {
            isValid = false;
            errorMessage = 'Введите корректную дату рождения';
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

// Инициализация расчета цены
function initPriceCalculation() {
    const serviceCheckboxes = document.querySelectorAll('input[name="services[]"]');
    const additionalServicesElement = document.getElementById('additionalServices');
    const totalPriceElement = document.getElementById('totalPrice');
    const summaryTitleEl = document.querySelector('.booking-summary .tour-details h4');
    const basePriceParam = parseInt(new URLSearchParams(window.location.search).get('price') || '70000', 10);
    let basePrice = isNaN(basePriceParam) ? 70000 : basePriceParam; // Базовая цена тура
    
    function updatePrice() {
        let additionalPrice = 0;
        
        serviceCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const priceText = checkbox.parentNode.querySelector('.service-price').textContent;
                const price = parseInt(priceText.replace(/[^\d]/g, ''));
                additionalPrice += price;
            }
        });
        
        const totalPrice = basePrice + additionalPrice;
        
        if (additionalServicesElement) {
            additionalServicesElement.textContent = additionalPrice.toLocaleString('ru-RU') + ' ₽';
        }
        
        if (totalPriceElement) {
            totalPriceElement.textContent = totalPrice.toLocaleString('ru-RU') + ' ₽';
        }
    }
    
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updatePrice);
    });
    
    // Инициализируем цену при загрузке
    updatePrice();
}

// Prefill summary and image from URL params
function prefillFromParams() {
    const params = new URLSearchParams(window.location.search);
    const title = params.get('title');
    const image = params.get('image');
    const price = params.get('price');
    const adults = params.get('adults') || '2';
    const children = params.get('children') || '0';

    const titleEl = document.querySelector('.booking-summary .tour-details h4');
    const imgEl = document.querySelector('.booking-summary .tour-image');
    const baseItemEl = document.querySelector('.price-breakdown .price-item span');
    const totalPriceEl = document.getElementById('totalPrice');

    if (title && titleEl) titleEl.textContent = title;
    if (imgEl) {
        if (image) {
            imgEl.src = image;
        } else {
            // дефолтная картинка, если открыли без карточки
            imgEl.src = '../images/130632-internet_radio-vecher-nebo-muzyka-zakat-1920x1080.jpg';
        }
    }
    if (baseItemEl) baseItemEl.textContent = `Тур (${adults} взрослых${children !== '0' ? `, ${children} детей` : ''})`;
    if (price && totalPriceEl) {
        const p = parseInt(price, 10);
        if (!isNaN(p)) totalPriceEl.textContent = p.toLocaleString('ru-RU') + ' ₽';
    }
}

// Prefill from saved profile (account)
function prefillFromProfile() {
    let user = null;
    try { user = localStorage.getItem('gt_current_user'); } catch(_) {}
    if (!user) return;
    let raw = null;
    try { raw = localStorage.getItem(`gt_profile_${user}`); } catch(_) {}
    if (!raw) return;
    const p = JSON.parse(raw);
    const set = (id, val) => { const el = document.getElementById(id); if (el && !el.value) el.value = val || ''; };
    set('firstName', p.firstName);
    set('lastName', p.lastName);
    set('middleName', p.middleName);
    set('birthDate', p.birthDate);
    set('phone', p.phone);
    set('email', p.email);
    // also mirror to main participant if present
    autoFillMainParticipant();
}

// Инициализация управления участниками
function initParticipantManagement() {
    // Функция уже определена глобально в HTML
    if (typeof addParticipant === 'undefined') {
        window.addParticipant = addParticipant;
    }
}

// Добавить участника
function addParticipant() {
    const container = document.getElementById('participantsContainer');
    const participantCount = container.querySelectorAll('.participant-item').length;
    const newIndex = participantCount;
    
    const participantItem = document.createElement('div');
    participantItem.className = 'participant-item';
    participantItem.innerHTML = `
        <h4>Участник ${newIndex + 1}</h4>
        <div class="form-row">
            <div class="form-group">
                <label>Фамилия *</label>
                <input type="text" name="participant[${newIndex}][lastName]" class="form-input" required>
            </div>
            <div class="form-group">
                <label>Имя *</label>
                <input type="text" name="participant[${newIndex}][firstName]" class="form-input" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Отчество</label>
                <input type="text" name="participant[${newIndex}][middleName]" class="form-input">
            </div>
            <div class="form-group">
                <label>Дата рождения *</label>
                <input type="date" name="participant[${newIndex}][birthDate]" class="form-input" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Пол *</label>
                <select name="participant[${newIndex}][gender]" class="form-select" required>
                    <option value="">Выберите</option>
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                </select>
            </div>
            <div class="form-group">
                <label>Серия и номер паспорта *</label>
                <input type="text" name="participant[${newIndex}][passport]" class="form-input" required>
            </div>
        </div>
        <button type="button" class="participant-remove" onclick="removeParticipant(this)">Удалить участника</button>
    `;
    
    container.appendChild(participantItem);
    
    // Анимация появления
    setTimeout(() => {
        participantItem.classList.add('animate-in');
    }, 100);
    
    // Добавляем валидацию для новых полей
    const newInputs = participantItem.querySelectorAll('input, select');
    newInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// Удалить участника
function removeParticipant(button) {
    const participantItem = button.closest('.participant-item');
    const container = document.getElementById('participantsContainer');
    const items = Array.from(container.querySelectorAll('.participant-item'));
    const isMain = items.indexOf(participantItem) === 0;
    if (isMain) {
        // Не позволяем удалять основного заявителя
        try { travelAgency.showNotification('Нельзя удалить основного заявителя', 'info'); } catch(_) {}
        return;
    }

    participantItem.classList.add('animate-out');
    setTimeout(() => {
        participantItem.remove();
        reindexParticipants(container);
        updateParticipantNumbers();
    }, 300);
}

// Обновить номера участников
function updateParticipantNumbers() {
    const participants = document.querySelectorAll('.participant-item');
    participants.forEach((participant, index) => {
        const title = participant.querySelector('h4');
        if (title) {
            title.textContent = `Участник ${index + 1}`;
        }
    });
}

// Обновляем индексы name у полей участников после удаления
function reindexParticipants(container) {
    const participants = Array.from(container.querySelectorAll('.participant-item'));
    participants.forEach((participant, idx) => {
        const inputs = participant.querySelectorAll('input, select');
        inputs.forEach(el => {
            const name = el.getAttribute('name');
            if (!name) return;
            const updated = name.replace(/participant\[[0-9]+\]/, `participant[${idx}]`);
            el.setAttribute('name', updated);
        });
    });
}

// Автозаполнение данных основного заявителя
function autoFillMainParticipant() {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const middleName = document.getElementById('middleName');
    const birthDate = document.getElementById('birthDate');
    // try to also pull passport from saved profile
    let savedPassport = '';
    try {
        const user = localStorage.getItem('gt_current_user');
        if (user) {
            const raw = localStorage.getItem(`gt_profile_${user}`);
            if (raw) savedPassport = (JSON.parse(raw).passport) || '';
        }
    } catch(_) {}
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    
    const mainParticipant = document.querySelector('.participant-item');
    if (mainParticipant) {
        const participantFirstName = mainParticipant.querySelector('input[name*="[firstName]"]');
        const participantLastName = mainParticipant.querySelector('input[name*="[lastName]"]');
        const participantMiddleName = mainParticipant.querySelector('input[name*="[middleName]"]');
        const participantBirthDate = mainParticipant.querySelector('input[name*="[birthDate]"]');
        const participantPassport = mainParticipant.querySelector('input[name*="[passport]"]');
        
        if (firstName && participantFirstName) {
            participantFirstName.value = firstName.value;
        }
        if (lastName && participantLastName) {
            participantLastName.value = lastName.value;
        }
        if (middleName && participantMiddleName) {
            participantMiddleName.value = middleName.value;
        }
        if (birthDate && participantBirthDate) {
            participantBirthDate.value = birthDate.value;
        }
        if (participantPassport && savedPassport) {
            participantPassport.value = savedPassport;
        }
    }
}

// Отменить бронирование
function cancelBooking() {
    if (confirm('Вы уверены, что хотите отменить бронирование? Все введенные данные будут потеряны.')) {
        // Очищаем форму
        const form = document.getElementById('bookingForm');
        if (form) {
            form.reset();
        }

        // Скрываем сводку бронирования
        const summary = document.querySelector('.booking-summary');
        if (summary) {
            summary.style.display = 'none';
        }
        
        // Показываем уведомление
        if (typeof travelAgency !== 'undefined' && travelAgency.showNotification) {
            travelAgency.showNotification('Бронирование отменено. Данные очищены.', 'info');
        }
        
        // Возвращаемся на главную страницу через 1.5 секунды
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
    }
}

// Делаем функцию глобальной
window.cancelBooking = cancelBooking;



