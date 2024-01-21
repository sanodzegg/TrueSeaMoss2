document.addEventListener('DOMContentLoaded', function () {
  class VariantItem extends HTMLElement {
    _active = false
    constructor() {
      super();
      this.json = JSON.parse(this.querySelector('[data-json]').innerHTML);
      this.buttonAdd = this.querySelector(".variant_item-button");
      this.wrapperList = this.closest(".list_variants-grid");
      this.allVariants = this.wrapperList.querySelectorAll("variant-item");

      this.inputQuantity = this.querySelector('[data-quantity]');
      this.inputSelling = this.querySelector('[data-selling]');
      this.inputPrice = this.querySelector('[data-price]');
      this.inputPriceSubsribe = this.querySelector('[data-price-selling]');

      this.fieldQuntity = this.querySelector(".variant_item-quantity");
      this.fieldQuntityValue = this.fieldQuntity.querySelector("input");
      this.fieldQuntityPlus = this.fieldQuntity.querySelector("[name='plus']");
      this.fieldQuntityMinus = this.fieldQuntity.querySelector("[name='minus']");
      this.widget = null;
      this.init();
    }

    set active(value) {
      this._active = value
      this.checkActive()
    }
    get active() {
      return this._active;
    }


    toggleExtraContent(quantity) {
      if (!this.isExtraItem ) return;
      this.isExtraWrapper.style.display = quantity <= 0 ? "flex" : "none";
    }

    checkActive() {
      this.classList.toggle("active-card",this._active);
    }

    init() {
      if (!this.inputQuantity || !this.inputSelling || !this.buttonAdd) {
        console.error("Required elements not found.");
        return;
      }

      [this.fieldQuntityPlus, this.fieldQuntityMinus, this.buttonAdd].forEach(el => el.addEventListener("click", (e) => {
        this.changeQuantity(e)
      }))
      this.deleteDefault(this.fieldQuntityPlus, this.fieldQuntityMinus, this.buttonAdd);
      this.findWidget();
      this.setPrice(this.getQuantity());
    }


    deleteDefault(...rest) {
      [...rest].forEach(el => el.addEventListener('click', (e) => e.preventDefault()))
    }

    toggleQuantityField(quantity) {
      this.buttonAdd.style.display = quantity <= 0 ? "flex" : "none";
      
      this.fieldQuntity.style.display = quantity <= 0 ? "none" : "flex";
    }

    changeQuantity(event) {
      const target = event.target;
      switch (target.name) {
        case "button":
          this.setQuantity(1);
          break;
        case "plus":
          this.setQuantity(Number(this.getQuantity()) + 1);
          break;
        case "minus":
          this.setQuantity(Number(this.getQuantity()) - 1);
          break;
        default:
          break;
      }
      const currentQuantity = this.getQuantity()
      this.toggleQuantityField(currentQuantity);
      this.setPrice(currentQuantity);
      this.wrapperList.querySelector('[data-full-price]').dispatchEvent(new Event('change'));

    }

    getQuantity() {
      return Number(this.inputQuantity.value);
    }

    setQuantity(quantity) {
      this.inputQuantity.value = quantity;
      this.fieldQuntityValue.value = quantity;
    }

    setPrice(quantity) {
      this.inputPrice.value = (Number(this.inputPrice.getAttribute("data-value")) * quantity).toFixed(2);
      this.inputPriceSubsribe.value = (Number(this.inputPriceSubsribe.getAttribute("data-value")) * quantity).toFixed(2);
      this.setFullPrice();
      this.active = Number(this.inputPrice.getAttribute("value")) === 0 ? false : true; 
    }

    setFullPrice() {
      const arrayVariants = this.allVariants;
      const fullPriceElement = this.wrapperList.querySelector('[data-full-price]');
    
      const firstPrice = fullPriceElement.getAttribute("data-value");
      const firstPriceSub = fullPriceElement.getAttribute("data-price-sub");
    
      let fullPrice = 0;
      let fullPriceSub = 0;
    
      for (const variant of arrayVariants) {
        const currentValuePrice = Number(variant.querySelector('[data-price]').value);
        const currentValuePriceSub = Number(variant.querySelector('[data-price-selling]').value);
        fullPrice += currentValuePrice;
        fullPriceSub += currentValuePriceSub;
      }

    
      const formatValue = (value, defaultValue) => (value !== 0 ? value.toFixed(2) : (Number(defaultValue) / 100).toFixed(2));
    
      fullPriceElement.value = formatValue(fullPrice, firstPrice);
      fullPriceElement.setAttribute("data-value-sub", formatValue(fullPriceSub, firstPriceSub));
      fullPriceElement.setAttribute("data-select-variant", fullPrice !== 0 ? "true" : "false");
    }
    

    findWidget() {
      const timerfindWidget = setInterval(checkWidget.bind(this), 100);
      function checkWidget() {
        if (document.querySelector(".rc-widget")) {
          clearInterval(timerfindWidget);
          this.widget = document.querySelector(".rc-widget");
          this.observeTheWidget(this.widget.querySelector(".subscription-radio"));
          this.checkSubscribeAfterLoad(this.widget.querySelector(".subscription-radio"));
        }
      }
    }

    observeTheWidget(element) {
      if (!element) return;
      let activeSubscribe;
      let observer = new MutationObserver(mutations => {
        activeSubscribe = mutations[0].target.classList.contains("rc-radio--active");
        this.addSellingPlan(activeSubscribe);

      })
      observer.observe(element, { attributes: true, subtree: true });
    }

    checkSubscribeAfterLoad(element) {
      if (!element) return;
      let activeSubscribe = element.classList.contains("rc-radio--active");
      this.addSellingPlan(activeSubscribe);
      this.wrapperList.querySelector('[data-full-price]').setAttribute("data-subscribe", activeSubscribe);
    }

    addSellingPlan(flag) {
      const sellingPlanId = this.json.selling_plan_allocations[0].selling_plan_id;
      this.inputSelling.value = flag ? sellingPlanId : "";
      this.wrapperList.querySelector('[data-full-price]').setAttribute("data-subscribe", flag);
    }
  }

  customElements.define('variant-item', VariantItem);
})