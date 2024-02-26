// Selecting the load more button, parent blog container, and spinner
const buttonLoad = document.querySelector(".blog-post-load");
const parentBlog = document.querySelector(".blog-side_left .blog-post");
const spinner = document.querySelector(".spinner");

// Parsing JSON settings from the load more button's dataset
let jsonSettings = JSON.parse(buttonLoad.dataset.settings);

// Checking if the load more button exists
if (buttonLoad) {
  // Adding click event listener to the load more button
  buttonLoad.addEventListener("click", handleClick);
  // Checking if it's the last page initially
  checkLastPage();
}

// Function to handle click event on the load more button
async function handleClick(event) {
  event.preventDefault();

  // Checking if the 'next' property exists in the JSON settings
  if (jsonSettings.hasOwnProperty("next")) {
    const { url } = jsonSettings.next;

    try {
      // Displaying the spinner while fetching data
      showSpinner();

      // Fetching HTML content from the specified URL
      const response = await fetch(url);
      const data = await response.text();

      // Creating a temporary div to parse the HTML content
      const div = document.createElement("div");
      div.innerHTML = data;

      // Extracting article elements and the next load more settings
      const arrayArticle = div.querySelectorAll(".blog-post__item");
      const nextLoadMore = JSON.parse(div.querySelector(".blog-post-load").dataset.settings);

      // Updating JSON settings and appending new articles to the parent blog
      jsonSettings = nextLoadMore;
      arrayArticle.forEach(el => {
        parentBlog.append(el);
      });
    } catch (error) {
      console.error("An error occurred while fetching the next HTML:", error);
    } finally {
      // Hiding the spinner and checking if it's the last page
      hideSpinner();
      checkLastPage();
    }
  }
}

// Function to display the spinner
function showSpinner() {
  buttonLoad.style.opacity = 0;
  spinner.style.display = "flex";
}

// Function to hide the spinner
function hideSpinner() {
  buttonLoad.style.opacity = 1;
  spinner.style.display = "none";
}

// Function to check if it's the last page and hide the button accordingly
function checkLastPage() {
  if (!jsonSettings.hasOwnProperty("next")) {
    buttonLoad.style.opacity = 0;
  }
}
