const fetchCartItems = async () => {
    const res = await fetch("/cart.js");
    const cartItems = await res.json();
    console.log(cartItems);
    return cartItems.items;
};

const cartFoot = document.querySelector(".cart-drawer__foot.cart__foot");
const jsonProduct = JSON.parse(document.querySelector("#gift__products").innerHTML);
const jsonVariant = JSON.parse(document.querySelector("#gift__products_variant").innerHTML);
const removeEmptyField = jsonProduct.filter((el) => el.free !== "");
const removeEmptyFieldVariant = jsonVariant.filter((el) => el.free !== "");
// const allJson = [...removeEmptyField, ...removeEmptyFieldVariant];

const deleteFreeProduct = async (event) => {
    const items = event.detail ? event.detail.cartJson.items : await fetchCartItems();
    let variantSelector;
    let productSelector;

    for (const obj of removeEmptyFieldVariant) {
        
        const isCartVariantId = items.some((item) => Number(item.id) === Number(obj.variant));
        console.log("isCartVariantId"+isCartVariantId);
        if (!isCartVariantId) {
            const selector = `[data-main='${obj.free}']`;
            variantSelector = document.querySelector(selector);
            if (variantSelector) {
                break;
            }
        }
    }

    for (const obj of removeEmptyField) {
       //const  isCartMainId = cartItem.some((item) => Number(item.product_id) === Number(obj.main) && item.hasOwnProperty("selling_plan_allocation"));
          const isCartMainId = items.some((item) => item.hasOwnProperty("selling_plan_allocation"));
        console.log("isCartMainId"+isCartMainId);
        if (!isCartMainId) {
            const selector = `[data-selector='Free${obj.handle}']`;
            productSelector = document.querySelector(selector);
            if (productSelector) {
                break;
            }
        }
    }
    console.log("variantSelector "+variantSelector);
     console.log("productSelector "+productSelector);
    if (variantSelector || productSelector) {
        const el = variantSelector || productSelector;
        const removeData = {
            id: el.querySelector(".cart__item__remove").getAttribute("data-id"),
            quantity: 0,
        };

        await fetch(theme.routes.root + 'cart/change.js', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(removeData),
        }) 
        .then(res =>{
            if (res.status === 200) {
                document.dispatchEvent(new CustomEvent('cart:update_remove', { bubbles: true }));
            }
        });
    }
};

document.addEventListener('cart:remove', deleteFreeProduct);


//  new code
// const fetchCartItems = async () => {
//     const res = await fetch("/cart.js");
//     const cartItems = await res.json();
//     return cartItems.items;
// };

// const cartFoot = document.querySelector(".cart-drawer__foot.cart__foot");
// const jsonVariantList = JSON.parse(document.querySelector("#product-list_variant").innerHTML);
// const removeEmptyFieldVariantList = jsonVariantList.filter((el) => el.free !== "");

// function checkInCart (cartItem) {
//     let isCartMainId = false
//     for (const obj of removeEmptyFieldVariantList) {
//         isCartMainId = cartItem.some((item) => Number(item.product_id) === Number(obj.main) && item.hasOwnProperty("selling_plan_allocation"));
//         if (isCartMainId) break;
//     }
//     return isCartMainId

// } 

// const deleteFreeProduct = async (event) => {
//     const items = event.detail ? event.detail.cartJson.items : await fetchCartItems();
//     let variantListSelector;
//     let render;
//     if (!checkInCart(items)) {
//         for (const obj of removeEmptyFieldVariantList) {
//             const selector = `[data-main='${obj.free}']`;
//             variantListSelector = document.querySelector(selector);
//             if (variantListSelector) break;
//         }
//     }


//     if (variantListSelector) {
//         const el = variantListSelector;
//         if (cartFoot) {
//             cartFoot.classList.add("is-disabled");
//         }
//         const removeData = {
//             id: el.querySelector(".cart__item__remove").getAttribute("data-id"),
//             quantity: 0,
//         };

//         await fetch(theme.routes.root + 'cart/change.js', {
//             method: 'post',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(removeData),
//         }) 
//         .then(res =>{
//             if (res.status === 200) {
//                 render = true
//             }
//         });
//     }

//     if (render) {
//         document.dispatchEvent(new CustomEvent('cart:update_remove', { bubbles: true }));
//     }
// };

// document.addEventListener('cart:remove', deleteFreeProduct);

