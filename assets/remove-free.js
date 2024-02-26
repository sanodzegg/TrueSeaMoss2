// This function asynchronously fetches the cart items from the server.
const fetchCartItems = async () => {
    const res = await fetch("/cart.js");
    const cartItems = await res.json();
    return cartItems.items;
};

// Selects the element and parses the JSON variant list from the product list.
const cartFoot = document.querySelector(".cart-drawer__foot.cart__foot");
const jsonProduct = JSON.parse(document.querySelector("#gift__products").innerHTML);
const jsonVariantList = JSON.parse(document.querySelector("#product-list_variant").innerHTML);
// Removes empty field variants from the variant list.
const removeEmptyField = jsonProduct.filter((el) => el.free !== "");
const removeEmptyFieldVariantList = jsonVariantList.filter((el) => el.free !== "");
const allJson = [...removeEmptyField, ...removeEmptyFieldVariantList];


// Checks if the given cart item contains a main ID from the variant list.
function checkInCart(cartItem) {
    let isCartMainId = false
    for (const obj of allJson) {
        isCartMainId = cartItem.some((item) => Number(item.product_id) === Number(obj.main) && item.hasOwnProperty("selling_plan_allocation"));
        if (isCartMainId) break;
    }
    return isCartMainId
}

// Checks the quantity of free products and updates the cart if needed.
function checkQuantityAndDelete(cartItem) {
    const updateDataFreeProduct = {};
    const freeProducts = cartItem.filter(el => el.price == 0);
    freeProducts.forEach(element => {
        const { quantity, id } = element;
        if (quantity >= 2) {
            updateDataFreeProduct[id] = 1;
        }
    });
    if (Object.keys(updateDataFreeProduct).length != 0) {
        const dataUpdateForm = {
            updates: updateDataFreeProduct
        };
        fetch(window.Shopify.routes.root + 'cart/update.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataUpdateForm)
        }).then((res) => {
            console.log("update free products");
            console.log(res);
            return res
        }).then( (res) => {
            console.log(res.json());
        }).catch((error) => {
            console.log(error);
        })
    }
}


// Event handler function for the 'cart:remove' event.
const deleteFreeProduct = async (event) => {
    const items = event.detail ? event.detail.cartJson.items : await fetchCartItems();
    checkQuantityAndDelete(items)
    let variantListSelector;
    let render;
    if (!checkInCart(items)) {
        for (const obj of removeEmptyFieldVariantList) {
            const selector = `[data-main='${obj.free}']`;
            variantListSelector = document.querySelector(selector);
            if (variantListSelector) break;
        }
    }


    if (variantListSelector) {
        const el = variantListSelector;
        if (cartFoot) {
            cartFoot.classList.add("is-disabled");
        }
        const removeData = {
            id: el.getAttribute("data-id-item"),
            quantity: 0,
        };

        // Fetch to update the cart by removing the specified product.
        await fetch(theme.routes.root + 'cart/change.js', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(removeData),
        })
            .then(res => {
                if (res.status === 200) {
                    document.dispatchEvent(new CustomEvent('cart:update_remove', { bubbles: true }));

                }
            });
    }
};

// Event listener for the 'cart:remove' event, triggering the deleteFreeProduct function.
document.addEventListener('cart:remove', deleteFreeProduct);
