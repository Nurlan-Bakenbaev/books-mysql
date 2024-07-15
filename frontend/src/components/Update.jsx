import { useEffect, useState } from "react";
import { useUpdateOneBookMutation } from "../redux/books";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const Add = () => {
  const [book, setBook] = useState({
    title: null,
    desc: null,
    cover: null,
    price: null,
  });
  const { id } = useParams();
  const [updateOneBook, { isLoading, isError, error: postError }] =
    useUpdateOneBookMutation();
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/book/${id}`);
        setBook(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBook();
  }, [id]);
  const navigate = useNavigate();
  const handleBook = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };
  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      await updateOneBook({ id, ...book });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
    console.log(postError);
  };
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h1 className="text-3xl">Update the Book</h1>
      <form className="flex min-w-[320px]  flex-col">
        <input
          name="title"
          value={book.title}
          type="text"
          placeholder="Title"
          onChange={handleBook}
        />
        <input
          name="price"
          value={book.price}
          type="number"
          placeholder="Price"
          onChange={handleBook}
        />
        <textarea
          rows={5}
          name="desc"
          value={book.desc}
          type="text"
          placeholder="Annotation..."
          onChange={handleBook}
        />
        <input
          name="cover"
          value={book.cover}
          type="text"
          onChange={handleBook}
          placeholder="Cover URL link"
        />
        <button className="text-center" onClick={handleUpdateBook}>
          Add
        </button>
      </form>
    </div>
  );
};

export default Add;
