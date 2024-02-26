document.addEventListener('DOMContentLoaded', function () {
  // Select all elements with the class "variant_item" under the "variant-item" class
  const variantItems = document.querySelectorAll("variant-item.variant_item");

  // Function to set the maximum height of variant titles to ensure uniformity

  function setMaxHeight() {
    // Create an array of heights for each variant title

    let arrayHight = [...variantItems].map(el => {
      return Number(getComputedStyle(el.querySelector("h3.variant_item-title")).height.replace("px", ""));
    })

    // Find the maximum height from the array

    let maxHeight = Math.max(...arrayHight);

    // Set the height of all variant titles to the maximum height

    variantItems.forEach(el => {
      el.querySelector("h3.variant_item-title").style.height = maxHeight + "px"
    })
  }

  // Call the function to set the maximum height

  setMaxHeight()
  class VariantItem extends HTMLElement {
    _active = false

    // Constructor to initialize the element

    constructor() {
      super();
      // Parse the JSON data from the element with the attribute 'data-json'
      this.json = JSON.parse(this.querySelector('[data-json]').innerHTML);
      // don`t remove
      this.buttonAdd = this.querySelector(".variant_item-button");
      // don`t remove

      // Initialize various input and field elements

      this.wrapperList = this.closest(".list_variants-grid");
      this.allVariants = this.wrapperList.querySelectorAll("variant-item");
      this.buttons = this.querySelectorAll("button");


      this.inputQuantity = this.querySelector('[data-quantity]');
      this.inputSelling = this.querySelector('[data-selling]');
      this.inputPrice = this.querySelector('[data-price]');

      this.fieldQuntity = this.querySelector(".variant_item-quantity");
      this.fieldQuntityValue = this.fieldQuntity.querySelector("input");
      this.fieldQuntityPlus = this.fieldQuntity.querySelector("[name='plus']");
      this.fieldQuntityMinus = this.fieldQuntity.querySelector("[name='minus']");
      this.widget = null;

      // Initialize the element

      this.init()

    }


    // Setter for the 'active' property

    set active(value) {
      this._active = value
      this.checkActive()
    }
    // Getter for the 'active' property

    get active() {
      return this._active;
    }

    // Toggle the 'active' class based on the 'active' property

    checkActive() {
      this.classList.toggle("active-card", this._active);

      return this.classList.contains("active-card");
    }

    // Initialize the element with event listeners and necessary checks

    init() {
      if (!this.inputQuantity || !this.inputSelling || !this.buttonAdd) {
        console.error("Required elements not found.");
        return;
      }


      // Add click event listener to the element to show the selector and set the first value
      this.addEventListener("click", this.showSelectorAndSetFitstValue);

      // Add click event listeners to various elements for quantity change and prevent default behavior

      [this.fieldQuntityPlus, this.fieldQuntityMinus, this.buttonAdd].forEach(el => el.addEventListener("click", (e) => {
        this.changeQuantity(e)
      }))

      // Delete default behavior for certain elements
      this.deleteDefault(this.fieldQuntityPlus, this.fieldQuntityMinus, this.buttonAdd);
      this.findWidget();
      this.setPrice(this.getQuantity());
    }

    // Show the selector and set the first value
    showSelectorAndSetFitstValue() {
      if (this.getQuantity() === 0) {
        this.buttonAdd.dispatchEvent(new Event('click',{cancelable: true}))
        // this.buttonAdd.click();
      }

      this.removeEventListener("click", this.showSelectorAndSetFitstValue)
    }

    // Delete default behavior for specified elements
    deleteDefault(...rest) {
      [...rest].forEach(el => {
        el.addEventListener('click', (e) => e.preventDefault())
      })
    }

    // Toggle the quantity field visibility based on the quantity value

    toggleQuantityField(quantity) {
      // don`t remove
      // this.buttonAdd.style.display = quantity <= 0 ? "flex" : "none";   
      this.fieldQuntity.style.display = quantity <= 0 ? "none" : "flex";
    }


    // Change the quantity based on the clicked button
    changeQuantity(event) {
      const target = event.target;
      const maxValue = this.wrapperList.querySelector('[data-full-price]').getAttribute("data-max-selected");
      const currentValue = this.wrapperList.querySelector('[data-full-price]').getAttribute("data-general-quantity");

      switch (target.name) {
        case "button":
          this.setQuantity(1);
          break;
        case "plus":
          if (currentValue < maxValue) {
            this.setQuantity(Number(this.getQuantity()) + 1);
          }
          break;
        case "minus":
          this.setQuantity(Number(this.getQuantity()) - 1);
          break;
        default:
          break;
      }
      const quantity = this.getQuantity()
      this.toggleQuantityField(quantity);


      this.setPrice(quantity);
      if (quantity === 0) {
        setTimeout(() => {
          this.addEventListener("click", this.showSelectorAndSetFitstValue);
        }, 0);
      }
      this.wrapperList.querySelector('[data-full-price]').dispatchEvent(new Event('change'));
    }

    // Get the quantity value

    getQuantity() {
      return Number(this.inputQuantity.value);
    }

    // Set the quantity value

    setQuantity(quantity) {
      this.inputQuantity.value = quantity;
      this.fieldQuntityValue.value = quantity;
    }

    // Set the price based on the quantity


    setPrice(quantity) {
      this.inputPrice.value = (Number(this.inputPrice.getAttribute("data-value")) * quantity).toFixed(2);
      this.setFullPrice();
      this.active = Number(this.inputPrice.getAttribute("value")) === 0 ? false : true;
    }

    // Calculate and set the full price for all variants

    setFullPrice() {
      const arrayVariants = this.allVariants;
      const firstPrice = this.wrapperList.querySelector('[data-full-price]').getAttribute("data-value");
      let fullPrice = 0;
      for (let variant of arrayVariants) {
        let currentValuePrice = Number(variant.querySelector('[data-price]').value);
        fullPrice += currentValuePrice;
      }
      this.wrapperList.querySelector('[data-full-price]').value = fullPrice != 0 ? fullPrice.toFixed(2) : (Number(firstPrice) / 100).toFixed(2);
      this.wrapperList.querySelector('[data-full-price]').setAttribute("data-select-variant", fullPrice != 0 ? "true" : "false")
    }

    // Find the widget
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

    // Observe changes in the widget and add selling plan 
    observeTheWidget(element) {
      if (!element) return;
      let activeSubscribe;
      let observer = new MutationObserver(mutations => {
        activeSubscribe = mutations[0].target.classList.contains("rc-radio--active");
        this.addSellingPlan(activeSubscribe);

      })
      observer.observe(element, { attributes: true, subtree: true });
    }

    // Check for the active subscription after the widget is loaded
    checkSubscribeAfterLoad(element) {
      if (!element) return;
      let activeSubscribe = element.classList.contains("rc-radio--active");
      this.addSellingPlan(activeSubscribe);
      this.wrapperList.querySelector('[data-full-price]').setAttribute("data-subscribe", activeSubscribe);
    }

    // Add selling plan based on the subscription flag
    addSellingPlan(flag) {
      const sellingPlanId = this.json.selling_plan_allocations[0].selling_plan_id;
      this.inputSelling.value = flag ? sellingPlanId : "";
      this.wrapperList.querySelector('[data-full-price]').setAttribute("data-subscribe", flag);
    }
  }

  // Define the custom element 'variant-item'
  customElements.define('variant-item', VariantItem);
})