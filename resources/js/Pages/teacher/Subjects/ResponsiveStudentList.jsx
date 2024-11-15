import { 
    List, 
    ListItem, 
    ListItemAvatar, 
    ListItemText, 
    ListItemSecondaryAction,
    Avatar, 
    Chip, 
    Typography,
    Box,
    useTheme,
    useMediaQuery,
    Stack
  } from '@mui/material';
  
  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

  const ResponsiveStudentList = ({ enrolledStudents, handleStudentClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
    const stringAvatar = (name) => ({
      sx: {
        bgcolor: stringToColor(name),
        width: { xs: 35, sm: 40 },
        height: { xs: 35, sm: 40 },
        fontSize: { xs: '0.9rem', sm: '1.1rem' }
      },
      children: name,
    });
  
    return (
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {enrolledStudents.length > 0 ? (
          enrolledStudents.map((enrollment) => (
            <ListItem
              key={enrollment.id}
              onClick={() => handleStudentClick(enrollment.student.id)}
              sx={{
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                padding: { xs: 2, sm: 3 },
                gap: { xs: 1, sm: 2 },
                borderBottom: 1,
                borderColor: 'divider'
              }}
            >
              {/* Mobile Layout */}
              {isMobile ? (
                <Stack spacing={1} width="100%">
                  <Box display="flex" alignItems="center" gap={1}>
                    <ListItemAvatar>
                      <Avatar
                        {...stringAvatar(
                          `${enrollment.student.first_name[0]} ${enrollment.student.last_name[0]}`
                        )}
                      />
                    </ListItemAvatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {`${enrollment.student.first_name} ${enrollment.student.last_name}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        {enrollment.student.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={`Average: ${enrollment.average_score}%`}
                    color={
                      enrollment.average_score >= 75
                        ? "success"
                        : enrollment.average_score >= 50
                        ? "warning"
                        : "error"
                    }
                    variant="outlined"
                    size="small"
                    sx={{ 
                      alignSelf: 'flex-center' }}
                  />
                </Stack>
              ) : (
                // Tablet and Desktop Layout
                <>
                  <ListItemAvatar>
                    <Avatar
                      {...stringAvatar(
                        `${enrollment.student.first_name[0]} ${enrollment.student.last_name[0]}`
                      )}
                    />
                  </ListItemAvatar>
  
                  <ListItemText
                    primary={
                      <Typography 
                        variant={isTablet ? "body1" : "subtitle1"}
                        sx={{ fontWeight: 500 }}
                      >
                        {`${enrollment.student.first_name} ${enrollment.student.last_name}`}
                      </Typography>
                    }
                    secondary={
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          fontSize: { sm: '0.8rem', md: '0.875rem' },
                          display: { sm: 'block', md: 'block' }
                        }}
                      >
                        {enrollment.student.email}
                      </Typography>
                    }
                  />
  
                  <ListItemSecondaryAction>
                    <Chip
                      label={`Average: ${enrollment.average_score}%`}
                      color={
                        enrollment.average_score >= 75
                          ? "success"
                          : enrollment.average_score >= 50
                          ? "warning"
                          : "error"
                      }
                      variant="outlined"
                      size={isTablet ? "small" : "medium"}
                      sx={{
              
                        '& .MuiChip-label': {
                          fontSize: { sm: '0.75rem', md: '0.875rem' }
                        }
                      }}
                    />
                  </ListItemSecondaryAction>
                </>
              )}
            </ListItem>
          ))
        ) : (
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ 
              padding: { xs: 2, sm: 3 },
              textAlign: 'center',
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            No student enrolled
          </Typography>
        )}
      </List>
    );
  };
  
  export default ResponsiveStudentList;