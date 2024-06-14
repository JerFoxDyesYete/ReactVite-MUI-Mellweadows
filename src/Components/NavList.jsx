import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccessibleIcon from '@mui/icons-material/Accessible';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import NightShelterIcon from '@mui/icons-material/NightShelter';
import MedicationIcon from '@mui/icons-material/Medication';
import PeopleIcon from '@mui/icons-material/People';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import AddTaskIcon from '@mui/icons-material/AddTask';
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
        <Link to="/dashboard/patients" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <LocalHospitalIcon/>
                </ListItemIcon>
                <ListItemText primary="Add Patient" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/patientsmain" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                <AccessibleIcon />
                </ListItemIcon>
                <ListItemText primary="Patient Management" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/staff" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Staff Management" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/ward" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <NightShelterIcon />
                </ListItemIcon>
                <ListItemText primary="Ward Management" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/supply" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <AddTaskIcon />
                </ListItemIcon>
                <ListItemText primary="Supply Management" />
            </ListItemButton>
        </Link>
        <Link to="/dashboard/supplylist" style={styles}>
            <ListItemButton>
                <ListItemIcon>
                    <StackedLineChartIcon />
                </ListItemIcon>
                <ListItemText primary="Supply Stack" />
            </ListItemButton>
        </Link>
    </React.Fragment>
);