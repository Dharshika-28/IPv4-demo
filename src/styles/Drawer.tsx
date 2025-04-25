import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PeopleIcon from '@mui/icons-material/People';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';

export default function Drawers() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const navLinks = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "DashBoard", icon: <SpaceDashboardIcon />, path: "/admindashboard" },
    { text: "User Details", icon: <PeopleIcon />, path: "/userDetails" },
    { text: "Course Progress", icon: <LibraryBooksIcon />, path: "/courseprogress" },
    { text: "Admin Register", icon: <AppRegistrationIcon />, path: "/adminregister" },
  ];

  const actionLinks = [
    { text: "Setting", icon: <SettingsIcon />, path: "/settings" },
    { text: "Trash", icon: <DeleteIcon />, path: "/trash" },
    { text: "Logout", icon: <LogoutIcon />, path: "/" },
  ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {navLinks.map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding>
            <Link to={path} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
              <ListItemButton>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {actionLinks.map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding>
            <Link to={path} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
              <ListItemButton>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        <MenuIcon style={{ color: 'white' }} />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
