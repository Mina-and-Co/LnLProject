const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../libraryData.json");

//Load the books from file
function loadBooks() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            console.error("Data file not found.")
            return [];
        }

        const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
        return JSON.parse(fileContent);
   } catch(error) {
    console.error("Error loading books:", error);
    return[];
   }
}

//Get all books
function getBooks() {
    return loadBooks();
}

function saveReview(id, formData, callback) {
    const books = loadBooks();
    const bookIndex = books.findIndex((b) => b.id === id);

    if (bookIndex !== -1) {
        const book = books[bookIndex];

        const newRating = Number(formData.finalRating) || 0;
        const newViolence = Number(formData.violence) || 0;
        const newCry = Number(formData.cry === "yes" ? 5 : 1); //Maybe change the cry value in the HTML so that there's not as much math in the backend?
        //Change "yes" to checked? Check what the box returns

        //updating the book in the list with new computed data
        book.ratingAvg = Number(((book.ratingAvg + newRating) / 2).toFixed(1));
        book.violenceAvg = Number(((book.violenceAvg + newViolence) / 2).toFixed(1));
        book.cryAvg = Number(((book.cryAvg + newCry) / 2).toFixed(1));

        book.tags = [...new Set([...book.tags, ...(formData.tags || [])])];
        book.genres = [...new Set([...book.genres, ...(formData.genres || [])])];

        fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2), "utf-8", callback);

    } else {
        callback(new Error("Book not found in database"));
    }
}

module.exports = {
    getBooks,
    saveReview
};
