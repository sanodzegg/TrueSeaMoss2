document.addEventListener("DOMContentLoaded", function () {
  // Selecting DOM elements
  const containerSf = document.querySelector(".sf-product");
  const iconVariants = document.querySelectorAll(".icon-pot_variant");
  const textVariants = document.querySelectorAll(".text-pot");
  const radioButtons = document.querySelectorAll("[data-option-position='1'] .radio__input");
  const iconFree = document.querySelector(".icon-pot_free");
  const el = document.querySelector("#product__selectors_scroll");

  // Add a click event listener to the container for scrolling to the product
  containerSf.addEventListener("click", handleScrollToProduct);

  // Function to handle smooth scrolling to the target product
  function handleScrollToProduct() {
    const y = el.getBoundingClientRect().top + window.pageYOffset - 150;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  // Add change event listeners to radio buttons for handling variant changes
  radioButtons.forEach((el, index) => {
    el.addEventListener("change", function () {
      changeActiveElement(index)
    });
  });

  // Function to change the active element based on the selected variant
  function changeActiveElement(index) {
    const currentPosition = index + 1;
    handleChangeArray(textVariants, currentPosition);
    checkPosition(iconVariants, index);
  }
  // Function to hide elements in an array except the one at the specified position
  function handleChangeArray(elements, position) {
    if (!elements[position]) return;
    elements.forEach(el => el.classList.add("hide"));
    elements[position].classList.remove("hide");
  }
  function checkPosition(elements, position) {
    if (!elements[position]) return;
    elements.forEach(el => el.classList.add("hide"));
    [...elements].slice(0, position + 1).forEach(el => el.classList.remove("hide"));

    if (!iconFree) return;
    iconFree.classList.toggle("hide", elements.length !== position + 1);
  }
  // Change the active element based on the initially checked radio button
  changeActiveElement([...radioButtons].findIndex(el => el.checked));



  // Check window width and execute specific functionality if conditions are met
  if (window, innerWidth < 768 && el) {
      // Add a scroll event listener to show the sticky footer
    window.addEventListener("scroll", showStickyFooter);

    const firstPoint = el.getBoundingClientRect().y / 3.5;

    // Function to show the sticky footer when scrolling
    function showStickyFooter() {
      if (firstPoint <= window.pageYOffset) {
        containerSf.classList.add("_show-mobile");
        window.removeEventListener("scroll", showStickyFooter);
      }
    }
  }
})