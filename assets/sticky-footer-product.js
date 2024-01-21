document.addEventListener("DOMContentLoaded", function () {
  const containerSf = document.querySelector(".sf-product");
  const iconVariants = document.querySelectorAll(".icon-pot_variant");
  const textVariants = document.querySelectorAll(".text-pot");
  const radioButtons = document.querySelectorAll("[data-option-position='1'] .radio__input");
  const iconFree = document.querySelector(".icon-pot_free");
  const el = document.querySelector("#product__selectors_scroll");

  containerSf.addEventListener("click", handleScrollToProduct);
  function handleScrollToProduct() {
    const y = el.getBoundingClientRect().top + window.pageYOffset - 150;
    window.scrollTo({ top: y, behavior: "smooth" });
  }


  radioButtons.forEach((el, index) => {
    el.addEventListener("change", function () {
      changeActiveElement(index)
    });
  });

  function changeActiveElement(index) {
    const currentPosition = index + 1;
    handleChangeArray(textVariants, currentPosition);
    checkPosition(iconVariants, index);
  }
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
  changeActiveElement([...radioButtons].findIndex(el => el.checked));



  
  if (window,innerWidth  < 768 && el) {
    window.addEventListener("scroll", showStickyFooter);

    const firstPoint = el.getBoundingClientRect().y / 3.5;
    function showStickyFooter() {
      if (firstPoint <= window.pageYOffset) {
        containerSf.classList.add("_show-mobile");
        window.removeEventListener("scroll", showStickyFooter);
      }
    }
  }
})