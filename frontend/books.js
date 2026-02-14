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
        { id: "author", name: "Author", width: "40%" },
        {
            id: "ratingSum",
            name: "Rating",
            width: "20%",
            formatter: (cell, row) => {
                const numReviews = Number(row.cells[3]?.data) || 1; // Assuming num_reviews is column index 3
                const ratingSum = Number(cell);
                console.log(`Data:`, row.cells);
                console.log(`Rating sum: ${ratingSum}, NumReviews: ${numReviews}`);
                if (isNaN(ratingSum) || isNaN(numReviews) || numReviews <= 0) {
                    return `⭐ 0.0`;
                }
                return `⭐ ${(ratingSum / numReviews).toFixed(1)}`;
            },
        },
        { id: "numReviews", name: "Reviews", hidden: true }, // Helper column for math
        { id: "id", name: "ID", hidden: true },
    ],
    data: [],
    sort: true,
    pagination: {
        limit: 10,
        summary: true,
        buttonsCount: 3,
    },
    search: false, // We are using our own search bar
    //are we actually?
    language: { noRecordsFound: "No books matched your search." },
});

grid.render(document.getElementById("table-wrapper"));

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('tableButton')) {
        event.preventDefault();

        const bookId = event.target.getAttribute('data-id');//data- is an attribute. followed by my custom name "id"
        console.log(bookId);
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

        console.log("Books:", books);

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

window.onload = async function () {
    try {
        const response = await fetch("/books");
        const rawJson = await response.json();

        grid
            .updateConfig({
                data: rawJson,
            })
            .forceRender();

        console.log("Grid updated with all books");
    } catch (err) {
        console.error("Failed to load books:", err.message);
    }
};

// Search by function
async function searchByGenre(genre) {
    try {
        const response = await fetch(`books/search/genre?genre=${genre}`);
        const books = await response.json();
        console.log(books);

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
        console.log(books);

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
        console.log(tagToSearch);
        searchByTag(tagToSearch);
    });

document.getElementById("genresDropdown")
    .addEventListener('change', async function (event) {
        const genreToSearch = event.currentTarget.value;
        console.log(genreToSearch);
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
            window.location.reload();
            hideAddBooksOverlay();
        } catch (err) {
            alert("Add new book failed:" + err.message);
        }
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

function showAddBooksOverlay() {
    const password = "password";
    let passwordEntered = prompt("Whoa there! This is a Mary operation. What's the password?");
    switch (passwordEntered) {
        case password:
            const addOverlay = document.getElementById("overlayContainer");
            addOverlay.classList.add("show");
            break;
        default:
            alert("Bye.");
    }
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
