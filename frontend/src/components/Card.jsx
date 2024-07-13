import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

export default function BookCard({ img, title, desc }) {
  return (
    <Card sx={{ minWidth: 280, minHeight: 150 }}>
      <CardActionArea>
        <img
          className="w-[280px]"
          src={
            img ||
            "https://images.unsplash.com/photo-1515098506762-79e1384e9d8e?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt={title}
        />
        <CardContent>
          <Typography sx={{}} gutterBottom variant="h3" component="div">
            {title}
          </Typography>
          <Typography variant="body2">{desc}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
