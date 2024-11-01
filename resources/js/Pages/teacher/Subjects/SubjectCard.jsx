import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const images = [
  "https://gstatic.com/classroom/themes/img_code.jpg",
  "https://gstatic.com/classroom/themes/img_graduation.jpg",
  "https://gstatic.com/classroom/themes/img_backtoschool.jpg",
  "https://gstatic.com/classroom/themes/img_hobby.jpg",
  "https://www.gstatic.com/classroom/themes/img_reachout.jpg"
];

const SubjectCard = ({ title, description, onShare, onLearnMore, image, }) => {

  const [currentImage, setCurrentImage] = React.useState(image);

  const handleImageError = () => {
    setCurrentImage('/assets/background/overlay_3.jpg');
  };

  return (
    <Card  sx={{ maxWidth: 345, boxShadow: 5, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        alt={title}
        height="140"
       image={currentImage}
       onError={handleImageError}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onShare}>Share</Button>
        <Button size="small" onClick={onLearnMore}>View More</Button>
      </CardActions>
    </Card>
  );
}



const SubjectCardGrid = ({ subjects, setRoomCode , handleOpenCodeDialog }) => {
  const subjectsWithImages = React.useMemo(() => {
    return subjects.map((subject, index) => ({
      ...subject,
      image: images[index % images.length]
    }));
  }, [subjects]);
  if (subjects.length === 0) return <Typography variant="h3" sx={{mt:2}}>No Subjects assigned yet !</Typography>
  return (
    <Grid container spacing={3}>
      {subjectsWithImages.map((subject, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <SubjectCard
            title={subject.subject.name}
            description={subject.subject.description}
            onShare={() => handleOpenCodeDialog(subject.room_code)}
            onLearnMore={() => setRoomCode(subject.room_code,subject.id)}
            image={subject.image}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export { SubjectCard, SubjectCardGrid };