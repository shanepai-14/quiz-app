import { useState } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { account } from '../../../_mock/account';
import {  useForm ,usePage ,Link } from '@inertiajs/react';
import { getDefaultAvatar } from '@/helper';

export default function AccountPopover() {
  const { props } = usePage();
    const { auth } = props;
  const { post } = useForm();

  const [open, setOpen] = useState(null);
  
  const MENU_OPTIONS = [
    {
      label: 'Home',
      icon: 'eva:home-fill',
      path: `${auth.user.role}.dashboard`
    },
    {
      label: 'Profile',
      icon: 'eva:person-fill',
      path: `${auth.user.role}.profile`
    },
    // {
    //   label: 'Settings',
    //   icon: 'eva:settings-2-fill',
    // },
  ];

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const handleLogout = (e) => {
    e.preventDefault();
    post(route('logout'));
    handleClose();  // Close the menu after logging out
};

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
        src={auth.user.profile_picture != null ? `/storage/${auth.user.profile_picture}` : getDefaultAvatar(auth.user.gender,auth.user.id_number)}
          alt={account.displayName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {account.displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {`${auth.user.first_name}  ${auth.user.last_name}` }
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {auth.user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem  href={route(option.path)} component={Link} key={option.label} onClick={handleClose}>
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
        href={route('logout')}
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
