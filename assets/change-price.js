document.addEventListener("DOMContentLoaded", function () {
  const mainContainer = document.querySelector(".list_variants-wrapper");
  const buttonAddToCart = document.querySelector(".product__block-button_price .product__submit__add");
  const buttonAddToWrapper = document.querySelector(".product__block-button_price form");
  const idProduct = document.querySelector(".recharge-content").getAttribute("data-id-product");
  const freeInput = document.querySelector(".free-input");
  const inputFullPrice = document.querySelector("input[data-full-price]");
  const extraContent = document.querySelector(".extra-items-container");

  const priceOneAll = document.querySelectorAll(".variant_extra-price-one");
  const priceSubAll = document.querySelectorAll(".variant_extra-price-subscribe");

  const mainProductsValue = document.querySelectorAll(".variant_item:not(.variant_item-extra) [data-quantity]")
  const mainProducts = document.querySelectorAll(".variant_item:not(.variant_item-extra)")
  const extraProducts = document.querySelectorAll(".variant_item-extra")

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
  inputFullPrice.addEventListener("change", () => {
    changePrice();
    if (extraContent) {
      toggleExtraContent();
      disabledExtraContent(getQuantityMainProduct());
    }

  })


  const findWidget = setInterval(checkWidget, 10);
  function checkWidget() {
    if (document.querySelector(".rc-widget")) {
      clearInterval(findWidget)
      const subscriptionRadio = document.querySelector(".subscription-radio input");
      const onetimeRadio = document.querySelector(".onetime-radio input");
      const contentSubscription = document.querySelector(".recharge-product-widget__delivery-subscribe");
      const contentOnetime = document.querySelector(".recharge-product-widget__delivery-purchase");

      subscriptionRadio.addEventListener("change", function () {
        changePrice();
        toggleContent(contentSubscription, contentOnetime, idProduct);
        toggleExtraPrice()
      })
      onetimeRadio.addEventListener("change", function () {
        changePrice();
        toggleContent(contentOnetime, contentSubscription, '');
        toggleExtraPrice()
      })
      changePrice()
    }
  }

  function toggleExtraContent() {
    if (!extraContent) return;
    const isSelected = inputFullPrice.getAttribute("data-select-variant") === "false" ? false : true;
    extraContent.classList.toggle("show-content", isSelected);
    toggleExtraPrice()
  }

  function disabledExtraContent(quantity) {
    if (quantity >= 1) return;

    const initialPrice = Number(inputFullPrice.getAttribute("data-value")) / 100;  
    const initialPriceSub = Number(inputFullPrice.getAttribute("data-price-sub")) / 100;

    extraProducts.forEach((item) => {
      item.querySelector('[data-quantity]').value = 0;
      item.querySelector('[data-price]').value = 0;
      item.querySelector('[data-price-selling]').value = 0;

      item.querySelector('.variant_item-quantity').style.display = 'none';
      item.querySelector('.variant_item-button').style.display = 'flex';
    });

    inputFullPrice.setAttribute('data-select-variant', 'false');
    inputFullPrice.value = initialPrice.toFixed(2);
    inputFullPrice.setAttribute("data-value-sub",initialPriceSub.toFixed(2));
    extraContent.classList.remove('show-content');

    changePrice();
  }

  function toggleExtraPrice() {
    const isSubcribe = inputFullPrice.getAttribute("data-subscribe") === "false" ? false : true;
    priceOneAll.forEach(el => el.classList.toggle("hide-price", isSubcribe))
    priceSubAll.forEach(el => el.classList.toggle("hide-price", !isSubcribe))
  }


  function changePrice() {
    const discountApp = document.querySelector(".selling_plan-price .radio__price").getAttribute("data-discount-value");
    const enableSubscribe = inputFullPrice.dataset.subscribe === "true" ? true : false;
    const discountValue = enableSubscribe ? (Number(discountApp) / 100) : 0;

    const currentPrice = inputFullPrice.value;
    const priceNoDiscount = currentPrice;
    // const priceWithDiscount = Math.floor((priceNoDiscount - (priceNoDiscount * discountValue)).toFixed(2)).toFixed(2);
    const priceWithDiscount = Number(inputFullPrice.getAttribute("data-value-sub")).toFixed(2);
    const priceSave = (priceNoDiscount - priceWithDiscount).toFixed(2);

    const priceWidget = (priceNoDiscount - (priceNoDiscount * (Number(discountApp) / 100))).toFixed(2);
    const priceSaveWidget = (priceNoDiscount - priceWidget).toFixed(2);



    const buttonSellingPlan = document.querySelector(".subscription-radio");
    if (!buttonSellingPlan) return;
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
    if (enableSubscribe) {
      changePriceHtml(priceNoDiscount, selectors.onlyCompare);
      changePriceHtml(priceWithDiscount, selectors.onlyRegular)

      changePriceHtml(priceNoDiscount, selectors.widgetCompare);
      changePriceHtml(priceWithDiscount, selectors.widgetOrigin);

      changePriceHtml(priceNoDiscount, selectors.badgeCompare);
      changePriceHtml(priceWithDiscount, selectors.badgeRegular);
      changePriceHtml(priceSave, selectors.badgeSave);

      hidePrice(priceNoDiscount, priceWithDiscount, selectors.badgeSave);
      hidePrice(priceNoDiscount, priceWithDiscount, selectors.badgeCompare);
      hidePrice(priceNoDiscount, priceWithDiscount, selectors.onlyCompare);

    } else {
      changePriceHtml(priceNoDiscount, selectors.onlyRegular)
      changePriceHtml(priceNoDiscount, selectors.badgeRegular);

      changePriceHtml(priceNoDiscount, selectors.compare);
      changePriceHtml(priceNoDiscount, selectors.regular);

      changePriceHtml(priceWidget, selectors.discount);
      changePriceHtml(priceSaveWidget, selectors.save);

      hidePrice(priceNoDiscount, priceNoDiscount, selectors.badgeSave);
      hidePrice(priceNoDiscount, priceNoDiscount, selectors.badgeCompare);
      hidePrice(priceNoDiscount, priceNoDiscount, selectors.onlyCompare);

    }
    disabledAddToCart()
  }

  function getQuantityMainProduct() {
    const mainQuantity = Number([...mainProductsValue].reduce((accum, elem) => accum + Number(elem.getAttribute("value")), 0));
    return mainQuantity
  }

  function toggleContent(showContent, hideContent, value) {
    showContent.style.display = "flex";
    hideContent.style.display = "none";
    if (freeInput) {
      freeInput.value = value;
    }
  }

  function hidePrice(priceCompare, priceOrigin, element) {
    if (!document.querySelector(element)) return;
    const flag = Number(priceCompare) !== Number(priceOrigin);
    document.querySelector(element).classList.toggle("hidden", !flag);
  }

  function changePriceHtml(newDigit, element) {
    let container = document.querySelector(element);
    if (!container) return;
    let regex = /\d+(\.\d+)?/g;
    container.innerHTML = container.innerHTML.replace(regex, newDigit);
  }

  function disabledAddToCart() {
    if (!buttonAddToCart || !buttonAddToWrapper) return;
    const selectVariant = inputFullPrice.getAttribute("data-select-variant");

    if (selectVariant === "false") {
      setTimeout(() => {
        buttonAddToCart.setAttribute("disabled", "true");
        buttonAddToWrapper.addEventListener("click", scrollTo);
      }, 0);
    } else {
      buttonAddToCart.removeAttribute("disabled");
      buttonAddToWrapper.removeEventListener("click", scrollTo);
    }
  }

  function scrollTo() {
    const y = mainContainer.getBoundingClientRect().top + window.pageYOffset - 150;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

})
