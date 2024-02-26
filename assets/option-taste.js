document.addEventListener("DOMContentLoaded", function () {
    // Reset the form on page load
    resetForm();

    let howAvalibleTaste = 0;
    let activeElem = 0;
    let notActiveElement = false;
    let isVisibleRecharge = false

    // Selecting DOM elements
    const mainContainer = document.querySelector(".option-taste_container");
    const containerFields = document.querySelector(".filds-line");
    const optionTaste = document.querySelectorAll(".option-taste_item");
    const labelsTaste = document.querySelectorAll(".option-taste_item label");
    const wrapperQuantity = document.querySelectorAll(".option-taste_quantity");
    const radioPacks = document.querySelectorAll(".selector-wrapper.selector-wrapper--boxes .radio__input");
    const buttonQuantity = document.querySelectorAll(".option-taste_btn");
    const textMain = document.querySelector(".option-taste-info");
    const textInfo = document.querySelector(".option-taste-info")?.children;
    const buttonAddToCart = document.querySelector(".product__block-button_price .product__submit__add");
    const buttonAddToWrapper = document.querySelector(".product__block-button_price form");

    const stickyBtnAdd = document.querySelector(".product-button-sticky-add");
    const stickyBtnScroll = document.querySelector(".product-button-sticky-scroll");
    const contentRecharge = document.querySelector(".recharge-content");
    const productWrapper = document.querySelector(".product-single__wrapper");
    

    // Function to handle 'Add to Cart' button click
    const handleAddToCartClick = () => {
      if (buttonAddToCart.disabled === false) {
        buttonAddToCart.click();
      }
    };

    // Function to handle scroll button click
    const handleScrollButtonClick = () => {
      const scrollToElement = document.querySelector(`#${stickyBtnScroll.dataset.scroll}`);
      if (scrollToElement) {
        const y = scrollToElement.offsetParent.offsetTop;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    };
    
    // Function to handle window scroll
    const handleWindowScroll = () => {
      const currentPos = window.pageYOffset;
      const stopPoint = contentRecharge?.offsetTop - (contentRecharge?.scrollHeight * 2);

      // Toggle classes based on scroll position
      stickyBtnAdd?.classList.toggle("is-show", currentPos < stopPoint && !buttonAddToCart.disabled);
      stickyBtnScroll?.classList.toggle("is-show", currentPos > productWrapper.clientHeight);
    };
    

      // Add event listeners for scroll and click events
    if (stickyBtnAdd) {
      stickyBtnAdd.addEventListener("click", handleAddToCartClick);
    }
    
    if (stickyBtnScroll) {
      stickyBtnScroll.addEventListener("click", handleScrollButtonClick);
    }
    
    // Add scroll event listener for smaller screens
    if (window.innerWidth < 768) {
      window.addEventListener("scroll", handleWindowScroll);
    }
    
    // Disable click events on wrapperQuantity elements to prevent propagation
    wrapperQuantity.forEach(el => {
        el.addEventListener("click", function (event) {
            event.stopPropagation();
        })
    })

    // Add click events for buttonQuantity elements
    buttonQuantity.forEach((el) => {
        el.addEventListener("click", function (event) {
            event.stopPropagation();
            const currentTaste = event.target.closest(".option-taste_item");
            const typeButton = event.target.dataset.name;
            const input = event.target.closest(".option-taste_quantity").querySelector(".option-taste_input");
            // Handle button clicks (plus or minus)
            if (typeButton === "plus" && input.value < howAvalibleTaste && !disabledButtonPlusQuantity()) {
                input.value++;
                // } else if (typeButton === "minus" && input.value > 1) {
                //     input.value--;
                // }
            } else if (typeButton === "minus") {
                input.value > 1 ? input.value-- : handlerLabelTaste(event);
            }
            // Update UI and check conditions
            let nowActiveElement = checkActiveElem();
            let maxActiveElement = howAvalibleTaste;
            disabledTaste(nowActiveElement, maxActiveElement);
            changeTextInfo();
            disabledAddToCart();
            createlineProperties();
        });
    });
    // Add change events for radioPacks elements
    radioPacks.forEach((el) => {
        el.addEventListener("change", function (event) {
            notActiveElement = true
            let value = event.target.value;
            let count = removeSymbols(value);
            if (!count) return;
            howAvalibleTaste = Number(count);
            resetElement();
            let nowActiveElement = checkActiveElem();
            let maxActiveElement = howAvalibleTaste;
            containerFields.innerHTML = "";
            disabledTaste(nowActiveElement, maxActiveElement);
            changeTextInfo();
            disabledAddToCart();
            setDisabledContainer();
            createlineProperties();
            showStickyAdd();
        })
    })

    // Add click events for labelsTaste elements
    labelsTaste.forEach((el) => {
        el.addEventListener("click", handlerLabelTaste)
    })

    // Function to handle label click for taste selection
    function handlerLabelTaste(event) {
        notActiveElement = true;
        const currentTaste = event.target.closest(".option-taste_item");
        const input = currentTaste.querySelector(".option-taste_input")
        let flag
        switch (currentTaste.dataset.active) {
            case "true":
                currentTaste.setAttribute("data-active", "false");
                flag = currentTaste.dataset.active;
                break;
            case "false":
                currentTaste.setAttribute("data-active", "true");
                flag = currentTaste.dataset.active;
                break;
        }
        currentTaste.classList.toggle("_active-item", flag === "true");
        if (flag === "false") {
            input.value = 1;
        }
        // Update UI and check conditions

        let nowActiveElement = checkActiveElem();
        let maxActiveElement = howAvalibleTaste;
        disabledTaste(nowActiveElement, maxActiveElement);
        createlineProperties();
        changeTextInfo();
        disabledAddToCart();
        setDisabledContainer();
        showStickyAdd();
    }

    // Function to disable taste options based on the selected quantity
    function disabledTaste(current, max) {
        if (max <= current) {
            labelsTaste.forEach(el => {
                const currentTaste = el.closest(".option-taste_item");
                if (!currentTaste.classList.contains("_active-item")) {
                    currentTaste.classList.add("_not-active-item")
                }
            })
        } else {
            labelsTaste.forEach(el => {
                const currentTaste = el.closest(".option-taste_item");
                currentTaste.classList.remove("_not-active-item")
            })
        }
    }

    // Function to reset taste selection elements
    function resetElement() {
        labelsTaste.forEach((el, index) => {
            el.closest(".option-taste_item").classList.remove("_active-item");
            el.closest(".option-taste_item").classList.remove("_not-active-item");
            el.closest(".option-taste_item").setAttribute("data-active", "false");
            el.closest(".option-taste_item").querySelector(".option-taste_input").value = 1;
        });
    }

    // Function to check the total quantity of selected tastes
    function checkActiveElem() {
        activeElem = 0
        labelsTaste.forEach(el => {
            const currentTaste = el.closest(".option-taste_item");
            if (currentTaste.classList.contains("_active-item")) {
                activeElem += Number(el.querySelector(".option-taste_input").value)
            }
        })
        return activeElem;
    }
    // Function to remove non-numeric symbols from a string
    function removeSymbols(string) {
        let cleanedString = string.replace(/[^0-9]+/g, '');
        return cleanedString;
    }

    // Function to create hidden input fields for selected tastes
    function createlineProperties() {
        const line = [];
        const activeTaste = Array.from(optionTaste).filter((el) => el.classList.contains("_active-item"));
        activeTaste.forEach((el) => {
            const lineItem = {
                name: el.querySelector("[data-name]").dataset.name,
                count: el.querySelector(".option-taste_input").value,
            };
            line.push(lineItem);
        });
        if (line.length === 0) return;
        const inputHtmlLineProperties = line.map((el, index) => {
            return (
                `<input type="hidden" name="properties[Taste ${index + 1}]" value="${el.name} - ${el.count}" >`
            )
        })
        containerFields.innerHTML = ""
        inputHtmlLineProperties.forEach(el => {
            let item = document.createElement("span");
            item.innerHTML = el
            containerFields.appendChild(item);
        })
    }

    // Function to check if the plus button should be disabled
    function disabledButtonPlusQuantity() {
        let quntityPlus = 0
        labelsTaste.forEach(el => {
            const currentTaste = el.closest(".option-taste_item");
            if (currentTaste.classList.contains("_active-item")) {
                quntityPlus += Number(el.querySelector(".option-taste_input").value)
            }
        })
        if (howAvalibleTaste === quntityPlus) {
            return true
        } else {
            return false
        }
    }

    // Function to update text information based on selected tastes
    function changeTextInfo() {
        if (textInfo.length !== 2) return;
        if (howAvalibleTaste == 0) {
            textMain.classList.toggle("_showText", false);
            return;
        }
        textInfo[0].innerHTML = howAvalibleTaste + (howAvalibleTaste === 1 ? " taste" : " tastes");
        textInfo[1].innerHTML = howAvalibleTaste + (howAvalibleTaste === 1 ? " pack" : " packs");
        textMain.classList.toggle("_showText", checkActiveElem() !== howAvalibleTaste);

    }

    // Function to disable 'Add to Cart' button based on conditions
    function disabledAddToCart() {
        if (howAvalibleTaste === checkActiveElem() && howAvalibleTaste !== 0) {
            buttonAddToCart.removeAttribute("disabled");
            buttonAddToWrapper.removeEventListener("click", scrollTo);
        } else {
            setTimeout(() => {
                buttonAddToCart.setAttribute("disabled", "true");
                buttonAddToWrapper.addEventListener("click", scrollTo);
            }, 0);
        }
    }

     // Function to show or hide the sticky 'Add' button
    function showStickyAdd() {
        if (!isVisibleRecharge) {
            stickyBtnAdd.classList.toggle("is-show", howAvalibleTaste === checkActiveElem());
        }
    }

    // Function to scroll to the main container
    function scrollTo(event) {
        const y = mainContainer.getBoundingClientRect().top + window.pageYOffset - 150;
        window.scrollTo({ top: y, behavior: "smooth" });
        textMain.classList.add("_show_anim");
        setTimeout(() => {
            textMain.classList.remove("_show_anim");
        }, 1500);
    }

    // Function to check the first selected element on page load
    function checkFirstElement() {
        document.querySelectorAll("[data-option-position='1'] .radio__input").forEach(el => {
            if (el.checked) {
                let count = removeSymbols(el.value);
                if (!count) return;
                howAvalibleTaste = Number(count);
                notActiveElement = true
            }
            // else {
            //     notActiveElement = false
            // }
        })
    }

     // Function to set the disabled state of the main container
    function setDisabledContainer() {
        mainContainer.classList.toggle("disabled", !notActiveElement)
    }

    // Function to set the maximum height for label spans
    function setMaxHeight() {
        let arrayHight = [...labelsTaste].map(el => {
            return Number(getComputedStyle(el.querySelector("span")).height.replace("px", ""));
        })
        let maxHeight = Math.max(...arrayHight);

        labelsTaste.forEach(el => {
            el.querySelector("span").style.height = maxHeight + "px"
        })

    }

    function init() {
        // Initialize the form and set initial values
        setMaxHeight()
        checkFirstElement();
        checkActiveElem();
        createlineProperties();
        changeTextInfo();
        disabledAddToCart();
        setDisabledContainer()
    }
     // Call the initialization function
    init()


    // Function to reset the form on page reload
    function resetForm() {
        window.addEventListener("pageshow", function (event) {
            var historyTraversal = event.persisted ||
                (typeof window.performance != "undefined" &&
                    window.performance.navigation.type === 2);
            if (historyTraversal) {
                // Handle page restore.
                window.location.reload();
            }
            if (performance.navigation.type == 2) {
                location.reload(true);
            }
        });
    }

})



