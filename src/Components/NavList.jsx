import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';

const styles = { textDecoration: "none", color: "inherit" }

export const mainListItems = (
    <React.Fragment>
        <Link to="/dashboard" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/users" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Users" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/reports" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/settings" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
            </ListItemButton>
        </Link>
    </React.Fragment>
);