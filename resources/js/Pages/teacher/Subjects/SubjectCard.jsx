import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import NoDataIllustration from '@mui/icons-material/ImportContacts'
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
  if (subjects.length === 0) {
    return (
        <Box
            sx={{
                mt: 4,
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Paper
                elevation={2}
                sx={{
                    p: 4,
                    maxWidth: 400,
                    textAlign: 'center',
                    backgroundColor: 'background.paper',
                    borderRadius: 3,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                    }
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3
                    }}
                >
                    <NoDataIllustration 
                        sx={{ 
                            fontSize: 80,
                            color: 'primary.main',
                            opacity: 0.8
                        }}
                    />
                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight="medium"
                            gutterBottom
                        >
                            No Subjects Yet
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ maxWidth: 300, mx: 'auto' }}
                        >
                            When subjects are assigned, they will be displayed here.
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}
  return (
    <Grid container spacing={3} sx={{paddingLeft:{xs:3}}}>
      {subjectsWithImages.map((subject, index) => (
        <Grid item xs={11} sm={6} md={4} key={index}>
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