$(document).ready(function () {
    $('#btn-login').click(function () {
        $('#loginModal').modal('show');
    });

    // Показать модальное окно регистрации
    $('#btn-register').click(function () {
        $('#registerModal').modal('show');
    });


    // Отправка данных формы регистрации
    $('#registerForm').submit(function (event) {
        event.preventDefault();

        // Получение данных из формы
        var fullname = $('#fullname').val();
        var email = $('#email').val();
        var password = $('#password').val();

        // Открытие или создание базы данных
        var request = window.indexedDB.open('SYNERGY_DB', 1);

        request.onerror = function (event) {
            console.log('Ошибка при открытии базы данных:', event.target.errorCode);
        };

        request.onupgradeneeded = function (event) {
            var db = event.target.result;

            // Создание объектного хранилища (таблицы) Users
            var objectStore = db.createObjectStore('Users', { keyPath: 'email' });

            // Создание индекса для поиска по полному имени пользователя
            objectStore.createIndex('fullname', 'fullname', { unique: false });
            // Создание индекса для поиска по email пользователя
            objectStore.createIndex('email', 'email', { unique: true });
        };

        request.onsuccess = function (event) {
            var db = event.target.result;

            // Транзакция базы данных для записи данных пользователя
            var transaction = db.transaction(['Users'], 'readwrite');
            var objectStore = transaction.objectStore('Users');

            // Данные для сохранения
            var userData = {
                fullname: fullname,
                email: email,
                password: password
            };

            // Добавление данных в объектное хранилище
            var addRequest = objectStore.add(userData);

            addRequest.onsuccess = function (event) {
                console.log('Данные успешно сохранены в IndexedDB.');
            };

            addRequest.onerror = function (event) {
                console.log('Ошибка при сохранении данных в IndexedDB:', event.target.errorCode);
            };

            transaction.oncomplete = function () {
                db.close();
            };
        };
    });

    // Отправка данных формы входа
    $('#loginForm').submit(function (event) {
        event.preventDefault();

        // Получение данных из формы
        var loginEmail = $('#loginEmail').val();
        var loginPassword = $('#loginPassword').val();

        // Открытие базы данных для проверки входа
        var request = window.indexedDB.open('SYNERGY_DB', 1);

        request.onerror = function (event) {
            console.log('Ошибка при открытии базы данных для входа:', event.target.errorCode);
        };

        request.onsuccess = function (event) {
            var db = event.target.result;

            // Транзакция базы данных для чтения
            var transaction = db.transaction(['Users'], 'readonly');
            var objectStore = transaction.objectStore('Users');

            // Поиск пользователя по email
            var getRequest = objectStore.get(loginEmail);

            getRequest.onsuccess = function (event) {
                var userData = event.target.result;

                if (userData) {
                    // Пользователь найден, проверка пароля
                    if (userData.password === loginPassword) {
                        console.log('Вход выполнен успешно.');

                        // Переход на страницу личного кабинета
                        window.location.href = './personal.html'; // Замените на вашу страницу личного кабинета

                        // Очистка полей формы входа (необязательно)
                        $('#loginEmail').val('');
                        $('#loginPassword').val('');
                        $('#loginModal').modal('hide'); // Закрыть модальное окно входа
                    } else {
                        alert('Неверный пароль. Попробуйте снова.');
                    }
                } else {
                    alert('Пользователь с таким email не зарегистрирован.');
                }
            };

            transaction.onerror = function (event) {
                console.log('Ошибка при поиске пользователя в IndexedDB:', event.target.errorCode);
            };

            transaction.oncomplete = function () {
                db.close();
            };
        };
    });
});