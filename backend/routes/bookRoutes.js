const express = require("express");
const router = express.Router();
const bookService = require("../services/bookService");
const { Database } = require("sqlite3");

router.dbReady = bookService.dbReady;

router.get("/books", async (_, res) => {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to get books." });
  }
});

router.put("/books", async (req, res) => {
  try {
    await bookService.addBook(req.body);
    res.status(201).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/books/search', async (req, res) => {
  try {
    const titleToSearch = req.query.title;//title

    const books = await bookService.searchBooksByTitle(titleToSearch);
    res.json(books);
  } catch (err) {
    console.error("Error searching books by title:", err);
    res.status(500).json({ error: `Failed to search books by title: ${titleToSearch}` });
  }
});

router.get('/books/search/genre', async (req, res) => {
  const genreToSearch = req.query.genre;
  try {

    const books = await bookService.searchBooksByGenre(genreToSearch);
    res.json(books);
  } catch (err) {
    console.error("Error searching books by genre:", err);
    console.log("Request details:", req.query);
    res.status(500).json({ error: `Failed to search books by genre: ${genreToSearch}` });
  }
});

router.get('/books/search/tag', async (req, res) => {
  const tagToSearch = req.query.tag;
  try {

    const books = await bookService.searchBooksByTag(tagToSearch);
    res.json(books);
  } catch (err) {
    console.error("Error searching books by tag:", err);
    console.log("Request details:", req.query);
    res.status(500).json({ error: `Failed to search books by tag: ${tagToSearch}` });
  }
});

router.get("/books/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const book = await bookService.searchForId(id);
    if (!book) {
      return res.status(404).send("Book not found.");
    }
    res.json(book);
  } catch (err) {
    console.error("Error fetching book:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/books/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await bookService.deleteBook(id);
    res.status(204).send()
  } catch (err) {
    res.status(500).send(err.message);
  }
})

router.post("/book/review/:id", async (req, res) => {
  try {
    await bookService.saveReview(req.params.id, req.body);
    res.status(201).send();
  } catch (err) {
    res.status(500).send(err.message);
  }

});


module.exports = router;
