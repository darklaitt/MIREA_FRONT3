const express = require('express');
const app = express();
const PORT = 3000;

// Middleware для статических файлов (HTML, CSS)
app.use(express.static('../frontend'));

// Загрузка данных из JSON-файла
const products = require('./products.json');

// Маршрут для получения списка товаров
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Catalog server is running on http://localhost:${PORT}`);
});