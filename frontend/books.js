const grid = new gridjs.Grid({
    columns: [
        {
            id: "title", name: "Title", width: "40%",
            formatter: (cell, row) => {
                const id = row.cells[4].data;
                const bookTitle = cell;
                return gridjs.html(`<button type="button" class="tableButton" title="View Details" data-id=${id}>${bookTitle}</button>`);
            }
        },
        { id: "author", name: "Author", width: "30%" },
        {
            id: "Rating",
            name: "Rating",
            width: "20%",
            data: (row) => row,
            formatter: (rowObject) => {
                const numReviews = Number(rowObject.numReviews) || 1; // Assuming num_reviews is column index 3
                const ratingSum = Number(rowObject.ratingSum);
                if (isNaN(ratingSum) || isNaN(numReviews) || numReviews <= 0) {
                    return `⭐ 0.0`;
                }
                return `⭐ ${(ratingSum / numReviews).toFixed(1)}`;
            },
            sort: {
                compare: (a, b) => {
                    const rawAvgA = a.numReviews > 0 ? a.ratingSum / a.numReviews : 0;
                    const rawAvgB = b.numReviews > 0 ? b.ratingSum / b.numReviews : 0;

                    const avgA = Number(rawAvgA.toFixed(1));
                    const avgB = Number(rawAvgB.toFixed(1));

                    if (avgA > avgB) return 1;
                    if (avgA < avgB) return -1;

                    if (a.numReviews > b.numReviews) return 1;
                    if (a.numReviews < b.numReviews) return -1;
                    return 0;
                },
            },
        },

        { id: "numReviews", name: "Reviews", width: "10%" }, // Helper column for math
        { id: "id", name: "ID", hidden: "true" },
    ],
    sort: true,
    data: [],
    pagination: {
        limit: 10,
        summary: true,
        buttonsCount: 3,
    },
    search: false, // We are using our own search bar
    //are we actually?
    language: { noRecordsFound: "No books were found." },
});

grid.render(document.getElementById("table-wrapper"));

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('tableButton')) {
        event.preventDefault();

        const bookId = event.target.getAttribute('data-id');//data- is an attribute. followed by my custom name "id"
        window.location.href = `bookDetails.html?id=${bookId}`;
    }
});

//Search function
document.getElementById("bookSearchForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const searchField = document.getElementById("bookSearch").value.trim();

    try {
        const url = searchField.length === 0 ? "/books" : `/books/search?title=${encodeURIComponent(searchField)}`;

        const response = await fetch(url);
        const books = await response.json();

        if (Array.isArray(books)) {

            grid
                .updateConfig({
                    data: books,
                })
                .forceRender();
        } else {
            console.error("NOT AN ARRAY:", books);
        }
    } catch (err) {
        console.error("Search failed:", err);
    }

});

async function resetFilters() {
    location.reload();

}


window.onload = async function () {
    try {
        const response = await fetch("/books");
        const rawJson = await response.json();

        grid
            .updateConfig({
                data: rawJson,
            })
            .forceRender();

    } catch (err) {
        console.error("Failed to load books:", err.message);
    }
};

// Search by function
async function searchByGenre(genre) {
    try {
        const response = await fetch(`books/search/genre?genre=${genre}`);
        const books = await response.json();


        if (Array.isArray(books)) {
            grid
                .updateConfig({
                    data: books,
                })
                .forceRender();
        } else {
            console.error("NOT AN ARRAY:", books);
        }
    } catch (err) {
        console.error("Search failed:", err);
    }
}

async function searchByTag(tag) {
    try {
        const response = await fetch(`books/search/tag?tag=${tag}`);
        const books = await response.json();

        if (Array.isArray(books)) {
            grid
                .updateConfig({
                    data: books,
                })
                .forceRender();
        } else {
            console.error("NOT AN ARRAY:", books);
        }
    } catch (err) {
        console.error("Search failed:", err);
    }
}

document.getElementById('backButton').addEventListener('click', function () {
    window.history.back();
});

document.getElementById("tagsDropdown")
    .addEventListener('change', async function (event) {
        const tagToSearch = event.currentTarget.value;
        searchByTag(tagToSearch);
    });

document.getElementById("genresDropdown")
    .addEventListener('change', async function (event) {
        const genreToSearch = event.currentTarget.value;
        searchByGenre(genreToSearch);
    });


document
    .getElementById("newBookForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        //gather data into a JSON object
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        data.title = formData.get("titleInput");
        data.author = formData.get("authorInput");

        //double check validation
        if (data.title.length === 0) {
            alert("Enter a title.");
            return;
        } else if (data.author.length === 0) {
            alert("Enter an author.");
            return;
        }

        try {
            await saveNewBook(data);
            hideAddBooksOverlay();
        } catch (err) {
            alert("Add new book failed:" + err.message);
        }

        location.reload();
    });

async function saveNewBook(formData) {
    const response = await fetch(encodeURI(`/books`), {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Server failed to save book.");
    }

    return true;
}

async function showAddBooksOverlay() {
    runWithAuth("Whoa there! This is a Mary operation. What's the password?", () => {
        const addOverlay = document.getElementById("overlayContainer");
        addOverlay.classList.add("show");
    });
}

function hideAddBooksOverlay() {
    const addOverlay = document.getElementById("overlayContainer");
    addOverlay.classList.remove("show");
}

document.addEventListener("click", function (event) {
    const bookReviewOverlay = document.getElementById("overlayContainer");

    if (event.target === bookReviewOverlay) {
        hideAddBooksOverlay();
    }
});

async function sortVHtL() {
    try {
        const response = await fetch(`books/search/violence?mode=1`);
        const books = await response.json();

        if (Array.isArray(books)) {
            grid
                .updateConfig({
                    data: books,
                })
                .forceRender();
        } else {
            console.error("NOT AN ARRAY:", books);
        }
    } catch (err) {
        console.error("Search failed:", err);
    }
}

async function sortVLtH() {
    try {
        const response = await fetch(`books/search/violence?mode=2`);
        const books = await response.json();

        if (Array.isArray(books)) {
            grid
                .updateConfig({
                    data: books,
                })
                .forceRender();
        } else {
            console.error("NOT AN ARRAY:", books);
        }
    } catch (err) {
        console.error("Search failed:", err);
    }
}

async function sortCHtL() {
    try {
        const response = await fetch(`books/search/cry?mode=1`);
        const books = await response.json();

        if (Array.isArray(books)) {
            grid
                .updateConfig({
                    data: books,
                })
                .forceRender();
        } else {
            console.error("NOT AN ARRAY:", books);
        }
    } catch (err) {
        console.error("Search failed:", err);
    }
}

async function sortCLtH() {
    try {
        const response = await fetch(`books/search/cry?mode=2`);
        const books = await response.json();

        if (Array.isArray(books)) {
            grid
                .updateConfig({
                    data: books,
                })
                .forceRender();
        } else {
            console.error("NOT AN ARRAY:", books);
        }
    } catch (err) {
        console.error("Search failed:", err);
    }
}

async function sortTMostRecent() {
    try {
        const response = await fetch(`books/search/time`);
        const books = await response.json();

        if (Array.isArray(books)) {
            grid
                .updateConfig({
                    data: books,
                })
                .forceRender();
        } else {
            console.error("NOT AN ARRAY:", books);
        }
    } catch (err) {
        console.error("Search failed:", err);
    }
}
