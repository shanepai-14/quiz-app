import React from 'react';
import Chip from '@mui/material/Chip';
import { green, red, orange, grey } from '@mui/material/colors';

const StatusChip = ({ status,sx = {} }) => {
  let color = 'default';  // Default color if no status matches

  // Determine chip color based on status
  switch (status) {
    case 'enrolled':
      color = green[500]; // Green for enrolled status
      break;
    case 'pending':
      color = orange[500]; // Orange for pending status
      break;
    case 'dropped':
      color = red[500]; // Red for dropped status
      break;
    case 'completed':
      color = grey[500]; // Grey for completed status
      break;
    default:
      color = grey[300]; // Fallback color
      break;
  }

  return (
    <Chip
      label={status}
      sx={{ backgroundColor: color, color: 'white', borderRadius: '5px',...sx }}
    />
  );
};

export default StatusChip;
