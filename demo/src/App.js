import './App.css';

import Menu from "./Menu";
import ProjectInfoPage from "./ProjectInfoPage";
import ResourcesPage from "./ResourcesPage";
import GenerateDataPage from "./GenerateDataPage";
import PerformancePage from "./PerformancePage";
import HomePage from "./HomePage";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    contentContainer: {
        marginLeft: "15rem"
    }
}));

export default function App() {
    const classes = useStyles();

    return (
        <Router>
            <Menu />

            <div className={classes.contentContainer}>
                <Switch>
                    <Route path="/project-info">
                        <ProjectInfoPage />
                    </Route>
                    <Route path="/resources">
                        <ResourcesPage />
                    </Route>
                    <Route path="/generate-data">
                        <GenerateDataPage />
                    </Route>
                    <Route path="/performance">
                        <PerformancePage />
                    </Route>
                    <Route path="/">
                        <HomePage />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
