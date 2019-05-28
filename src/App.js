import React, {useEffect, useState} from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import EventIcon from '@material-ui/icons/Event';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import {makeStyles} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import GithubIcon from "./components/GithubIcon";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
    chip: {
        margin: theme.spacing(1),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));


const App = (props) => {
    const [log, setLog] = useState('');
    const [gApiLoaded, setGApiLoaded] = useState(false);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [calendars, setCalendars] = useState([]);
    const [calendar, setCalendar] = useState(-1);
    const [events, setEvents] = useState([]);
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const {gapi} = window;

    const onSignout = () => {
        const {auth2} = gapi;
        if (isLoggedIn) {
            auth2.getAuthInstance().signOut();
        } else {
            auth2.getAuthInstance().signIn();
        }
    };

    const updateSigninStatus = (isSignedIn) => {
        setLoggedIn(isSignedIn);
        if (isSignedIn) {
            loadCalendars();
        }
    };

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    const initClient = () => {
        const {auth2, client} = gapi;
        client.init({
            apiKey: props.apiKey,
            clientId: props.clientId,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
            scope: "https://www.googleapis.com/auth/calendar.readonly"
        }).then(function () {
            auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            updateSigninStatus(auth2.getAuthInstance().isSignedIn.get());
            setLog(`Successfully logged in.`);
            setOpen(true);
        }, function (error) {
            setLog(`Execute error: ${error.message}`);
            setOpen(true);
        });
    };

    useEffect(() => {
        if (gapi && !gApiLoaded) {
            setGApiLoaded(true);
            gapi.load('client:auth2', initClient);
        }
    }, []);

    const loadCalendars = () => {
        gapi.client.calendar.calendarList.list({}).then((response) => {
            setCalendars(response.result.items);
            if (response.result.items.length > 0) {
                const cal = response.result.items[0];
                loadUpcomingEvents(cal.id);
            }
        }).catch((error) => {
            setLog(`Execute error: ${error.message}`);
            setOpen(true);
        });
    };

    const loadUpcomingEvents = (id) => {
        setCalendar(id);
        gapi.client.calendar.events.list({
            'calendarId': id ? id : 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        }).then(function (response) {
            setEvents(response.result.items);
        }).catch((error) => {
            setLog(`Execute error: ${error.message}`);
            setOpen(true);
        });
    };

    const eventSummary = (event) => {
        const {summary, start} = event;
        return `${summary} - ${moment(start.dateTime).format('dddd, MMMM Do YYYY, h:mm a')}`
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const ElevationScroll = (props) => {
        const {children, window} = props;
        const trigger = useScrollTrigger({
            disableHysteresis: true,
            threshold: 0,
            target: window ? window() : undefined,
        });

        return React.cloneElement(children, {
            elevation: trigger ? 4 : 0,
        });
    };

    ElevationScroll.propTypes = {
        children: PropTypes.node.isRequired,
        window: PropTypes.func,
    };

    return <div className={classes.root}>
        <ElevationScroll {...props}>
            <AppBar>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Google Calendar with React.js
                    </Typography>
                    <Button color="inherit"
                            title="View project on Github."
                            aria-label="View project on Github."
                            href='https://github.com/asalaidno/google-calednar-with-reactjs'
                            target='_blank'>
                        <GithubIcon/>
                    </Button>
                    <Button color="inherit"
                            title="Google Calendar Quick Start Documentation"
                            aria-label="Google Calendar Quick Start Documentation"
                            href='https://developers.google.com/calendar/quickstart/js'
                            target='_blank'>
                        <BookmarkIcon/>
                    </Button>
                    <Button color="inherit" onClick={onSignout}>
                        Sign {isLoggedIn ? 'Out' : 'In'}
                    </Button>
                </Toolbar>
            </AppBar>
        </ElevationScroll>
        <Toolbar/>
        <Container>
            <Box my={2}>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <Chip icon={isLoggedIn ? <CheckIcon/> : <CloseIcon/>}
                              color={isLoggedIn ? `primary` : 'secondary'}
                              variant="outlined"
                              label={`Logged In: ${isLoggedIn ? 'Yes' : 'No'}`}
                              className={classes.chip}/>
                        <Chip icon={gApiLoaded ? <CheckIcon/> : <CloseIcon/>}
                              color={gApiLoaded ? `primary` : 'secondary'}
                              variant="outlined"
                              label={`Google API: ${gApiLoaded ? 'Yes' : 'No'}`}
                              className={classes.chip}/>
                        {isLoggedIn ? <Grid container spacing={0}>
                            <Grid item xs={12} md={12}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="age-simple">Calendars</InputLabel>
                                    <Select value={calendar} onChange={(e) => loadUpcomingEvents(e.target.value)}>
                                        {calendars.map(calendar => {
                                            const {id, summary} = calendar;
                                            return <MenuItem key={id} value={id}>{summary}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                                <List dense={false} component="nav">
                                    {events.map(event => {
                                        return <ListItem key={event.id}>
                                            <ListItemIcon>
                                                <EventIcon/>
                                            </ListItemIcon>
                                            <ListItemText primary={eventSummary(event)}/>
                                        </ListItem>
                                    })}
                                </List>
                            </Grid>
                        </Grid> : <React.Fragment/>}
                    </Grid>
                </Grid>
            </Box>
        </Container>
        <Snackbar
            anchorOrigin={{vertical: 'top', horizontal: 'center',}}
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
            ContentProps={{'aria-describedby': 'message-id',}}
            message={<span id="message-id">{log}</span>}
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={handleClose} href={``}>
                    <CloseIcon/>
                </IconButton>
            ]}
        />
    </div>
};

window.propTypes = {
    gapi: PropTypes.shape({
        getAuthInstance: PropTypes.shape({
            signOut: PropTypes.func,
            signIn: PropTypes.func,
            isSignedIn: PropTypes.bool
        })
    })
};
App.propTypes = {
    clientId: PropTypes.string.isRequired,
    apiKey: PropTypes.string.isRequired
};

export default App;
