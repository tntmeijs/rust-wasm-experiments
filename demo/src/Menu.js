import React from "react";

import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import HomeIcon from "@material-ui/icons/Home";
import SpeedIcon from "@material-ui/icons/Speed";
import GetAppIcon from "@material-ui/icons/GetApp";
import DescriptionIcon from "@material-ui/icons/Description";
import InfoIcon from "@material-ui/icons/Info";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
}));

export default function Menu() {
    const classes = useStyles();

    return (
        <Drawer className={classes.drawer} variant="permanent" anchor="left">
            <Divider />
            <List>
                <ListItem button key="Home">
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button key="Performance">
                    <ListItemIcon>
                        <SpeedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Performance" />
                </ListItem>
                <ListItem button key="Generate Data">
                    <ListItemIcon>
                        <GetAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Generate Data" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button key="Resources">
                    <ListItemIcon>
                        <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Resources" />
                </ListItem>
                <ListItem button key="Project Info">
                    <ListItemIcon>
                        <InfoIcon />
                    </ListItemIcon>
                    <ListItemText primary="Project Info" />
                </ListItem>
            </List>
        </Drawer>
    );
}
