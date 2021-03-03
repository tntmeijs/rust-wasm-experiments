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
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    links: {
        color: "inherit !important",
        textDecoration: "none"
    }
}));

export default function Menu() {
    const classes = useStyles();

    return (
        <Drawer variant="permanent" anchor="left">
            <Divider />
            <List>
                <Link to="/" className={classes.links}>
                    <ListItem button key="Home">
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>
                </Link>
                <Link to="/performance" className={classes.links}>
                    <ListItem button key="Performance">
                        <ListItemIcon>
                            <SpeedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Performance" />
                    </ListItem>
                </Link>
                <Link to="generate-data" className={classes.links}>
                    <ListItem button key="Generate Data">
                        <ListItemIcon>
                            <GetAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Generate Data" />
                    </ListItem>
                </Link>
            </List>
            <Divider />
            <List>
                <Link to="resources" className={classes.links}>
                    <ListItem button key="Resources">
                        <ListItemIcon>
                            <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText primary="Resources" />
                    </ListItem>
                </Link>
                <Link to="project-info" className={classes.links}>
                    <ListItem button key="Project Info">
                        <ListItemIcon>
                            <InfoIcon />
                        </ListItemIcon>
                        <ListItemText primary="Project Info" />
                    </ListItem>
                </Link>
            </List>
        </Drawer>
    );
}
