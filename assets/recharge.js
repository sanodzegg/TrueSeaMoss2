document.addEventListener("DOMContentLoaded", function () {
  const idProduct = document.querySelector(".recharge-content").getAttribute("data-id-product");
  const valueDiscount = document.querySelector(".selling_plan-price .radio__price").getAttribute("data-discount-value");
  const inputForm = document.querySelector("form.product__form [data-product-select]");
  const jsonPrice = JSON.parse(document.querySelector("#widget_price").innerHTML);
  const freeInput = document.querySelector(".free-input");
  const labelBadge = document.querySelectorAll(".label-badge");

  const fetchCartItem = async () => {
    const res = await fetch("/cart.js");
    const cartItems = await res.json();
    return cartItems.items;
  };

  const getCartItems = async () => {
    if (!freeInput) return;
    const mainId = idProduct;
    const items = await fetchCartItem();
    const handleMain = "Main " + String(freeInput.dataset.handle).toLocaleLowerCase();
    const isCart = items.some(item => Number(item.variant_id) === Number(mainId));
    freeInput.setAttribute("data-quantity", isCart ? 0 : 1);
  };

  document.addEventListener('cart:free', getCartItems);

  const findWidget = setInterval(checkWidget, 10);
  function checkWidget() {
    if (document.querySelector(".rc-widget")) {
      clearInterval(findWidget)
      const subscriptionRadio = document.querySelector(".subscription-radio input");
      const onetimeRadio = document.querySelector(".onetime-radio input");
      const contentSubscription = document.querySelector(".recharge-product-widget__delivery-subscribe");
      const contentOnetime = document.querySelector(".recharge-product-widget__delivery-purchase");
      const buttonSellingPlan = document.querySelector(".subscription-radio");

      subscriptionRadio.addEventListener("change", function () {
        changePrice();
        toggleContent(contentSubscription, contentOnetime, idProduct);
      })
      onetimeRadio.addEventListener("change", function () {
        changePrice();
        toggleContent(contentOnetime, contentSubscription, '');
      })

      function toggleContent(showContent, hideContent, value) {
        showContent.style.display = "flex";
        hideContent.style.display = "none";
        if (freeInput) {
          freeInput.value = value;
        }
      }

      inputForm.addEventListener("change", changePrice);
      function changePrice() {
        if (!buttonSellingPlan) return;
        setTimeout(() => {
          const selectors = {
            widgetCompare: ".selling_plan-price_origin",
            widgetOrigin: ".radio__price .first-discount",
            onlyRegular: ".only_price [data-product-price]",
            onlyCompare: ".only_price [data-compare-price]",
            badgeRegular: ".product__price-save [data-product-price]",
            badgeCompare: ".product__price-save [data-compare-price]",
            badgeSave: ".product__price-and-badge .product__price-save_badge",
            badgeSaveContainer: ".product__price-save_badge",
            compare: "#compare_price",
            regular: "#regular_price",
            discount: "#discount_price",
            save: "#save_price"
          }
          const activeDiscount = buttonSellingPlan.classList.contains("rc-radio--active");
          const currentIdVariant = Number(inputForm.value);
          const currentObjVariant = jsonPrice.filter(el => Number(el.id) === currentIdVariant)[0];
          const { priceRegular, priceCompare, variantName } = currentObjVariant;
          const priceDiscount = (priceRegular - (priceRegular * (Number(valueDiscount) / 100))).toFixed(0);
          const priceDiscountCompare = (priceCompare - (priceCompare * (Number(valueDiscount) / 100))).toFixed(0);

          // Price without discount
          const correctPriceRegular = getCorrectPrice(priceRegular);
          const correctPriceCompare = getCorrectPrice(priceCompare);
          const correctPriceSave = (correctPriceCompare - correctPriceRegular).toFixed(2);
          // Price with discount
          const correctPriceDiscount = getCorrectPrice(priceDiscount);
          const correctPriceDiscountCompare = getCorrectPrice(priceDiscountCompare);
          const correctPriceDiscountSave = (correctPriceDiscountCompare - correctPriceDiscount).toFixed(2);
          // Price save
          const correctSavePice = (correctPriceCompare - correctPriceDiscount).toFixed(2);

          if (activeDiscount) {
            changePriceHtml(correctPriceCompare, selectors.widgetCompare);
            changePriceHtml(correctPriceDiscount, selectors.widgetOrigin);
            changePriceHtml(correctPriceCompare, selectors.onlyCompare);
            changePriceHtml(correctPriceDiscount, selectors.onlyRegular)

            changePriceHtml(correctPriceCompare, selectors.badgeCompare);
            changePriceHtml(correctPriceDiscount, selectors.badgeRegular);
            changePriceHtml(correctSavePice, selectors.badgeSave);

            hidePrice(correctPriceCompare,correctPriceDiscount,selectors.badgeCompare,selectors.badgeSaveContainer,variantName)

            changePriceBadge(true)
            // disabledFreeProduct(variantName,true)

          } else {
            changePriceHtml(correctPriceCompare, selectors.onlyCompare);
            changePriceHtml(correctPriceRegular, selectors.onlyRegular)

            changePriceHtml(correctPriceCompare, selectors.badgeCompare);
            changePriceHtml(correctPriceRegular, selectors.badgeRegular);
            changePriceHtml(correctPriceSave, selectors.badgeSave);

            changePriceHtml(correctPriceRegular, selectors.compare);
            changePriceHtml(correctPriceCompare, selectors.regular);

            changePriceHtml(correctPriceDiscount, selectors.discount);
            changePriceHtml(correctSavePice, selectors.save);

            hidePrice(correctPriceCompare,correctPriceRegular,selectors.badgeCompare,selectors.badgeSaveContainer,variantName)
            changePriceBadge(false)
            // disabledFreeProduct(variantName,false)
          }

        }, 0);

      }
      changePrice();
    }
  }

  function hidePrice(priceCompare, priceOrigin, elementCompare, elementBadge, nameVariant) {
      const flag = priceCompare !== priceOrigin;
      document.querySelector(elementCompare).style.opacity = flag ? "1" : "0";
      document.querySelector(elementBadge).style.opacity = flag ? "1" : "0";

      // document.querySelector(elementCompare).classList.toggle("hidden",String(nameVariant).includes("1 pack"));
      // document.querySelector(elementBadge).classList.toggle("hidden",String(nameVariant).includes("1 pack"));

  }

  function getCorrectPrice(str) {
    return (Number(str) / 100).toFixed(2);
  }
  function changePriceHtml(newDigit, element) {
    let container = document.querySelector(element);
    if (!container) return;
    let regex = /\d+(\.\d+)?/g;
    container.innerHTML = container.innerHTML.replace(regex, newDigit);
  }

  function changePriceBadge(flag) {
    if (labelBadge.length === 0) return;
    labelBadge.forEach( (label) => {
      const priceWithDiscount = label.dataset.discount;
      const priceWithoutDiscount = label.dataset.price;
      const target = label.querySelector("span");
      if (priceWithDiscount && priceWithoutDiscount && target ) {
        target.textContent = flag ? priceWithDiscount : priceWithoutDiscount
      }
    })
  }

  function disabledFreeProduct(nameVariant,flag) {
    let isFreeProduct;
    let isIncludes = String(nameVariant).includes("1 pack");
    document.querySelector(".recharge-product-free").classList.toggle("_hide", isIncludes);
    if (isIncludes === false && flag === true) {
      isFreeProduct = idProduct;
    } else {
      isFreeProduct = "";
    }
    freeInput.value = isFreeProduct;
  }

})
