document.addEventListener("DOMContentLoaded", function () {
  // Dom selector
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
  const variantsInput = document.querySelectorAll(".varian__quantity-item input");
  const variantsLabel = document.querySelectorAll(".varian__quantity-item");
  const textMain = document.querySelector(".list_variants-title .small-badge");
  const textInfo = document.querySelector(".list_variants-title .small-badge")?.children;
  const discountApp = document.querySelector(".selling_plan-price .radio__price").getAttribute("data-discount-value");


  // Event listener for changes in variant quantities
  variantsInput.forEach(el => {
    el.addEventListener("change", (e) => {
      const { target } = e;
      const { value } = target;
      changeMaxElement(value);
      resetAllVariants(value);
      changeTextInfo();
      changeVariant(checkIsSubcribe() ? "data-cart-quantity-sub" : "data-cart-quantity");
      changePrice();
    })
  });

  // Function to change the maximum selected quantity
  function changeMaxElement(value) {
    if (!value) return;
    inputFullPrice.setAttribute("data-max-selected", value);
  }
  // Function to change the information text based on selected quantity
  function changeTextInfo() {
    if (textInfo.length !== 2) return;
    const maxValue = howAvalibleTaste();
    textInfo[0].innerHTML = maxValue + (maxValue === 1 ? " taste" : " tastes");
    textInfo[1].innerHTML = maxValue + (maxValue === 1 ? " pack" : " packs");
  }
  // Function to determine the available taste quantity
  function howAvalibleTaste() {
    return Number(inputFullPrice.getAttribute("data-max-selected"));
  }
  // Function to reset all variants based on the selected quantity
  function resetAllVariants(value) {
    variantsItem.forEach((el, index) => {
      // These methods from Class VariantItem
      el?.setQuantity(0);
      el?.toggleQuantityField(0);
      el.addEventListener("click", el.showSelectorAndSetFitstValue);
      // These methods from Class VariantItem
      el.classList.remove("active-card");
      el.classList.remove("_not-active-item");

      if (index == 0 && inputFullPrice.getAttribute("data-select-variant") == "true") {
        const { variants } = (JSON.parse(el.querySelector("[data-json-product]").innerHTML));
        setPriceVariant(variants[0], 1);
        changePrice()
      }
    });

    inputFullPrice.setAttribute("data-max-selected", value);
    inputFullPrice.setAttribute("data-general-quantity", 0);
    inputFullPrice.setAttribute("data-select-variant", false);
    inputFullPrice.value = inputFullPrice.getAttribute("data-value");
    textMain?.classList.toggle("_hide-text", false);

  }

  // Function to disable other elements based on the selected quantity
  function disabledOtherElement(maxValue, currentValue) {
    const isDisabled = Number(maxValue) === Number(currentValue);

    textMain?.classList.toggle("_hide-text", isDisabled);

    variantsItem.forEach((el) => {
      if (!el.classList.contains("active-card")) {
        if (isDisabled) {
          el.classList.add("_not-active-item");
        } else {
          el.classList.remove("_not-active-item");
        }
      }
    });

  }

  // Event listener for subscription form submit
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

  // Function to fetch cart items
  const fetchCartItem = async () => {
    const res = await fetch("/cart.js");
    const cartItems = await res.json();
    return cartItems.items;
  };

  // Function to get cart items and update the free input quantity attribute
  const getCartItems = async () => {
    if (!freeInput) return;
    const mainId = idProduct;
    const items = await fetchCartItem();
    // const handleMain = "Main " + String(freeInput.dataset.handle).toLocaleLowerCase();
    const isCart = items.some(item => Number(item.variant_id) === Number(mainId));
    freeInput.setAttribute("data-quantity", isCart ? 0 : 1);
  };

  // Function to set quantity for variants based on cart items
  const setQuantityVariants = async () => {
    const items = await fetchCartItem();
    for (const item of items) {
      const { product_id, quantity, variant_id, selling_plan_allocation, key } = item;
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

  // Function to update input value and attributes
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


  // Function to check if items have changed in the cart
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
        subsribeInput.setAttribute('data-change', "true");
      }
    })
  }

  // Event listener for free cart items
  document.addEventListener('cart:free', getCartItems);

  // Event listener for changes in the full price input
  inputFullPrice.addEventListener("change", function () {
    const isSubcribe = checkIsSubcribe()
    setGenerallQuantity(isSubcribe ? "data-cart-quantity-sub" : "data-cart-quantity");
    // changeVariant(isSubcribe ? "data-cart-quantity-sub" : "data-cart-quantity");
    // changePrice();
    
    const maxValue = inputFullPrice.getAttribute("data-max-selected");
    const currentValue = inputFullPrice.getAttribute("data-general-quantity");
    disabledOtherElement(maxValue, currentValue);
    checkChangeItem();
    disabledAddToCart();
  })

  // Function to find the Recharge widget and set up event listeners
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
        changeBadgePrice(true)
      })
      onetimeRadio.addEventListener("change", function () {
        setGenerallQuantity("data-cart-quantity");
        changeVariant("data-cart-quantity");
        changePrice();
        toggleContent(contentOnetime, contentSubscription, '');
        changeBadgePrice(false)
      })
      setGenerallQuantity("data-cart-quantity-sub");
      changeVariant("data-cart-quantity-sub");
      changePrice();
      changeBadgePrice(true)
    }
  }


  function changeBadgePrice(isSubscribe) {
    // Retrieve product variants from JSON
    const { variants } = JSON.parse(variantsItem[0].querySelector("[data-json-product]").innerHTML);
  
    // Selectors for badges
    const badgeSelectors = {
      secondBadge: ".varian__quantity-item--2 .varian__quantity-badge",
      thirdBadge: ".varian__quantity-item--3 .varian__quantity-badge",
      fourthBadge: ".varian__quantity-item--4 .varian__quantity-badge",
    };
  
    // Function to get price data
    function getPriceData(variant, quantity, discount) {
      // Check if the variant has a price
      if (!variant.hasOwnProperty("price")) return null;
  
      // Calculate price and discount
      const discountValue = discount !== 0 ? discount / 100 : 0;
      const { price, compare_at_price } = variant;
      const priceWithoutDiscount = ((price / 100) * quantity).toFixed(2);
      const priceDiscount = ((price / 100) * quantity) - (((price / 100) * quantity) * discountValue).toFixed(2);
  
      // Return the price data
      return {
        price: ((compare_at_price / 100) - priceWithoutDiscount).toFixed(0),
        priceDiscount: ((compare_at_price / 100) - priceDiscount).toFixed(0),
      };
    }

    // Iterate through input elements
    variantsInput.forEach(inputElement => {
      let currentVariantData = {
        variant: {},
        discount: Number(discountApp) || 0,
        quantity: "1",
        targetBadge: null,
        price: 0,
        isSubscribe: isSubscribe,
        changePrice: function () {
          // Calculate and update price data
          const priceData = getPriceData(this.variant, this.quantity, this.discount);
          if (priceData) {
            this.price = priceData.price;
            this.priceDiscount = priceData.priceDiscount;
          }
          return this;
        },
      };
  
      // Set current variant data based on input value
      switch (inputElement.value) {
        case "2":
          currentVariantData = {
            ...currentVariantData,
            variant: variants[1],
            targetBadge: badgeSelectors.secondBadge,
            quantity: inputElement.value,
          };
          break;
        case "3":
          currentVariantData = {
            ...currentVariantData,
            variant: variants[2],
            targetBadge: badgeSelectors.thirdBadge,
            quantity: inputElement.value,
          };
          break;
        case "5":
          currentVariantData = {
            ...currentVariantData,
            variant: variants[4],
            targetBadge: badgeSelectors.fourthBadge,
            quantity: inputElement.value,
          };
          break;
        default:
          break;
      }
  
      // Check if the target badge and variant have price information
      if (currentVariantData.targetBadge && currentVariantData.variant.hasOwnProperty("price")) {
        // Calculate and update price, then check for null values before calling update function
        const filledObject = currentVariantData.changePrice();  
        if (filledObject.price !== null || filledObject.priceDiscount !== null) {
          changePriceHtml(filledObject.isSubscribe ? filledObject.priceDiscount : filledObject.price, filledObject.targetBadge);
        }
      }
    });
  }
  
  


  // Function to change the selected variant price
  function changePrice() {
    const enableSubscribe = inputFullPrice.dataset.subscribe === "true" ? true : false;
    const discountValue = enableSubscribe ? (Number(discountApp) / 100) : 0;
    const currentPrice = inputFullPrice.value;
    const currentPriceCompare = inputFullPrice.getAttribute("data-price-compare");
    const priceNoDiscount = currentPrice;

    const priceWithDiscount = (priceNoDiscount - (priceNoDiscount * discountValue).toFixed(2)).toFixed(2);
    const comparePriceWithDiscount = (Number(currentPriceCompare).toFixed(2));
    const priceSave = (priceNoDiscount - priceWithDiscount).toFixed(2);

    const priceWidget = (priceNoDiscount - (priceNoDiscount * (Number(discountApp) / 100))).toFixed(2);
    const priceSaveWidget = (comparePriceWithDiscount - priceWidget).toFixed(2);



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
      changePriceHtml(comparePriceWithDiscount, selectors.onlyCompare);
      changePriceHtml(priceWithDiscount, selectors.onlyRegular)

      changePriceHtml(comparePriceWithDiscount, selectors.widgetCompare);
      changePriceHtml(priceWithDiscount, selectors.widgetOrigin);

      changePriceHtml(comparePriceWithDiscount, selectors.badgeCompare);
      changePriceHtml(priceWithDiscount, selectors.badgeRegular);
      changePriceHtml(priceSave, selectors.badgeSave);

      hidePrice(comparePriceWithDiscount, priceWithDiscount, selectors.badgeSave);
      hidePrice(comparePriceWithDiscount, priceWithDiscount, selectors.badgeCompare);
      hidePrice(comparePriceWithDiscount, priceWithDiscount, selectors.onlyCompare);

    } else {
      changePriceHtml(priceNoDiscount, selectors.onlyRegular)
      changePriceHtml(comparePriceWithDiscount, selectors.onlyCompare);

      changePriceHtml(priceNoDiscount, selectors.badgeRegular);
      changePriceHtml(priceNoDiscount, selectors.compare);
      // 
      changePriceHtml(comparePriceWithDiscount, selectors.regular);

      changePriceHtml(priceWidget, selectors.discount);
      changePriceHtml(priceSaveWidget, selectors.save);

      hidePrice(priceNoDiscount, priceNoDiscount, selectors.badgeSave);
      hidePrice(priceNoDiscount, priceNoDiscount, selectors.badgeCompare);
      hidePrice(comparePriceWithDiscount, priceNoDiscount, selectors.onlyCompare);

    }
    disabledAddToCart()
  }

  // Function to change the selected variant
  function changeVariant(nameAttr) {
    // const quantity = Number(inputFullPrice.getAttribute("data-general-quantity"));
    const quantity =  Number(inputFullPrice.getAttribute("data-max-selected"));
    const cartQuantity = Number(inputFullPrice.getAttribute(nameAttr));
    const generallQuantity = (quantity + cartQuantity) === 0 ? 1 : (quantity + cartQuantity);
    variantsItem.forEach((el, index) => {
      const { variants } = JSON.parse(el.querySelector("[data-json-product]").innerHTML);

      const variantsLength = [...variants].length

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
        setPriceVariant(currentVariant, quantity)
      }
    })
  }

  // Function for checking subscription availability
  function checkIsSubcribe() {
    return inputFullPrice.getAttribute("data-subscribe") === "false" ? false : true;
  }

  // Function to set the price for a specific variant
  function setPriceVariant(json, koeff) {
    const koeffQuantity = koeff === 0 ? 1 : koeff
    // const koeffQuantity = 1
    const { price, compare_at_price } = json;
    const shopifyFormat = ((price * koeffQuantity / 100)).toFixed(2);
    inputFullPrice.value = shopifyFormat;
    inputFullPrice.setAttribute("data-price-compare",((compare_at_price * 1 / 100)).toFixed(2));
    return true
  }
  // Function to update the general quantity based on selected variants
  function setGenerallQuantity(nameAttr) {
    const generallQuantity = Number([...variantsValue].reduce((accum, elem) => accum + Number(elem.getAttribute("value")), 0));
    // const cartQuantity = Number(inputFullPrice.getAttribute(nameAttr));
    const cartQuantity = 0;
    inputFullPrice.setAttribute("data-general-quantity", generallQuantity + cartQuantity)
  }

  // Function to toggle the display of content based on conditions
  function toggleContent(showContent, hideContent, value) {
    showContent.style.display = "flex";
    hideContent.style.display = "none";
    if (freeInput) {
      freeInput.value = value;
    }
  }

  // Function to hide or show an element based on a price comparison
  function hidePrice(priceCompare, priceOrigin, element) {
    if (!document.querySelector(element)) return;
    const flag = Number(priceCompare) !== Number(priceOrigin);
    document.querySelector(element).classList.toggle("hidden", !flag);
  }

  // Function to dynamically change the content of an HTML element with a new digit
  function changePriceHtml(newDigit, element) {
    let container = document.querySelector(element);
    if (!container) return;
    let regex = /\d+(\.\d+)?/g;
    container.innerHTML = container.innerHTML.replace(regex, newDigit);
  }

  // Function to disable or enable the "Add to Cart" button based on conditions
  function disabledAddToCart() {
    if (!buttonAddToCart || !buttonAddToWrapper) return;
    const selectVariant = inputFullPrice.getAttribute("data-select-variant");
    const generalQuantity = Number(inputFullPrice.getAttribute("data-general-quantity"));
    const maxQuantity = Number(inputFullPrice.getAttribute("data-max-selected"));

    if (selectVariant === "false" || maxQuantity !== generalQuantity) {
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
