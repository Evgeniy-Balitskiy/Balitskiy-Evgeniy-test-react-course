var theme = theme || {};

function addProduct() {
    let selectors = {
        productWrapper: '.product-box__item',
        productTitle: '.product-box__title',
        productImg: '.product-box__img .img-fluid',
        productMeta: '.product-box__meta',
        productAddButton: '.product-box__btn'
    }

    if(document.querySelector(selectors.productAddButton)) {
        let addButton = document.querySelectorAll(selectors.productAddButton);

        addButton.forEach(function(el){
            el.addEventListener('click', function() {
                let element = this;
                let thisProd = element.closest(selectors.productWrapper),
                    thisTitle = thisProd.querySelector(selectors.productTitle).innerText,
                    thisImg = thisProd.querySelector(selectors.productImg).src,
                    thisPrice = getPrice(thisProd.querySelector(selectors.productMeta).querySelector('p').innerText),
                    thisId = thisProd.getAttribute('data-product-id'),
                    thisQTY = thisProd.querySelector(selectors.productMeta).querySelector('.qty__item').value;
                
                cartProducts = localStorage.getItem('products');
                if (cartProducts != null || cartProducts != undefined) {
                    let fullCart = cartProducts;
                    if (isProductExist(thisId)) {
                        fullCart = updateProduct(thisId, thisQTY);
                    } else {
                        fullCart = fullCart + '###' + 'id:'+thisId+',qty:'+thisQTY;
                    }
                    localStorage.setItem('products', fullCart);
                } else {
                    localStorage.setItem('products', ['id:'+thisId+',qty:'+thisQTY]);
                }

                updateCartLine()
            });
        });
    }
}

function isProductExist(newId) {
    let cartProducts = localStorage.getItem('products');
    
    if (cartProducts != null || cartProducts != undefined) {
        if (cartProducts.includes('id:' + newId)) {
            return true;
        } else {
            return false;
        }
    }
}

function updateProduct(productId, productQty) {
    let cartProducts = localStorage.getItem('products');
    if (cartProducts != null || cartProducts != undefined) {
        let oldQty = cartProducts.split('id:' + productId + ',qty:')[1].split('###')[0],
            newQty = (productQty - 0) + (oldQty - 0);
        
        var newstr = cartProducts.replace('id:'+productId+',qty:'+oldQty, 'id:'+productId+',qty:'+newQty);
        return newstr;
    } else {
        return cartProducts;
    }
}

function getPrice(str) {
	let x = parseInt(str.replace(/[^\d]/g, ''))
    return x;
}

function sortCategory() {
    let selectors = {
        categorySelect: '.category-control',
        productWrapper: '.product-box__item',
    }

    document.querySelector(selectors.categorySelect).addEventListener('change', function() {
        let element = this,
            selectedCategory = element.value;

        document.querySelectorAll(selectors.productWrapper).forEach(function(el) {
            let elCategory = el.getAttribute('data-category');

            if (selectedCategory == '0') {
                el.classList.remove('hidden')
            } else if (elCategory != selectedCategory) {
                el.classList.add('hidden')
            } else {
                el.classList.remove('hidden')
            }
        })
    })
}

function sortPrice() {
    let selectors = {
        categoryPrice: '.price-control',
        productPrice: '.product-box__meta p',
    }

    document.querySelector(selectors.categoryPrice).addEventListener('change', function() {
        let element = this,
            selectedPrice = element.value;

        document.querySelectorAll(selectors.productPrice).forEach(function(el) {
            let elPrice = getPrice(el.innerText);

            if (selectedPrice == '0') {
                el.closest('.product-box__item').classList.remove('price-hidden')
            } else if (elPrice > selectedPrice) {
                el.closest('.product-box__item').classList.add('price-hidden')
            } else {
                el.closest('.product-box__item').classList.remove('price-hidden')
            }
        })
    })
}

function updateCartLine() {

    let cartProducts = localStorage.getItem('products'),
        cartQtyAll = 0,
        cartPrice = 0;

    let selectors = {
        productPrice: '.product-box__meta p',
        cartLineQty: '#cart-line-qty',
        cartLinePrice: '#cart-line-price',
    }

    if (cartProducts != null || cartProducts != undefined) {
        let cartLength = cartProducts.split('###').length;

        cartProducts.split('###').forEach(function(product, index) {
            let prodQty = product.split('qty:')[1],
                prodId = product.split('id:')[1].split(',')[0],
                prodPrice = getPrice(document.querySelector('[data-product-id="'+prodId+'"]').querySelector(selectors.productPrice).innerText)

            cartPrice = cartPrice + (prodPrice*prodQty);
            cartQtyAll = cartQtyAll + (prodQty - 0);
            
            if ((cartLength - 1) == index) {
                document.querySelector(selectors.cartLineQty).innerText = cartQtyAll;
                document.querySelector(selectors.cartLinePrice).innerText = cartPrice;
                theme.cartQty = cartQtyAll;
                theme.cartPrice = cartPrice;
            }
        })
    } else {
        document.querySelector(selectors.cartLineQty).innerText = '0';
        document.querySelector(selectors.cartLinePrice).innerText = '0';
        theme.cartQty = 0;
        theme.cartPrice = 0;
    }
}

function removeStorrageData(name, callback) {
    localStorage.removeItem(name);

    if (typeof callback == 'function') {
        callback()
    }
}

function clearCart() {
    document.querySelector('#clear-cart').addEventListener('click', function() {
        removeStorrageData('products', updateCartLine)
    })
}

function createOrder() {
    let selectors = {
        ctaBtn: '#create-order',
        orderPopup: '#order-popup',
        closeOrderPopup: '#order-popup .close-popup',
        userName: '#user-name',
        userEmail: '#user-email',
        addedClass: 'show',
        orderForm: '.order-form'
    }

    document.querySelector(selectors.ctaBtn).addEventListener('click', function() {
        if (theme.cartQty > 0) {
            document.querySelector(selectors.orderPopup).classList.add(selectors.addedClass);
        } else {
            alert('🚨 Добавьте продукты!')
        }
    })

    document.querySelector(selectors.closeOrderPopup).addEventListener('click', function() {
        document.querySelector(selectors.orderPopup).classList.remove(selectors.addedClass);
    })

    document.querySelector(selectors.orderForm).addEventListener('submit', function(event) {
        event.preventDefault()
        let name = document.querySelector(selectors.userName).value,
            email = document.querySelector(selectors.userEmail).value;

        if (name.trim().length > 0 && email.trim().length > 0) {
            alert('🤩  Спасибо за заказ! Товаров: ' + theme.cartQty + ", на сумму: " + theme.cartPrice);
            removeStorrageData('products', updateCartLine);
            document.querySelector(selectors.orderPopup).classList.remove(selectors.addedClass);
        } else {
            alert('🚨 проверьте данные')
        }
    })
}


document.addEventListener('DOMContentLoaded', function () {
    addProduct()
    sortCategory()
    sortPrice()
    updateCartLine()
    clearCart()
    createOrder()
}, false);