import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SecurityIcon from '@mui/icons-material/Security';

const drawerWidth = 240;

const Sidebar = ({ onSelect }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            backgroundColor: '#000000', // Pitch Black
            color: 'white',
            borderRight: '1px solid #333'
        },
      }}
    >
      {/* --- LOGO SECTION --- */}
      <Box sx={{ padding: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1, color: 'white' }}>
            TRANSACT<span style={{ color: '#ff1744' }}>VIEW</span>
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: '#333' }} />

      {/* --- NAVIGATION LINKS --- */}
      <List sx={{ marginTop: 2 }}>
        
        {/* Analytics Button */}
        <ListItem button onClick={() => onSelect('dashboard')} sx={{ 
            marginBottom: 2, 
            '&:hover': { backgroundColor: 'rgba(255, 23, 68, 0.1)', borderRight: '4px solid #ff1744' } 
        }}>
          <ListItemIcon><DashboardIcon sx={{ color: '#ff1744' }} /></ListItemIcon>
          <ListItemText primary="Analytics" primaryTypographyProps={{ fontWeight: 'medium' }} />
        </ListItem>

        {/* Transactions Button */}
        <ListItem button onClick={() => onSelect('transactions')} sx={{ 
            marginBottom: 2, 
            '&:hover': { backgroundColor: 'rgba(255, 23, 68, 0.1)', borderRight: '4px solid #ff1744' } 
        }}>
          <ListItemIcon><ReceiptIcon sx={{ color: '#ff1744' }} /></ListItemIcon>
          <ListItemText primary="Transactions" primaryTypographyProps={{ fontWeight: 'medium' }} />
        </ListItem>

        {/* Security Logs Button */}
        <ListItem button onClick={() => onSelect('audit')} sx={{ 
            '&:hover': { backgroundColor: 'rgba(255, 23, 68, 0.1)', borderRight: '4px solid #ff1744' } 
        }}>
          <ListItemIcon><SecurityIcon sx={{ color: '#ff1744' }} /></ListItemIcon>
          <ListItemText primary="Security Logs" primaryTypographyProps={{ fontWeight: 'medium' }} />
        </ListItem>

      </List>
    </Drawer>
  );
};

export default Sidebar;