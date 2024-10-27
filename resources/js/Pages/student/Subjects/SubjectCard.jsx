import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import { Box } from '@mui/material';
import StatusChip from './StatusChip';
import CodeDisplayDialog from './CodeDisplayDialog';

const images = [
  "https://gstatic.com/classroom/themes/img_code.jpg",
  "https://gstatic.com/classroom/themes/img_graduation.jpg",
  "https://gstatic.com/classroom/themes/img_backtoschool.jpg",
  "https://gstatic.com/classroom/themes/img_hobby.jpg",
  "https://www.gstatic.com/classroom/themes/img_reachout.jpg"
];

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      position: 'absolute',
      bottom: -30,
     right: 30,
     width: 66,
      height: 66
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

const SubjectCard = ({ title, description, onShare, onLearnMore, image,teacher,status }) => {
  const isDisabled = ['pending', 'declined', 'dropped'].includes(status);

  const [currentImage, setCurrentImage] = React.useState(image);

  const handleImageError = () => {
    setCurrentImage('/assets/background/overlay_3.jpg');
  };
  return (
    <Card 
    sx={{ maxWidth: 345, boxShadow: 5, height: '100%', display: 'flex', flexDirection: 'column' ,
      opacity: isDisabled ? 0.7 : 1,  // Lower opacity when disabled
      pointerEvents: isDisabled ? 'none' : 'auto',  // Disable mouse events when disabled
      cursor: isDisabled ? 'not-allowed' : 'pointer',
        // Change cursor to "not-allowed" when disabled

    }}>
     <Box sx={{ position: 'relative' }}>
    <CardMedia
      component="img"
      alt={title}
      height="140"
      image={currentImage}
      onError={handleImageError}
      sx={{
        backgroundColor: '#2962ff',
        filter: 'brightness(0.7)' 
      }}
   // Optional: Add a filter to darken the image to improve text visibility
    />
    <Typography
      variant="h6"
      component="div"
      sx={{
        position: 'absolute',
        bottom: 30,
        left: 16,
        color: 'white',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)', // Optional: Add text shadow for better contrast
      }}
    >
      {title} {/* Text to display on top of the image */}
    </Typography>
    <Typography
    
    variant="body2" sx={{ color: 'text.secondary',
      position: 'absolute',
      bottom: 8,
      left: 16,
      color: 'white',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',

    }}>
          {description}
        </Typography>
        <Avatar  {...stringAvatar(teacher)} />
        <StatusChip sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          color: 'white',
          borderRadius:10,
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)', // Optional: Add text shadow for better contrast
        }} status={status} />
  </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {teacher}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onShare}>Share</Button>
        <Button size="small" onClick={isDisabled ? null : onLearnMore}>View More</Button>
      </CardActions>
    </Card>
  );
}



const SubjectCardGrid = ({ subjects, setRoomCode,handleOpenCodeDialog }) => {

  const subjectsWithImages = React.useMemo(() => {
    return subjects.map((subject, index) => ({
      ...subject,
      image: images[index % images.length]
    }));
  }, [subjects]);

   console.log('subjects',subjects);

   if (subjects.length === 0) return <Typography variant="h3" sx={{ mt:2 }}>No Subjects assigned yet !</Typography>

  return (
    <Grid container spacing={3}>
      {subjectsWithImages.map((subject, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <SubjectCard
           teacher={`${subject.classroom.teacher.first_name} ${subject.classroom.teacher.last_name}`}
            title={subject.classroom.subject.name}
            description={subject.classroom.subject.description}
            onShare={() => handleOpenCodeDialog(subject.classroom.room_code)}
            onLearnMore={() => setRoomCode(subject.classroom.room_code,subject.classroom.id)}
            image={subject.image}
            status={subject.status}
          />
     
        </Grid>
      ))}
    </Grid>
  );
}

export { SubjectCard, SubjectCardGrid };