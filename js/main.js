const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class List {
    constructor(container, path) {
        this.container = container;
        this.goods = [];
        this.allProducts = [];
        this.path = path;
        this.filtered = []; // отфильтрованные товары
        this._init();
        this._getProducts()
            .then(data => {
                this._parseData(data);
                this.render();
            })
            .catch(error => {
                console.log(error);

            });

    }
    _getProducts(url) {
        return fetch(url ? url : `${API}/${this.path}`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            })
    }
    _parseData(data) {
        this.goods = [...data];
    }
    filter(value) {
        const regexp = new RegExp(value, 'i');
        this.filtered = this.allProducts.filter(product => regexp.test(product.title));
        this.allProducts.forEach(el => {
            const block = document.querySelector(`.product-item[data-id="${el.id}"]`);
            if (!this.filtered.includes(el)) {
                block.classList.add('invisible');
            } else {
                block.classList.remove('invisible');
            }
        })
    }
    render() {}
    _init() {
        return false;
    }
}

class ProductList extends List {
    constructor(cart, container = '.products', path = 'catalogData.json') {
        super(container, path);
        this.cart = cart;


    }
    _init() {
        document.querySelector('.search-form').addEventListener('submit', e => {
            e.preventDefault();
            this.filter(document.querySelector('.search-field').value);
        })
    }
    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const item = new ProductItem(product);
            this.allProducts.push(item);
            block.insertAdjacentHTML("beforeend", item.render());
            block.querySelector(`[data-id='${item.id}']`).addEventListener("click", (evt) => {
                if (evt.target.nodeName != "BUTTON") {
                    return;
                }
                this.cart.addItem(item);
            });

        }
    }
}
class CartList extends List {
    constructor(container = '.cart-block', path = 'getBasket.json') {
        super(container, path);
        this._onCartBtnClick();

    }
    addItem(item) {
        this._getProducts(`${API}/addToBasket.json`).then(data => {
            if (data.result === 1) {
                let find = this.allProducts.find(product => product.id === item.id);
                if (find) {
                    find.quantity++;
                    this._updateCart(find);
                } else {
                    let product = {
                        id_product: item.id,
                        price: +item.price,
                        product_name: item.title,
                        quantity: 1
                    };
                    this.goods = [product];
                    this.render();
                }
            } else {
                alert('Error');
            }
        });
    }
    deleteItem(item) {
        this._getProducts(`${API}/deleteFromBasket.json`)
            .then(data => {
                if (data.result === 1) {
                    let find = this.allProducts.find(product => product.id === item.id);
                    if (find.quantity > 1) { // если товара > 1, то уменьшаем количество на 1
                        find.quantity--;
                        this._updateCart(find);
                    } else { // удаляем
                        this.allProducts.splice(this.allProducts.indexOf(find), 1);
                        document.querySelector(`.cart-item[data-id="${item.id}"]`).remove();
                    }
                } else {
                    alert('Error');
                }
            })
    }

    _onCartBtnClick() {
        document.querySelector(".btn-cart").addEventListener("click", () => {
            document.querySelector(this.container).classList.toggle("invisible");

        });
    }
    _updateCart(product) {
        let block = document.querySelector(`.cart-item[data-id="${product.id}"]`);
        block.querySelector('.product-quantity').textContent = `Quantity: ${product.quantity}`;
        block.querySelector('.product-price').textContent = `$${product.quantity*product.price}`;
    }
    _parseData(data) {
        this.goods = [...data.contents];
        this.amount = data.amount;
        this.countGoods = data.countGoods;
    }
    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const item = new CartItem(product);
            this.allProducts.push(item);
            block.insertAdjacentHTML("beforeend", item.render());
            block.querySelector(`[data-id='${item.id}']`).addEventListener("click", (evt) => {
                if (evt.target.nodeName != "BUTTON") {
                    return;
                }
                this.deleteItem(item);
            });
        }
    }


}
class Item {
    constructor(product, img) {
        this.title = product.product_name;
        this.id = product.id_product;
        this.price = product.price;
        this.img = img;
    }
}

class ProductItem extends Item {
    constructor(product, img = 'https://via.placeholder.com/200x150') {
        super(product, img);
    }
    render() {

        return `<div class="product-item" data-id="${this.id}">
                <img src="${this.img}">
                <h3>${this.title}</h3>
                <p>${this.price}</p>
                <button class="buy-btn">Купить</button>
            </div>`
    }
}


class CartItem extends Item {
    constructor(product, img = 'https://via.placeholder.com/100x75') {
        super(product, img);
        this.quantity = product.quantity;
    }
    render() {

        return `<div class="cart-item" data-id="${this.id}">
        <div class="product-bio">
        <img src="${this.img}" alt="Some image">
        <div class="product-desc">
        <p class="product-title">${this.title}</p>
        <p class="product-quantity">Quantity: ${this.quantity}</p>
    <p class="product-single-price">$${this.price} each</p>
    </div>
    </div>
    <div class="right-block">
        <p class="product-price">$${this.price}</p>
        <button class="del-btn" data-id="${this.id}">×</button>
    </div>
    </div>`
    }
}

let cart = new CartList();
let list = new ProductList(cart);