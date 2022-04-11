const products = [
    { id: 1, title: 'Notebook', price: 2000 },
    { id: 2, title: 'Mouse', price: 20 },
    { id: 3, title: 'Keyboard', price: 200 },
    { id: 4, title: 'Gamepad', price: 50 },
];
//Функция для формирования верстки каждого товара
//Добавить в выводе изображение
const renderProduct = (item, img = "http://dummyimage.com/120") =>
    `<div class="product-item">
                <h3>${item.title}</h3>
                <img src="${img}" />
                <p>${item.price}</p>
                <button class="buy-btn">Купить</button>
            </div>`;

const renderPage = list => document.querySelector('.products').innerHTML = list.map(item => renderProduct(item)).join('');


renderPage(products);