const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class List {
    constructor(container, path) {
        this.container = container;
        this.goods = [];
        this.allProducts = [];
        this.path = path;


        // this._fetchProducts(); //рекомендация, чтобы метод был вызван в текущем классе
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
    render() {}
}

class ProductList extends List {
    constructor(cart, container = '.products', path = 'catalogData.json') {
        super(container, path);
        this.cart = cart;


    }
    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const item = new ProductItem(product);
            block.insertAdjacentHTML("beforeend", item.render());
            block.querySelector(`[data-id='${item.id}']`).addEventListener("click", (evt) => {
                if (evt.target.nodeName != "BUTTON") {
                    return;
                }
                this.cart.addItem(item);
            });

            //           block.innerHTML += item.render();
        }
    }
}
class CartList extends List {
    constructor(container = '.cart-block', path = 'getBasket.json') {
        super(container, path);
        this._calcSumm();
        this._onCartBtnClick();
        // this.amount = product.amount;
        // this.countGoods = product.countGoods;

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
    _calcSumm() {
        // подсчет итоговой стоимости товара
    }
    _calcTotalQuantity() {
        //подсчет общего количества товаров в корзине
    }

    clearCart() {
        //очищение корзины
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
        // this.quantity = product.quantity;
    }
}

class ProductItem extends Item {
    constructor(product, img = 'https://via.placeholder.com/200x150') {
        super(product, img);
        // clicToItem();
        // this.quantity = product.quantity;
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
    _changeSumm() {
        // пересчет суммы за товар
    }
    _changeQuantity() {
        //изменение количества
    }
}

let cart = new CartList();
let list = new ProductList(cart);