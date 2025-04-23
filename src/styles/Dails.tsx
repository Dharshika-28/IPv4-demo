import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import InfoIcon from '@mui/icons-material/Info';
import { Link } from 'react-router-dom';


const actions = [
    {
      icon: (
        <Link to="/adminregister" style={{ color: 'inherit' }}>
          <HowToRegIcon />
        </Link>
      ),
      name: 'Go to Register',
    },
    {
        icon: (
          <Link to="/usertable" style={{ color: 'inherit' }}>
            <InfoIcon />
          </Link>
        ),
        name: 'Go to UserDetails',
      },
  ];

export default function BasicSpeedDial() {
  return (
    <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
