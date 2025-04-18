Запуск на локальном:
* создаем пустой файл /server/.env.local
В текущей директории
* docker compose up -d
* смотрим в логи сервера: `docker compose logs server | grep SUPERADMIN`
* копируем токен и заходим на http://localhost:5002/main?token= добавив токен в конец URL
* в консоли пишем authStore.seedAll()
* дожидаемся появления данных
