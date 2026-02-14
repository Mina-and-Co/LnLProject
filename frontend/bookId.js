function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const bookId = getQueryParam('id');

if (bookId) {
    fetch(`/books/${bookId}`)
        .then(response => {
            if (response.status === 404) {
                window.location = "/404notfound.html";
                return;
            }
            if (!response.ok) {
                throw new Error("Network response not ok");
            }
            return response.json();
        }).then(book => {
            if (!book) {
                return;
            }
            console.log("Fetched book data", book);

            const displayBookName = document.getElementById("bookTitle");
            const displayTitleName = document.getElementById("bookAuthor");
            const displayReviewCount = document.getElementById("reviewCount");
            const tagsContainer = document.getElementById("tagsList");
            const idHidden = document.getElementById("ID");

            const displayViolence = document.getElementById("violence");
            if (isNaN(book.violenceSum) || isNaN(book.numReviews) || book.numReviews <= 0) {
                const violence = `0`;
                displayViolence.innerHTML = ` 💀 ${violence}`
            } else {
                const violence = `${(book.violenceSum / book.numReviews).toFixed(1)}`;
                displayViolence.innerHTML = ` 💀 ${violence}`
            }

            const displayCry = document.getElementById("cry");
            if (isNaN(book.crySum) || isNaN(book.numReviews) || book.numReviews <= 0) {
                const cry = `0`;
                displayCry.innerHTML = ` 😢 ${cry}`
            } else {
                const cry = `${(book.crySum / book.numReviews).toFixed(1)}`;
                displayCry.innerHTML = ` 😢 ${cry}`
            }
            const displayRating = document.getElementById("rating");
            if (isNaN(book.ratingSum) || isNaN(book.numReviews) || book.numReviews <= 0) {
                const rating = `0`;
                displayRating.innerHTML = `⭐ ${rating}`
            } else {
                const rating = `${(book.ratingSum / book.numReviews).toFixed(1)}`;
                displayRating.innerHTML = `⭐ ${rating}`
            }

            displayBookName.innerHTML = `${book.title}`;
            displayTitleName.innerHTML = `${book.author}`;
            displayReviewCount.innerHTML = `Reviews: ${book.numReviews}`
            idHidden.innerHTML = `${book.id}`;

            document.getElementById("reviewBtn").addEventListener("click", () => showBookReviewFormOverlay(book.id));

            const tags = book.tags || [];
            let i = tags.length;

            while (i >= 1) {
                const tagString = tags[0];
                const tag = JSON.parse(tagString);
                if (tag && tag.name) {
                    tagsContainer.innerHTML += `<p class="bookIdTextTags">${tag.name}</p>`;
                    tags.shift();
                    i--;
                } else {
                    break;
                }
            }

            const genres = book.genres || [];
            let g = genres.length;
            const genresContainer = document.getElementById("genresContainer");
            while (g >= 1) {
                const genreString = genres[0];
                console.log(genreString);
                const genre = JSON.parse(genreString);
                if (genre && genre.name) {
                    genresContainer.innerHTML += `<p class="bookIdTextGenres">${genre.name}</p>`;
                    genres.shift();
                    g--;
                } else {
                    break;
                }
            }

        }).catch(error => {
            console.error("Problem fetching book data:", error);
        });
} else {
    console.error("No book ID in url.");
}

// Book Review Form
// --------------------------
async function showBookReviewFormOverlay(bookIdValue) {
    try {
        const response = await fetch(`/books/${bookIdValue}`);

        if (!response.ok) {
            throw new Error(`Error fetching book: ${response.statusText}`);
        }

        const selectedBook = await response.json();

        if (selectedBook) {
            document.getElementById("bookName").textContent =
                `Reviewing: ${selectedBook.title} by ${selectedBook.author}`;

            const form = document.getElementById("bookReviewForm");
            form.action = `/book/review/${selectedBook.id}`;

            resetBookReviewForm();

            const reviewOverlay = document.getElementById("bookReviewOverlay");
            reviewOverlay.classList.add("show");
        }
    } catch (error) {
        console.error("Failed to fetch book:", error);
        alert("Process failed. Try again.");
    }
}

function hideBookReviewFormOverlay() {
    console.log("Hiding overlay...");
    const overlay = document.getElementById("bookReviewOverlay");
    overlay.classList.remove("show");
    console.log("Hidden!");
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

async function saveReview(formData) {
    if (!bookId) {
        throw new Error("Book ID not valid.");
    }
    const response = await fetch(`/book/review/${bookId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Server failed to save review");
    }

    return true;
}

document
    .getElementById("bookReviewForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        //gather data into a JSON object
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        data.tags = formData.getAll("tags");
        data.genres = formData.getAll("genres");

        //double check validation
        if (data.genres.length === 0) {
            alert("Please select at least one genre.");
            return;
        }
        hideBookReviewFormOverlay();

        try {
            await saveReview(data);
            window.location.reload();
        } catch (err) {
            alert("Submit review failed:" + err.message);
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
    for (let i = 0; i < 5; i++) {
        stars[i].className = "star";
    }
}

//Close on an outside click
document.addEventListener("click", function (event) {
    const bookReviewOverlay = document.getElementById("bookReviewOverlay");

    if (event.target === bookReviewOverlay) {
        hideBookReviewFormOverlay();
    }
});

document.getElementById('backButtonBD').addEventListener('click', function () {
    window.history.back();
});

async function deleteBook(id) {
    try {
        await fetch(`/books/${id}`, {
            method: 'DELETE',
        });

        alert("This book has been deleted.");
        window.location.href = "/search.html";
    } catch (error) {
        console.error(error.message);
        alert("Process failed.");
    }
}

function deleteWithButton() {
    const password = "password";
    let passwordEntered = prompt("Whoa there! This is a Mary operation. What's the password?");
    switch (passwordEntered) {
        case password:
            if (confirm("Are you sure you want to delete this book?") == true) {
                deleteBook(bookId);
            }
            break;
        default:
            alert("Bye.");
    }
}
