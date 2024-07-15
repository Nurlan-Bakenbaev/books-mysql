import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { MdDeleteOutline } from "react-icons/md";
import { useDeleteOneBookMutation } from "../redux/books";

export default function BookCard({ id, img, title, desc, price }) {
  const [deleteOneBook, { isError, isLoading, isSuccess }] =
    useDeleteOneBookMutation();
  const handleDelete = async (id) => {
    try {
      await deleteOneBook(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Card sx={{ minWidth: 280, minHeight: 150 }}>
      <CardActionArea>
        <div className="w-[300px] h-[300px]">
          <img
            className=" object-cover w-full h-full"
            src={
              img ||
              "https://images.unsplash.com/photo-1515098506762-79e1384e9d8e?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt={title}
          />
        </div>
        <CardContent>
          <Typography sx={{}} gutterBottom variant="h3" component="div">
            {title}
          </Typography>
          <Typography variant="body2">{desc}</Typography>
          <Typography variant="body2">${price}</Typography>
        </CardContent>
      </CardActionArea>
      <button onClick={() => handleDelete(id)}>
        <MdDeleteOutline />
      </button>
    </Card>
  );
}
