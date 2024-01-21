document.addEventListener("DOMContentLoaded", function () {
    resetForm();

    let howAvalibleTaste = 0;
    let activeElem = 0;
    let notActiveElement = false;
    let isVisibleRecharge = false

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
    
    const handleAddToCartClick = () => {
      if (buttonAddToCart.disabled === false) {
        buttonAddToCart.click();
      }
    };
    
    const handleScrollButtonClick = () => {
      const scrollToElement = document.querySelector(`#${stickyBtnScroll.dataset.scroll}`);
      if (scrollToElement) {
        const y = scrollToElement.offsetParent.offsetTop;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    };
    
    const handleWindowScroll = () => {
      const currentPos = window.pageYOffset;
      const stopPoint = contentRecharge?.offsetTop - (contentRecharge?.scrollHeight * 2);
    
      stickyBtnAdd?.classList.toggle("is-show", currentPos < stopPoint && !buttonAddToCart.disabled);
      stickyBtnScroll?.classList.toggle("is-show", currentPos > productWrapper.clientHeight);
    };
    
    if (stickyBtnAdd) {
      stickyBtnAdd.addEventListener("click", handleAddToCartClick);
    }
    
    if (stickyBtnScroll) {
      stickyBtnScroll.addEventListener("click", handleScrollButtonClick);
    }
    
    if (window.innerWidth < 768) {
      window.addEventListener("scroll", handleWindowScroll);
    }
    

    wrapperQuantity.forEach(el => {
        el.addEventListener("click", function (event) {
            event.stopPropagation();
        })
    })


    buttonQuantity.forEach((el) => {
        el.addEventListener("click", function (event) {
            event.stopPropagation();
            const currentTaste = event.target.closest(".option-taste_item");
            const typeButton = event.target.dataset.name;
            const input = event.target.closest(".option-taste_quantity").querySelector(".option-taste_input");
            if (typeButton === "plus" && input.value < howAvalibleTaste && !disabledButtonPlusQuantity()) {
                input.value++;
                // } else if (typeButton === "minus" && input.value > 1) {
                //     input.value--;
                // }
            } else if (typeButton === "minus") {
                input.value > 1 ? input.value-- : handlerLabelTaste(event);
            }
            let nowActiveElement = checkActiveElem();
            let maxActiveElement = howAvalibleTaste;
            disabledTaste(nowActiveElement, maxActiveElement);
            changeTextInfo();
            disabledAddToCart();
            createlineProperties();
        });
    });

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

    labelsTaste.forEach((el) => {
        el.addEventListener("click", handlerLabelTaste)
    })

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
        let nowActiveElement = checkActiveElem();
        let maxActiveElement = howAvalibleTaste;
        disabledTaste(nowActiveElement, maxActiveElement);
        createlineProperties();
        changeTextInfo();
        disabledAddToCart();
        setDisabledContainer();
        showStickyAdd();
    }

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

    function resetElement() {
        labelsTaste.forEach((el, index) => {
            el.closest(".option-taste_item").classList.remove("_active-item");
            el.closest(".option-taste_item").classList.remove("_not-active-item");
            el.closest(".option-taste_item").setAttribute("data-active", "false");
            el.closest(".option-taste_item").querySelector(".option-taste_input").value = 1;
        });
        // labelsTaste[0].closest(".option-taste_item").classList.add("_active-item");
        // labelsTaste[0].closest(".option-taste_item").setAttribute("data-active", "true");
    }

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
    function removeSymbols(string) {
        let cleanedString = string.replace(/[^0-9]+/g, '');
        return cleanedString;
    }

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

    function changeTextInfo() {

        // arrayValues;
        // maxValue ;
        if (textInfo.length !== 2) return;
        if (howAvalibleTaste == 0) {
            textMain.classList.toggle("_showText", false);
            return;
        }
        // const positionArray = arrayValues.indexOf(howAvalibleTaste.toString());

        textInfo[0].innerHTML = howAvalibleTaste + (howAvalibleTaste === 1 ? " taste" : " tastes");
        textInfo[1].innerHTML = howAvalibleTaste + (howAvalibleTaste === 1 ? " pack" : " packs");
        textMain.classList.toggle("_showText", checkActiveElem() !== howAvalibleTaste);
        // if ( arrayValues[positionArray + 1]) {
        //     textInfoNext[0].innerHTML = arrayValues[positionArray + 1];
        //     textInfoNext[1].innerHTML = arrayValues[positionArray + 1];    
        // }
        // textMainNext.classList.toggle("_showText", checkActiveElem() === howAvalibleTaste && arrayValues[positionArray + 1] != undefined );


    }

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

    function showStickyAdd() {
        if (!isVisibleRecharge) {
            stickyBtnAdd.classList.toggle("is-show", howAvalibleTaste === checkActiveElem());
        }
    }

    function scrollTo(event) {
        const y = mainContainer.getBoundingClientRect().top + window.pageYOffset - 150;
        window.scrollTo({ top: y, behavior: "smooth" });
        textMain.classList.add("_show_anim");
        setTimeout(() => {
            textMain.classList.remove("_show_anim");
        }, 1500);
    }

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

    function setDisabledContainer() {
        mainContainer.classList.toggle("disabled", !notActiveElement)
    }

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
        setMaxHeight()
        checkFirstElement();
        checkActiveElem();
        createlineProperties();
        changeTextInfo();
        disabledAddToCart();
        setDisabledContainer()
    }
    init()


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



