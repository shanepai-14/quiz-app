import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText,
  Box,
  Skeleton,
} from '@mui/material';
import { styled } from '@mui/system';

// Reuse your CustomListItem styling
const CustomListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  boxShadow: theme.shadows[1],
}));


const QuizListSkeleton = ({ count = 3 }) => {
  return (
    <List>
      {[...Array(count)].map((_, index) => (
        <CustomListItem
          key={index}
          secondaryAction={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Time limit skeleton */}
              <Skeleton variant="circular" width={40} height={40} />
              
              {/* Score/status skeleton */}
              <Box sx={{ textAlign: 'end' }}>
                <Skeleton variant="text" width={60} height={24} />
                <Skeleton variant="text" width={40} height={20} />
              </Box>
            </Box>
          }
        >
          <ListItemAvatar>
            <Skeleton variant="circular" width={40} height={40} />
          </ListItemAvatar>

          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Skeleton variant="text" width={200} height={32} />
                <Skeleton variant="rounded" width={100} height={24} />
              </Box>
            }
            secondary={
              <Box sx={{ mt: 1 }}>
                <Skeleton variant="text" width={180} height={20} />
                <Skeleton variant="text" width={160} height={20} />
              </Box>
            }
          />
        </CustomListItem>
      ))}
    </List>
  );
};


export default QuizListSkeleton;