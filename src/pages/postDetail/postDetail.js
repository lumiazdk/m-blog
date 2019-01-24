import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { withRouter } from 'react-router'
import axios from 'axios'
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import './postDetail.scss'
const styles = theme => ({
    root: {
        flexGrow: 1,

    },
    paper: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        flexGrow: 1,
        margin: '10px'

    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
});

class PostDetail extends React.Component {
    state = {
        detail: {}
    }
    async componentDidMount() {
        const { match, location, history } = this.props
        console.log(match)
        let data = await axios({
            method: 'post',
            url: 'getPost',
            data: {
                page: 1,
                pageSize: 10,
                user_id: JSON.parse(localStorage.userInfo).user_id,
                where: {
                    id: match.params.id
                }
            }
        });
        if (data.code == 1) {
            this.setState({
                detail: data.result.result[0]
            })
        }
    }
    back = () => {
        const { match, location, history } = this.props
        history.goBack()

    }
    addfabulous = async (item) => {
        let data = await axios({
            method: 'post',
            url: 'addFabulous',
            data: {
                post_id: this.state.detail.id,
                fabulousUser_id: JSON.parse(localStorage.userInfo).user_id
            }
        });
        if (data.code == 1) {
            item.isfabulous = !item.isfabulous
            this.setState((prevState) => ({
                item: item
            }))
        }
    };
    render() {
        const { classes } = this.props;
        const { detail } = this.state;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.back}>
                            <i className='iconfont icon-back'></i>
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            详情
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Paper className={classes.paper} elevation={1}>
                    <Typography variant="h5" component="span" >
                        <span dangerouslySetInnerHTML={{ __html: detail.content }}></span>
                    </Typography>
                    <Grid container spacing={24}>
                        <Grid item xs={3}>
                            <Button color={detail.isfabulous ? 'secondary' : 'default'} className={classes.button} onClick={this.addfabulous.bind(this, detail)}>
                                <i className='iconfont icon-like-b'></i>
                                <Typography component="span" style={{ marginLeft: '10px' }} color={detail.isfabulous ? 'secondary' : 'default'}>
                                    0
                                </Typography>
                            </Button>
                        </Grid>

                        <Grid item xs={3}>
                            <Button className={classes.button}>
                                <i className='iconfont icon-xiaoxi'></i>
                                <Typography component="span" style={{ marginLeft: '10px' }}>
                                    0
                            </Typography>
                            </Button>
                        </Grid>

                        <Grid item xs={3}>
                            <Button className={classes.button}>
                                <i className='iconfont icon-zhuanfa'></i>
                                <Typography component="span" style={{ marginLeft: '10px' }}>
                                    0
                            </Typography>
                            </Button>
                        </Grid>

                        <Grid item xs={3}>
                            <Button className={classes.button}>
                                <i className='iconfont icon-chakan'></i>
                                <Typography component="span" style={{ marginLeft: '10px' }}>
                                    0
                            </Typography>
                            </Button>
                        </Grid>

                    </Grid>

                    <Grid container spacing={24}>
                        <Grid item>
                            <Avatar alt="Remy Sharp" src={detail.background} className={classes.avatar} />
                        </Grid>
                    </Grid>
                    <Typography gutterBottom variant="subtitle1" style={{ marginTop: '10px' }}>
                        回帖(22)
                        <Divider />
                    </Typography>
                    <Grid container spacing={8} style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                            <ButtonBase className={classes.image}>
                                <Avatar alt="Remy Sharp" src={detail.background} className={classes.avatar} />
                            </ButtonBase>
                        </Grid>
                        <Grid item xs={10} sm container style={{ borderBottom: '1px solid red' }}>
                            <Grid item xs container direction="column" spacing={16}>
                                <Grid item xs>
                                    <Typography gutterBottom variant="subtitle1">
                                        name
                                    </Typography>
                                    <Typography color="textSecondary">1楼</Typography>
                                    <Typography gutterBottom><span className='fathername'>@name&nbsp;</span>哈哈哈</Typography>

                                </Grid>
                                <Grid item>
                                    <Typography color="textSecondary">时间</Typography>
                                </Grid>
                            </Grid>
                            {/* <Grid item>
                                <Typography variant="subtitle1">$19.00</Typography>
                            </Grid> */}
                        </Grid>
                    </Grid>
                </Paper>

            </div>
        );
    }

}

PostDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(PostDetail));