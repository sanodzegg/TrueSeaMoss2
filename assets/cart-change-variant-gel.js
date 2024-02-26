async function removeChangeVariant(target, event) {
  event.preventDefault();

  // Initialize data objects to store updates and additions.
  const dataUpdate = {};
  const dataAdd = [];

  // Retrieve necessary attributes from the target element.
  const selectorArray = target.getAttribute("data-subscription");
  const arrayCartItems = document.querySelectorAll(`[data-subscription="${selectorArray}"]`);
  const variantQuantity = Number(target.getAttribute("data-quantity-variant"));
  const productsQuantity = Number(target.getAttribute("data-quantity-products"));

  // Calculate the index for variants based on the quantity.
  const indexVariants = productsQuantity - variantQuantity >= 5 ? 4 : productsQuantity - variantQuantity - 1;

  arrayCartItems.forEach((el) => {
    const key = el.dataset.id;
    dataUpdate[key] = 0;

    if (el != target) {
      const { variants } = JSON.parse(el.querySelector("[cart-json-product]").innerHTML);
      const planId = el.getAttribute("data-selling-plan-id");
      const quantity = Number(el.getAttribute("data-quantity-variant"));
      const key = el.dataset.id;
      const { id } = variants[indexVariants];
      dataAdd.push({
        "id": id,
        "quantity": quantity,
        "selling_plan": planId
      })
    }
  })

  // Define Shopify endpoints for update, clear, and add operations.
  const updateEndpoint = window.Shopify.routes.root + 'cart/update.js';
  const clearEndpoint = window.Shopify.routes.root + 'cart/clear.js';
  const addEndpoint = window.Shopify.routes.root + 'cart/add.js';

  // Send requests for update, clear, and add operations.
  const prodmiseUpdate = await sendRequest(updateEndpoint, "update", dataUpdate, dataAdd);
  const prodmiseClear = await sendRequest(clearEndpoint, "clear", dataUpdate, dataAdd);
  const prodmiseAdd = await sendRequest(addEndpoint, "add", dataUpdate, dataAdd);

  // Wait for all promises to resolve before dispatching the 'cart:update_remove' event.
  Promise.all([prodmiseUpdate, prodmiseClear, prodmiseAdd]).then(() => {
    document.dispatchEvent(new CustomEvent('cart:update_remove', { bubbles: true }));
  })
}



async function sendRequest(endpoint, type, dataUpdate, dataAdd) {
  const formAdd = [...dataAdd]
  switch (type) {
    case "update": {
      const dataUpdateForm = {
        updates: dataUpdate
      };
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataUpdateForm)
      });
      const result = await response.json();
      const { items } = result;
      for (let item of items) {
        const { id, quantity, selling_plan_allocation,properties } = item;
        formAdd.push(
          {
            id: id,
            quantity: quantity,
            selling_plan: selling_plan_allocation ? selling_plan_allocation.selling_plan.id : "",
            properties:properties
          }
        )
      }
      // Set the global variable window.removeChangeItem for reference in subsequent requests.
      window.removeChangeItem = formAdd.reverse();
      return result
    }
    case "clear": {
      // Send a POST request to clear the cart and retrieve the result.
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      // Parse and return the result.
      const result = await response.json();
      return result
    }
    case "add": {
      // Prepare data for the add operation.
      const dataAddForm = {
        items: window.removeChangeItem
      };
      // Send a POST request to add items to the cart and retrieve the result.
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataAddForm)
      });
      // Parse and return the result.
      const result = await response.json();
      return result
    }
    default:
      break;
  }
} 