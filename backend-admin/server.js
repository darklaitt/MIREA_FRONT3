const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 8080;
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger документация
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Management API',
            version: '1.0.0',
            description: 'API для управления задачами',
        },
        servers: [
            {
                url: 'http://localhost:8080',
            },
        ],
    },
    apis: ['./server.js'], // Укажите путь к файлам с аннотациями
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Middleware для парсинга JSON
app.use(bodyParser.json());

// Загрузка данных из JSON-файла
let products = [];
const productsFilePath = './products.json';

function loadProducts() {
    if (fs.existsSync(productsFilePath)) {
        const data = fs.readFileSync(productsFilePath, 'utf8');
        products = JSON.parse(data);
    }
}

function saveProducts() {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
}

// Загружаем товары при запуске сервера
loadProducts();

// Получить список товаров
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Добавить новый товар
app.post('/api/products', (req, res) => {
    const { name, price, description, category } = req.body;
    const newProduct = {
        id: products.length + 1,
        name,
        price,
        description,
        category
    };
    products.push(newProduct);
    saveProducts(); // Сохраняем изменения в файл
    res.status(201).json(newProduct);
});

// Редактировать товар по ID
app.put('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
        const { name, price, description, category } = req.body;
        product.name = name !== undefined ? name : product.name;
        product.price = price !== undefined ? price : product.price;
        product.description = description !== undefined ? description : product.description;
        product.category = category !== undefined ? category : product.category;
        saveProducts(); // Сохраняем изменения в файл
        res.json(product);
    } else {
        res.status(404).json({ message: 'Товар не найден' });
    }
});

// Удалить товар по ID
app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    products = products.filter(p => p.id !== productId);
    saveProducts(); // Сохраняем изменения в файл
    res.status(204).send();
});


/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список товаров
 *     description: Возвращает список всех товаров.
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
    res.json(products);
});


// Запуск сервера
app.listen(PORT, () => {
    console.log(`Admin server is running on http://localhost:${PORT}`);
});