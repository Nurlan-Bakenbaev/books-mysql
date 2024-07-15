import { Link } from "react-router-dom";
import { useGetAllTheBooksQuery } from "../redux/books";
import BookCard from "./Card";
import { IoIosAddCircleOutline } from "react-icons/io";
const Books = () => {
  const { data, error, isLoading } = useGetAllTheBooksQuery();

  if (error) {
    return <h2> Some Error</h2>;
  }

  if (isLoading) {
    return <h2> Please wait ... Loading</h2>;
  }
  console.log(error);
  return (
    <div>
      <div className="flex flex-row justify-center  gap-2 items-center">
        <h1 className=" text-3xl my-5 font-semibold">BOOKS STORE</h1>
        <Link className="text-blue-500 text-3xl" to={"/add"}>
          <IoIosAddCircleOutline />
        </Link>
      </div>
      <div className="flex flex-row gap-3 flex-wrap justify-center">
        {data?.map(({ id, cover, title, desc, price }) => (
          <div key={id}>
            <BookCard
              id={id}
              img={cover}
              title={title}
              desc={desc}
              price={price}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
