class ProductList {
    constructor(container = '.products') {
        this.container = container;
        this.goods = [];
        this._fetchProducts(); //рекомендация, чтобы метод был вызван в текущем классе
        this.render(); //вывод товаров на страницу
    }
    _fetchProducts() {
        this.goods = [
            { id: 1, title: 'Notebook', price: 2000 },
            { id: 2, title: 'Mouse', price: 20 },
            { id: 3, title: 'Keyboard', price: 200 },
            { id: 4, title: 'Gamepad', price: 50 },
        ];
    }

    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const item = new ProductItem(product);
            block.insertAdjacentHTML("beforeend", item.render());
            //           block.innerHTML += item.render();
        }
    }
}

class ProductItem {
    constructor(product, img = 'https://via.placeholder.com/200x150') {
        this.title = product.title;
        this.id = product.id;
        this.price = product.price;
        this.img = img;
    }
    addToCart() {

    }
    render() {
        return `<div class="product-item">
                <img src="${this.img}">
                <h3>${this.title}</h3>
                <p>${this.price}</p>
                <button class="buy-btn">Купить</button>
            </div>`
    }
}

class CartList extends ProductList {
    constructor(container = '.products') {
        super(container);
        this._calcSumm();
    }
    _fetchProducts() {
        this.goods = [
            { id: 1, title: 'Notebook', price: 2000, quantity: 1 },
            { id: 2, title: 'Mouse', price: 20, quantity: 1 },
            { id: 3, title: 'Keyboard', price: 200, quantity: 1 },
            { id: 4, title: 'Gamepad', price: 50, quantity: 2 },
        ];
    };
    _calcSumm() {
        // подсчет итоговой стоимости товара
    }
    _calcTotalQuantity() {
        //подсчет общего количества товаров в корзине
    }

    removeFromCart(id) {
        //удаление одного товара из корзины по id
    }
    clearCart() {
        //очищение корзины
    }



}
class CartItem extends ProductItem {
    constructor(product, img = 'https://via.placeholder.com/200x150', quantity = 1) {
        super(product, img);
        this.quantity = quantity;

    }
    render() {
        // верстка элемента
    }
    _changeSumm() {
        // пересчет суммы за товар
    }
    _changeQuantity() {
        //изменение количества
    }
}
let list = new ProductList();