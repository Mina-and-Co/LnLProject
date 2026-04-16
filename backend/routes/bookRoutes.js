const express = require("express");
const router = express.Router();
const bookService = require("../services/bookService");
const authService = require("../services/authService");


router.dbReady = bookService.dbReady;

router.post("/login", async (req, res) => {
  try {
    const success = await authService.login(req.body.password);
    if (success) {
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    res.sendStatus(500);
  }
});

router.get("/books", async (_req, res) => {
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

    res.status(500).json({ error: `Failed to search books by tag: ${tagToSearch}` });
  }
});

router.get('/books/search/violence', async (req, res) => {
  const mode = req.query.mode;
  try {
    if (mode == 1) {
      const books = await bookService.sortByViolenceHighToLow();
      res.json(books);
    } else {
      const books = await bookService.sortByViolenceLowToHigh();
      res.json(books);
    }
  } catch (err) {
    console.error("Error sorting books by violence:", err);

    res.status(500).json({ error: `Failed to sort books by violence.` });
  }
});

router.get('/books/search/cry', async (req, res) => {
  const mode = req.query.mode;
  try {
    if (mode == 1) {
      const books = await bookService.sortByCryHighToLow();
      res.json(books);
    } else {
      const books = await bookService.sortByCryLowToHigh();
      res.json(books);
    }
  } catch (err) {
    console.error("Error sorting books by sadness:", err);

    res.status(500).json({ error: `Failed to sort books by sadness.` });
  }
});

router.get('/books/search/time', async (req, res) => {
  try {
    const books = await bookService.SortByTime();
    res.json(books);
  } catch (err) {
    console.error("Error sorting books by last updated:", err);

    res.status(500).json({ error: `Failed to sort books by last updated.` });
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
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put("/books/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const formData = req.body;

  try {
    await bookService.editBook(id, formData);
    res.status(200).json({ message: "Book successfully updated!" });
  } catch (err) {
    console.error("Error updating:", err.message);
    res.status(500).send(err.message);
  }
});

router.post("/book/review/:id", async (req, res) => {
  try {
    await bookService.saveReview(req.params.id, req.body);
    res.status(201).send();
  } catch (err) {
    res.status(500).send(err.message);
  }

});


module.exports = router;
