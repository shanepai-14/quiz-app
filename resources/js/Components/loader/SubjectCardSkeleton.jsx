import React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  Skeleton,
  Box,
} from '@mui/material';


const SubjectCardSkeleton = () => {
  return (
    <Card sx={{ 
      maxWidth: 345, 
      boxShadow: 5, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Box sx={{ position: 'relative' }}>
        {/* Media skeleton */}
        <Skeleton 
          variant="rectangular" 
          height={140}
          animation="wave"
          sx={{ backgroundColor: '#EDEFF2' }}
        />

        {/* Title overlay skeleton */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            left: 16,
            width: '70%',
          }}
        >
          <Skeleton 
            variant="text" 
            width="100%" 
            height={32}
            animation="wave"
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
          />
        </Box>

        {/* Description overlay skeleton */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 16,
            width: '50%',
          }}
        >
          <Skeleton 
            variant="text"
            width="100%"
            height={24}
            animation="wave"
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
          />
        </Box>

        {/* Avatar skeleton */}
        <Skeleton
          variant="circular"
          width={66}
          height={66}
          animation="wave"
          sx={{
            position: 'absolute',
            bottom: -30,
            right: 30,
          }}
        />

        {/* Status chip skeleton */}
        <Skeleton
          variant="rounded"
          width={80}
          height={24}
          animation="wave"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.3)'
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 5 }}>
        {/* Teacher name skeleton */}
        <Skeleton 
          variant="text" 
          width="60%" 
          height={32}
          animation="wave"
        />
      </CardContent>

      <CardActions>
        {/* Action buttons skeleton */}
        <Skeleton variant="rounded" width={60} height={30} animation="wave" sx={{ mr: 1 }} />
        <Skeleton variant="rounded" width={80} height={30} animation="wave" />
      </CardActions>
    </Card>
  );
};


const SubjectCardGridSkeleton = ({ count = 6 }) => {
  return (
    <Grid container spacing={3}>
      {[...Array(count)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <SubjectCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};


export { 
  SubjectCardSkeleton,
  SubjectCardGridSkeleton 
};