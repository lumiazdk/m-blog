import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import ButtonBase from '@material-ui/core/ButtonBase';
import Avatar from '@material-ui/core/Avatar';


const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

function SendMessage(props) {
    const { classes } = props;
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                        <i className='iconfont icon-back'></i>
                    </IconButton>
                    <Typography variant="h6" color="inherit" className={classes.grow}>
                        小猪
                    </Typography>
                    {/* <Button color="inherit">Login</Button> */}
                </Toolbar>
            </AppBar>
            <Grid container spacing={8} style={{ marginBottom: '10px' }}>
                <Grid item xs={2}>
                    <ButtonBase className={classes.image}>
                        <Avatar alt="Remy Sharp" src='{item.userInfo.user_profile_photo}' className={classes.avatar} />
                    </ButtonBase>
                </Grid>
                <Grid item xs={10} sm container>
                    <Grid item xs container direction="column" spacing={16}>
                        <Grid item>
                            <Typography color="textSecondary">
                                'moment(item.create_time).fromNow()'
                                'moment(item.create_time).fromNow()'
                                'moment(item.create_time).fromNow()'
                                'moment(item.create_time).fromNow()'
                                'moment(item.create_time).fromNow()'

                            </Typography>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>


            <Paper style={{ position: 'fixed', bottom: '3px', width: '100%' }}>
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                    alignItems="center"

                >
                    <Grid item xs={10}
                        container
                        alignItems="center"
                    >
                        <TextField
                            id="outlined-bare"
                            variant="outlined"
                            fullWidth
                            style={{ margin: '5px' }}

                        />
                    </Grid>
                    <Grid item xs={2}
                        container
                        justify="flex-end"
                        alignItems="center"
                    >
                        <Button color="primary" className={classes.button}>
                            发送
                        </Button>
                    </Grid>
                </Grid>
            </Paper>


        </div>
    );
}

SendMessage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SendMessage);