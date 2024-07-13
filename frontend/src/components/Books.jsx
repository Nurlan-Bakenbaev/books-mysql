import { useGetAllTheBooksQuery } from "../redux/books";
import BookCard from "./Card";

const Books = () => {
  const { data, error, isLoading } = useGetAllTheBooksQuery();

  if (error) {
    return <h2> Some Error</h2>;
  }

  if (isLoading) {
    return <h2> Please wait ... Loading</h2>;
  }
console.log(error)
  return (
    <div className="flex flex-row justify-center  items-center">
      {data?.map(({ id, cover, title, desc }) => (
        <div key={id}>
          <BookCard img={cover} title={title} desc={desc} />
        </div>
      ))}
    </div>
  );
};

export default Books;
