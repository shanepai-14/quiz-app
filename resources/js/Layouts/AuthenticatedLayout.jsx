import { useState } from 'react';
import Box from '@mui/material/Box';
import Nav from './dashboard/nav';
import Main from './dashboard/main';
import Header from './dashboard/header';;

export default function Authenticated({  children }) {
    const [openNav, setOpenNav] = useState(false);

    return (
        <>
        <Header onOpenNav={() => setOpenNav(true)} />

        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />
  
          <Main>{children}</Main>
        </Box>
        </>
    );
}
