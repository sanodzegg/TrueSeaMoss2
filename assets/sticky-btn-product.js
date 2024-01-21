document.addEventListener("DOMContentLoaded", function () {
  const scrollToProduct = document.querySelector(".sticky-section button");
  const stickyWrapper = document.querySelector(".sticky-section");
  const el = document.querySelector("#sn-product-widget");

  if (!el) {
    stickyWrapper.style.display = "none";
  } else {
    scrollToProduct.addEventListener("click", handleScrollToProduct);
    window.addEventListener("scroll", toggleStickyElement);

    let lastScrollPos = window.pageYOffset;

    function handleScrollToProduct() {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 150;
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    function toggleStickyElement() {
      const productWrapper = document.querySelector(".product-single__wrapper-custom");
      const wrapperHeight = productWrapper.getBoundingClientRect().height;
      const currentScrollPos = window.pageYOffset - wrapperHeight / 2.5;

      if (window.pageYOffset > wrapperHeight / 2.5) {
        stickyWrapper.classList.toggle("hide", currentScrollPos < lastScrollPos);
        lastScrollPos = currentScrollPos;
      }
    }
  }
}); 
