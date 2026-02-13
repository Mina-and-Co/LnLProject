//Remember to change all of the ids and stuff in the html

let allBooks = [];
let booksLoaded = false;

async function fetchBooks() {
  if (booksLoaded) {
    return;
  }

  try {
    const response = await fetch("/books");
    allBooks = await response.json();
    booksLoaded = true;

    const titleList = document.getElementById("titleData");
    titleList.innerHTML = "";

    allBooks.forEach((book) => {
      let option = document.createElement("option");
      option.value = `${book.title} - ${book.author}`;
      titleList.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading library data:", error);
  }
}

//Book selection overlay (overlay 0)
//----------------------------------
function showBookSelectionOverlay() {
  fetchBooks();
  resetBookSelectionForm();

  const overlay = document.getElementById("bookSelectionOverlay"); //remember to change the id in the HTML
  overlay.classList.add("show");
}

function hideBookSelectionOverlay() {
  const overlay = document.getElementById("bookSelectionOverlay");
  overlay.classList.remove("show");
}

function toggleProceedButton() {
  const userInput = document.getElementById("selectedBook").value;
  const proceedBtn = document.getElementById("proceed");

  const isValid = allBooks.some(
    (b) => `${b.title} - ${b.author}` === userInput,
  );
  proceedBtn.disabled = !isValid;
}

function resetBookSelectionForm() {
  document.getElementById("selectedBook").value = "";
  toggleProceedButton();
}

//Book review form overlay
//------------------------
function showBookReviewFormOverlay() {
  const userInput = document.getElementById("selectedBook").value;
  const selectedBook = allBooks.find(
    (b) => `${b.title} - ${b.author}` === userInput,
  );

  if (selectedBook) {
    document.getElementById("bookName").textContent =
      `Reviewing: ${selectedBook.title} by ${selectedBook.author}`;

    const form = document.getElementById("bookReviewForm");
    form.action = `/book/review/${selectedBook.id}`;

    hideBookSelectionOverlay();
    resetBookReviewForm();

    const reviewOverlay = document.getElementById("bookReviewOverlay");
    reviewOverlay.classList.add("show");
  }
}

function hideBookReviewFormOverlay() {

  const overlay = document.getElementById("bookReviewOverlay");
  overlay.classList.remove("show");
}

//Book Review Form
//----------------
function resetBookReviewForm() {
  setStarRating(1);
  const form = document.getElementById("bookReviewForm");
  if (form) {
    form.reset();
  }

  validateBookReviewForm();
}

function validateBookReviewForm() {
  const form = document.getElementById("bookReviewForm");
  const submitBtn = document.getElementById("bookReviewFormSubmitBtn");
  if (!submitBtn) {
    return;
  }

  const genres =
    document.querySelectorAll('input[name="genres"]:checked').length > 0;
  const tags =
    document.querySelectorAll('input[name="tags"]:checked').length > 0;

  submitBtn.disabled = !(form.checkValidity() && genres && tags);
}

document
  .getElementById("bookReviewForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    //double check validation
    const genresChecked = document.querySelectorAll(
      'input[name="genres"]:checked',
    ).length;
    if (genresChecked === 0) {
      alert("Please select at least one genre.");
      return;
    }

    //gather data into a JSON object
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    data.tags = formData.getAll("tags");
    data.genres = formData.getAll("genres");
    try {
      //handle the checkboxes
      const response = await fetch(this.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      //check the response for errors
      if (response.ok) {
        //success :)
        hideBookReviewFormOverlay();
        window.alert("Thank you! Your response has been documented.");
        //window.location.href = "/index.html";
      } else {
        //server encountered an error :(
        const errorText = await response.text();
        alert("Submission failed:" + errorText);
      }
    } catch (error) {
      //Network or system error
      console.error("Network error:", error);
      alert("Could not reach the server. Please check you connection.");
    }
  });

//Star Rating
let stars = document.getElementsByClassName("star");

function setStarRating(rating) {
  clearStars();

  let colorClass;
  switch (rating) {
    case 1:
      colorClass = "one";
      break;
    case 2:
      colorClass = "two";
      break;
    case 3:
      colorClass = "three";
      break;
    case 4:
      colorClass = "four";
      break;
    case 5:
      colorClass = "five";
      break;
  }

  for (let i = 0; i < rating; i++) {
    stars[i].className = "star " + colorClass;
  }

  document.getElementById("output").innerText = rating;

  const radioButton = document.getElementById("rating" + rating);
  if (radioButton) {
    radioButton.checked = true;
  }
}

function clearStars() {
  for (let i= 0; i < 5; i++) {
    stars[i].className = "star";
  }
}

//Close on an outside click
document.addEventListener("click", function (event) {
    const bookSelectionOverlay = document.getElementById("bookSelectionOverlay");
    const bookReviewOverlay = document.getElementById("bookReviewOverlay");

    if (event.target === bookSelectionOverlay) {
        hideBookSelectionOverlay();
    }

    if (event.target === bookReviewOverlay) {
        hideBookReviewFormOverlay();
    }
});
