  const buttonLoad = document.querySelector(".blog-post-load");
  const parentBlog = document.querySelector(".blog-side_left .blog-post");
  const spinner = document.querySelector(".spinner");
  let jsonSettings = JSON.parse(buttonLoad.dataset.settings);
  
  if (buttonLoad) {
    buttonLoad.addEventListener("click", handleClick);
    checkLastPage()
  }
  
  async function handleClick(event) {
    event.preventDefault();
    if (jsonSettings.hasOwnProperty("next")) {
      const { url } = jsonSettings.next;
      try {
        showSpinner();
        const response = await fetch(url);
        const data = await response.text();
        const div = document.createElement("div");
        div.innerHTML = data;
        const arrayArticle = div.querySelectorAll(".blog-post__item");
        const nextLoadMore = JSON.parse(div.querySelector(".blog-post-load").dataset.settings);
        jsonSettings = nextLoadMore;
        arrayArticle.forEach(el => {
          parentBlog.append(el);
        });
      } catch (error) {
        console.error("An error occurred while fetching the next HTML:", error);
      } finally {
        hideSpinner();
        checkLastPage();
      }
    }
  }

  function showSpinner() {
    buttonLoad.style.opacity = 0;
    spinner.style.display = "flex";
  }

  function hideSpinner() {
    buttonLoad.style.opacity = 1;
    spinner.style.display = "none";
  }

  function checkLastPage() {
    if (!jsonSettings.hasOwnProperty("next")) {
      buttonLoad.style.opacity = 0;
    }
  }
