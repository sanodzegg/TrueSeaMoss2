document.addEventListener("DOMContentLoaded", function () {
    // Check if the window width is less than 999 pixels
    if (window.innerWidth < 999) {
        // Selecting DOM elements
        const stickyWrapper = document.querySelector(".blog-tag-sticky");
        const stickyTagLists = document.querySelector(".blog-tag-sticky .blog-tags-list");
        const stickyButtonTag = document.querySelector(".tag-sticky_button");

        // Add a click event listener to the sticky tags button
        stickyButtonTag.addEventListener("click", function (event) {
            event.preventDefault();
            const flagShow = stickyWrapper.dataset.show;
            // Calculate maximum height and bottom position for animation
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

        // Function to set attributes of the sticky wrapper
        function setStickyWrapperAttributes(show, maxHeight, bottom) {
            stickyWrapper.setAttribute("data-show", show);
            stickyTagLists.style.maxHeight = maxHeight;
            stickyTagLists.style.bottom = bottom;
        }

        // Initialize the variable to store the last scroll position
        let lastScrollPos = window.pageYOffset;

        function toggleStickyElement() {
            const currentScrollPos = window.pageYOffset - 50;

            stickyWrapper.classList.toggle("_active", currentScrollPos > lastScrollPos);

            lastScrollPos = currentScrollPos;
        }

        // Function to check and close open tags when scrolling
        function checkOpenTags() {
            const flagShow = stickyWrapper.dataset.show;

            if (flagShow === "true" && !stickyWrapper.classList.contains("_active")) {
                setStickyWrapperAttributes("false", "0px", "0px");
            }
        }

         // Add a scroll event listener to toggle the sticky element and check open tags
        window.addEventListener("scroll", function () {
            toggleStickyElement();
            checkOpenTags();
        });

    }

})