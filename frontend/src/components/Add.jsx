import { useState } from "react";
import { usePostOneBookMutation } from "../redux/books";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci"; <CiEdit />
const Add = () => {
  const [postOneBook, { isLoading, isError, error: postError }] =
    usePostOneBookMutation();
  const [book, setBook] = useState({
    title: "",
    desc: "",
    cover: "",
    price: null,
  });
  const navigate = useNavigate();
  const handleBook = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const res = await postOneBook(book);
      console.log("Response:", res);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
    console.log(postError);
  };
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h1 className="text-3xl">Create a New Book</h1>
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
        <button className="text-center" onClick={handleAddBook}>
          Add
        </button>
      </form>
    </div>
  );
};

export default Add;
