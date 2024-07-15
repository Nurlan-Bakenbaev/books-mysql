import express, { json } from "express";
import mysql from "mysql";
import cors from "cors";
import dotenv from "dotenv";
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const db = mysql.createConnection({
  host: "localhost",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: "mydb",
});
db.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Connected to the database");
});
app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
app.post("/postBook", (req, res) => {
  const { title, desc, cover, price } = req.body;
  const q =
    "INSERT INTO books (`title`, `desc`, `cover`,`price`) VALUES (?,?,?,?)";
  const values = [title, desc, cover, price];
  db.query(q, values, (err, data) => {
    if (err) {
      return console.error(err);
    }
    return res.json("Book is posted");
  });
});
//DELETE
app.delete("/deletebook/:id", (req, res) => {
  const { id } = req.params;
  const q = "DELETE FROM books WHERE id=?";
  db.query(q, [id], (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "An error occurred while deleting the book" });
    }
    return res.json("Book is deleted");
  });
});
//UPDATE
app.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { title, desc, cover, price } = req.body;
  const q =
    "UPDATE books SET `title`=?, `desc`=?, `cover`=?, `price`=? WHERE id = ?";
  const values = [title, desc, cover, price, id];
  db.query(q, values, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "An error occurred" });
    }
    return res.json("Book is updated");
  });
});
//get one book
app.get("/book/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "SELECT * FROM books WHERE id = ?";
  db.query(q, [bookId], (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: "Error fetching book details" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: "Book not found" });
    } else {
      res.json(results);
    }
  });
});
app.listen(8000, () => {
  console.log("Connected to DB");
});
