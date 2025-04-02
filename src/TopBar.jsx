import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box,
  IconButton,
  Typography,
  Sheet,
  Avatar
} from '@mui/joy';
import Logout from '@mui/icons-material/Logout';
import Home from '@mui/icons-material/Home';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from './context/AuthContext';


function TopBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleHome = () => {
    navigate('/homepage');
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await logout();
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Logout failed:', error);
        // Show error to user (optional)
        alert('Logout failed. Please try again.');
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  return (
    <Sheet
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'sm',
        bgcolor: 'background.body'
      }}
    >
      <Typography level="h4" component="div" sx={{ flexGrow: 1 }}>
        ZAOGA FIF IT KNOWLEDGE BASE 
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
        {/* Only show home button if logged in */}
        {user && (
          <IconButton variant="plain" color="neutral" onClick={handleHome}>
            <Home />
          </IconButton>
        )}
        
        {user ? (
          <>
            <Avatar
              sx={{ 
                bgcolor: 'primary.500',
                width: 36,
                height: 36,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              {getInitials(user.fullname)}
            </Avatar>
            <IconButton variant="plain" color="neutral" onClick={handleLogout}>
              <Logout  />
            </IconButton>
          </>
        ) : (
          <IconButton variant="plain" color="neutral" onClick={() => navigate('/login')}>
            <AccountCircle />
          </IconButton>
        )}

        {/* Only show forward arrow if logged in */}
        
      </Box>
    </Sheet>
  );
}

export default TopBar;