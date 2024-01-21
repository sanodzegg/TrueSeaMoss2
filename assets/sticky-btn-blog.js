document.addEventListener("DOMContentLoaded", function () {
    if (window.innerWidth < 999) {
        const stickyWrapper = document.querySelector(".blog-tag-sticky");
        const stickyTagLists = document.querySelector(".blog-tag-sticky .blog-tags-list");
        const stickyButtonTag = document.querySelector(".tag-sticky_button");

        stickyButtonTag.addEventListener("click", function (event) {
            event.preventDefault();
            const flagShow = stickyWrapper.dataset.show;
            const maxHeight = stickyTagLists.scrollHeight + 40 + "px";
            const bottom = stickyTagLists.scrollHeight + 40 + "px";

            switch (flagShow) {
                case "false":
                    setStickyWrapperAttributes("true", maxHeight, bottom);
                    break;
                case "true":
                    setStickyWrapperAttributes("false", "0px", "0px");
                    break;
                default:
                    break;
            }
        });

        function setStickyWrapperAttributes(show, maxHeight, bottom) {
            stickyWrapper.setAttribute("data-show", show);
            stickyTagLists.style.maxHeight = maxHeight;
            stickyTagLists.style.bottom = bottom;
        }

        let lastScrollPos = window.pageYOffset;

        function toggleStickyElement() {
            const currentScrollPos = window.pageYOffset - 50;

            stickyWrapper.classList.toggle("_active", currentScrollPos > lastScrollPos);

            lastScrollPos = currentScrollPos;
        }

        function checkOpenTags() {
            const flagShow = stickyWrapper.dataset.show;

            if (flagShow === "true" && !stickyWrapper.classList.contains("_active")) {
                setStickyWrapperAttributes("false", "0px", "0px");
            }
        }

        window.addEventListener("scroll", function () {
            toggleStickyElement();
            checkOpenTags();
        });

    }

})