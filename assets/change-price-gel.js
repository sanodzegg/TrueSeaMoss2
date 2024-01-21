document.addEventListener("DOMContentLoaded", function () {

  const mainContainer = document.querySelector(".list_variants-wrapper");
  const buttonAddToCart = document.querySelector(".product__block-button_price .product__submit__add");
  const buttonAddToWrapper = document.querySelector(".product__block-button_price form");
  const idProduct = document.querySelector(".recharge-content").getAttribute("data-id-product");
  const freeInput = document.querySelector(".free-input");
  const inputFullPrice = document.querySelector("input[data-full-price]");
  const variantsItem = document.querySelectorAll("variant-item");
  const variantsValue = document.querySelectorAll("variant-item [data-quantity]");
  const variantsId = document.querySelectorAll("variant-item [data-variant-id]");
  const variantsNewId = document.querySelectorAll("variant-item [data-ver-id]");
  const variantsNewIdSubsription = document.querySelectorAll("variant-item [data-ver-id-sub]");
  const subBtnForm = document.querySelector(".product__block-button_price button.btn--submit");

  if (subBtnForm) {
    subBtnForm.addEventListener("click", function (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
      document.dispatchEvent(new CustomEvent('cart:change-variant', {
        bubbles: true, detail: {
          form: document.querySelector(".product__form__wrapper form button.btn--submit")
        }
      }));
    })
  }


  const fetchCartItem = async () => {
    const res = await fetch("/cart.js");
    const cartItems = await res.json();
    return cartItems.items;
  };

  const getCartItems = async () => {
    if (!freeInput) return;
    const mainId = idProduct;
    const items = await fetchCartItem();
    // const handleMain = "Main " + String(freeInput.dataset.handle).toLocaleLowerCase();
    const isCart = items.some(item => Number(item.variant_id) === Number(mainId));
    freeInput.setAttribute("data-quantity", isCart ? 0 : 1);
  };


  const setQuantityVariants = async () => {
    const items = await fetchCartItem();
    for (const item of items) {
      const { product_id, quantity, variant_id, selling_plan_allocation,key } = item;
      const inputSelector = document.querySelector(`[data-cart-el="${product_id}"]`);
      const inputSelectorSubscribe = document.querySelector(`[data-cart-el-sub="${product_id}"]`);

      if (inputSelector && !selling_plan_allocation) {
        updateInputValueAndAttributes(inputSelector, quantity, variant_id, key);
      }

      if (inputSelectorSubscribe && selling_plan_allocation) {
        updateInputValueAndAttributes(inputSelectorSubscribe, quantity, variant_id, key, selling_plan_allocation.selling_plan.id);
      }
    }
  };

  setQuantityVariants()

  const updateInputValueAndAttributes = (inputSelector, quantity, variantId, key, sellingPlanId = null) => {
    const oldValue = Number(inputSelector.getAttribute('data-old-variant'));
    const currentValue = Number(inputSelector.getAttribute('data-old-variant'));

    inputSelector.value = quantity;
    inputSelector.setAttribute('data-change', oldValue === currentValue ? "false" : "true");
    inputSelector.setAttribute('data-old-variant', variantId);
    inputSelector.setAttribute('data-key-cart', key);

    if (sellingPlanId) {
      inputSelector.setAttribute('data-selling-plan-id', sellingPlanId);
    }
  };


  function checkChangeItem() {
    variantsId.forEach((el, index) => {
      const oneTimeInput = variantsNewId[index];
      const subsribeInput = variantsNewIdSubsription[index];

      const oldValueOneTime = oneTimeInput.getAttribute("data-old-variant");
      const newValueOneTime = oneTimeInput.getAttribute("data-new-variant");

      const oldValueSub = subsribeInput.getAttribute("data-old-variant");
      const newValueSub = subsribeInput.getAttribute("data-new-variant");
      if (oldValueOneTime != "") {
        oneTimeInput.setAttribute('data-change', "true");
      }
      if (oldValueSub != "") {
        subsribeInput.setAttribute('data-change',"true");
      }
    })
  }

  document.addEventListener('cart:free', getCartItems);

  inputFullPrice.addEventListener("change", function () {
    const isSubcribe = inputFullPrice.getAttribute("data-subscribe") === "false" ? false : true;
    setGenerallQuantity(isSubcribe ? "data-cart-quantity-sub" : "data-cart-quantity");
    changeVariant(isSubcribe ? "data-cart-quantity-sub" : "data-cart-quantity");
    changePrice();
    checkChangeItem();
    document.dispatchEvent(new CustomEvent('cart:test', {
      bubbles: true
    }));
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
        setGenerallQuantity("data-cart-quantity-sub");
        changeVariant("data-cart-quantity-sub");
        changePrice();
        toggleContent(contentSubscription, contentOnetime, idProduct);
      })
      onetimeRadio.addEventListener("change", function () {
        setGenerallQuantity("data-cart-quantity");
        changeVariant("data-cart-quantity");
        changePrice();
        toggleContent(contentOnetime, contentSubscription, '');
      })
      setGenerallQuantity("data-cart-quantity-sub");
      changeVariant("data-cart-quantity-sub");
      changePrice();
    }
  }


  function changePrice() {
    const discountApp = document.querySelector(".selling_plan-price .radio__price").getAttribute("data-discount-value");
    const enableSubscribe = inputFullPrice.dataset.subscribe === "true" ? true : false;
    const discountValue = enableSubscribe ? (Number(discountApp) / 100) : 0;
    const currentPrice = inputFullPrice.value;
    const priceNoDiscount = currentPrice;
    const priceWithDiscount = (priceNoDiscount - (priceNoDiscount * discountValue).toFixed(2)).toFixed(2);
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

  function changeVariant(nameAttr) {
    const quantity = Number(inputFullPrice.getAttribute("data-general-quantity"));
    const cartQuantity = Number(inputFullPrice.getAttribute(nameAttr));
    const generallQuantity = (quantity + cartQuantity) === 0 ? 1 : (quantity + cartQuantity);
    variantsItem.forEach((el, index) => {
      const { variants } = JSON.parse(el.querySelector("[data-json-product]").innerHTML);
      const variantsLength  = [...variants].length

      let currentVariant;
      let currentVariantId;

      if (variants[quantity - 1]) {
        currentVariant = variants[quantity - 1];
      } else if (variantsLength < quantity) {
        currentVariant = variants.at(-1);
      } else {
        currentVariant = variants[0];
      }

      if (variants[generallQuantity - 1]) {
        currentVariantId = variants[generallQuantity - 1];
      } else if (variantsLength < generallQuantity) {
        currentVariantId = variants.at(-1);
      } else {
        currentVariantId = variants[0];
      }
   
      const { id } = currentVariantId;

      variantsId[index].value = id;
      variantsNewId[index].setAttribute("data-new-variant", id);
      variantsNewIdSubsription[index].setAttribute("data-new-variant", id);
      if (index === 0) {
        console.log(currentVariantId,generallQuantity);
        setPriceVariant(currentVariant, quantity)
      }
    })
  }


  function setPriceVariant(json, koeff) {
    const koeffQuantity = koeff === 0 ? 1 : koeff
    const { price } = json;
    const shopifyFormat = ((price * koeffQuantity / 100)).toFixed(2);
    inputFullPrice.value = shopifyFormat;
    return true
  }
  function setGenerallQuantity(nameAttr) {
    const generallQuantity = Number([...variantsValue].reduce((accum, elem) => accum + Number(elem.getAttribute("value")), 0));
    // const cartQuantity = Number(inputFullPrice.getAttribute(nameAttr));
    const cartQuantity = 0;
    inputFullPrice.setAttribute("data-general-quantity", generallQuantity + cartQuantity)
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
