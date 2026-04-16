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

            const displayBookName = document.getElementById("bookTitle");
            const displayEditBookName = document.getElementById("bookTitleInput");
            const displayAuthorName = document.getElementById("bookAuthor");
            const displayEditAuthorName = document.getElementById("bookAuthorInput");
            const displayReviewCount = document.getElementById("reviewCount");
            const tagsContainer = document.getElementById("tagsList");
            const tagsContainerEdit = document.getElementById("tagsListEditing");
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
            displayEditBookName.value = `${book.title}`;
            displayAuthorName.innerHTML = `${book.author}`;
            displayEditAuthorName.value = `${book.author}`;
            displayReviewCount.innerHTML = `Reviews: ${book.numReviews}`
            idHidden.innerHTML = `${book.id}`;

            document.getElementById("reviewBtn").addEventListener("click", () => showBookReviewFormOverlay(book.id));

            const tags = book.tags || [];

            tags.forEach((tagItem) => {
                const tag = (typeof tagItem === "string") ? JSON.parse(tagItem) : tagItem;
                if (tag && tag.name) {
                    let safeTagName = tag.name.replace(/\s+/g, '-');
                    tagsContainer.innerHTML += `<p class="bookIdTextTags">${tag.name}</p> <br />`;
                    tagsContainerEdit.innerHTML += `<div id="${safeTagName}" value="${tag.name}"><button type="button" class="remove-item" onclick=deleteFromTagsList('${safeTagName}')>🗑</button> <p class="bookIdTextTags">${tag.name}</p> </div > `;
                }
            });

            const genres = book.genres || [];
            const genresContainer = document.getElementById("genresContainer");
            const genresContainerEditing = document.getElementById("genresContainerEditing");
            genres.forEach((genreItem) => {
                const genre = (typeof genreItem === "string") ? JSON.parse(genreItem) : genreItem;
                if (genre && genre.name) {
                    let safeGenreName = genre.name.replace(/\s+/g, '-');
                    genresContainer.innerHTML += `<p class= "bookIdTextGenres" > ${genre.name}</p > <br />`;
                    genresContainerEditing.innerHTML += `<div id="${safeGenreName}" value="${genre.name}"> <button type="button" class="remove-item" onclick=deleteFromList('${safeGenreName}')>🗑</button> <p class="bookIdTextGenres">${genre.name}</p></div> `;
                }
            });


        }).catch(error => {
            console.error("Problem fetching book data:", error);
        });
} else {
    console.error("No book ID in url.");
}

function deleteFromList(genre) {
    let genreToDelete = document.getElementById(genre);
    genreToDelete.remove();
}

function deleteFromTagsList(tag) {
    let tagToDelete = document.getElementById(tag);
    tagToDelete.remove();
}

document.getElementById("tagsDropdownEditing")
    .addEventListener('change', async function (event) {
        const tagToAdd = event.currentTarget.value;
        const tagText = tagToAdd.replace(/-/g, ' ');
        const exists = document.getElementById(tagToAdd);
        if (exists) {
            alert("Tag has already been added.");
        } else {
            let tagsContainer = document.getElementById("tagsListEditing");
            tagsContainer.innerHTML += `<div value="${tagText}" id="${tagToAdd}"> <button type="button" class="remove-item" onclick=deleteFromTagsList("${tagToAdd}")>🗑</button> <p class="bookIdTextTags">${tagText}</p></div >`;
        }
    });

document.getElementById("genresDropdownEditing")
    .addEventListener('change', async function (event) {
        const genreToAdd = event.currentTarget.value;
        const genreText = genreToAdd.replace(/-/g, ' ');
        const exists = document.getElementById(genreToAdd);
        if (exists) {
            alert("Genre has already been added.");
        } else {
            let genresContainer = document.getElementById("genresContainerEditing");
            genresContainer.innerHTML += `<div value="${genreText}" id="${genreToAdd}"> <button type="button" class="remove-item" onclick=deleteFromList("${genreToAdd}")>🗑</button> <p class="bookIdTextTags">${genreText}</p></div >`;
        }
    });

document.getElementById("editBookForm").addEventListener("submit",
    async function (event) {
        event.preventDefault();

        const title = document.getElementById("bookTitleInput").value;
        const author = document.getElementById("bookAuthorInput").value;

        const allTags = document.getElementById("tagsListEditing").children;
        const tags = Array.from(allTags).map(tag => tag.getAttribute('value')).filter(Boolean);

        const allGenres = document.getElementById("genresContainerEditing").children;
        const genres = Array.from(allGenres).map(genre => genre.getAttribute('value')).filter(Boolean);

        const formData = {
            title: title,
            author: author,
            tags: tags,
            genres: genres,
        };

        try {
            const response = await fetch(`/books/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error("Response not ok:" + errorDetails);
            }

            const result = await response.json();
            location.reload();
        } catch (error) {
            console.error("Error editing book:", error);
            alert("Error submitting the form.");
        }
    });

// Hide and show
async function editMode() {
    runWithAuth("Whoa there! This is a Mary operation. What's the password?", () => {
        document.getElementById("viewing").style.display = "none";
        document.getElementById("editing").style.display = "block";
    });
}

function viewMode() {
    document.getElementById("viewing").style.display = "block";
    document.getElementById("editing").style.display = "none";
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

async function deleteWithButton() {
    runWithAuth("Whoa there! This is a Mary operation. What's the password?", () => {
        if (confirm("Are you sure you want to delete this book?") == true) {
            deleteBook(bookId);
        }
    });
}
