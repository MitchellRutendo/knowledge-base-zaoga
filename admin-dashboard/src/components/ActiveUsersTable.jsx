import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';


const ActiveUsersTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActiveUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/active-users');
      if (!response.ok) throw new Error('Failed to fetch active users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveUsers();
    
    // Set up polling every 10 seconds
    const interval = setInterval(fetchActiveUsers, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        backgroundColor: colors.primary[400],
        maxHeight: '500px',
        border: `1px solid ${colors.blueAccent[700]}`
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 2,
        borderBottom: `1px solid ${colors.blueAccent[700]}`
      }}>
        <Typography variant="h5" sx={{ color: colors.grey[100] }}>
          Currently Active Users
        </Typography>
        <IconButton onClick={fetchActiveUsers} sx={{ color: colors.greenAccent[500] }}>
          <RefreshIcon />
        </IconButton>
      </Box>
      
      <Table stickyHeader aria-label="active users table">
        <TableHead>
          <TableRow sx={{ backgroundColor: colors.blueAccent[700] }}>
            <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>User ID</TableCell>
            <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>Name</TableCell>
            <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>Login Time</TableCell>
            <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>Last Activity</TableCell>
            <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <CircularProgress color="secondary" />
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Typography variant="body1">No active users currently</Typography>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow 
                key={user.id}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: colors.primary[300],
                  }
                }}
              >
                <TableCell sx={{ color: colors.grey[100] }}>{user.id}</TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>{user.fullname}</TableCell>
                <TableCell sx={{ color: colors.grey[100] }}>{user.email}</TableCell>
                <TableCell sx={{ color: colors.grey[100] }}>
                  {new Date(user.loginTime).toLocaleString()}
                </TableCell>
                <TableCell sx={{ color: colors.grey[100] }}>
                  {new Date(user.lastActivity).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Box 
                    sx={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      backgroundColor: user.status === 'active' 
                        ? colors.greenAccent[500] 
                        : colors.redAccent[500],
                      color: colors.grey[100],
                      fontWeight: 'bold',
                      fontSize: '0.75rem'
                    }}
                  >
                    {user.status.toUpperCase()}
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ActiveUsersTable;