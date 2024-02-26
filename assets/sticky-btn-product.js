document.addEventListener("DOMContentLoaded", function () {
  // Selecting DOM elements
  const scrollToProduct = document.querySelector(".sticky-section button");
  const stickyWrapper = document.querySelector(".sticky-section");
  const el = document.querySelector("#sn-product-widget");

  // Check if the target element for scrolling exists
  if (!el) {
    stickyWrapper.style.display = "none";
  } else {
    // Add a click event listener to the "scroll to product" button
    scrollToProduct.addEventListener("click", handleScrollToProduct);

    // Add a scroll event listener to toggle the sticky element
    window.addEventListener("scroll", toggleStickyElement);

    // Initialize the variable to store the last scroll position
    let lastScrollPos = window.pageYOffset;

    // Function to handle smooth scrolling to the target product
    function handleScrollToProduct() {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 150;
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    // Function to toggle the visibility of the sticky element based on scroll position
    function toggleStickyElement() {
      const productWrapper = document.querySelector(".product-single__wrapper-custom");
      const wrapperHeight = productWrapper.getBoundingClientRect().height;

      // Calculate the current scroll position adjusted for the product wrapper height
      const currentScrollPos = window.pageYOffset - wrapperHeight / 2.5;

      // Toggle the "hide" class based on scroll position
      if (window.pageYOffset > wrapperHeight / 2.5) {
        stickyWrapper.classList.toggle("hide", currentScrollPos < lastScrollPos);
        lastScrollPos = currentScrollPos;
      }
    }
  }
});
