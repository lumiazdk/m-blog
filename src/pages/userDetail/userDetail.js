import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import red from '@material-ui/core/colors/red';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import axios from 'axios'
import moment from 'moment'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SendMessage from '../sendMessage/sendMessage.js'

function Transition(props) {
    return <Slide direction="left" {...props} />;
}
const styles = theme => ({
    card: {
        maxWidth: 400,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        // backgroundColor: red[500],
    },
});

class UserDetail extends React.Component {
    state = {
        user_name: '',
        user_email: '',
        user_profile_photo: '',
        user_birthday: '',
        user_age: '',
        user_nickname: '',
        motto: '',
        status: this.props.status,
        open: false,//page
        title: '详情',
        item: {
            user_name: '',
            friend_id: '',
            user_profile_photo: ''
        }

    };
    componentDidMount() {
        this.getDetail()
    }
    //子页
    handleClickOpen = () => {
        this.setState({
            open: true

        });
    };

    handleClose = () => {
        this.setState({ open: false });
    };
    getDetail = async () => {
        let data = await axios({
            method: 'post',
            url: 'userInfo',
            data: {
                user_id: this.props.friend_id
            }
        });
        if (data.code == 1) {
            let result = data.result.userInfo
            this.setState(() => ({ user_name: result['user_name'] ? result['user_name'] : '' }))
            this.setState(() => ({ user_email: result['user_email'] ? result['user_email'] : '' }))
            this.setState(() => ({ user_profile_photo: result['user_profile_photo'] ? result['user_profile_photo'] : '' }))
            this.setState(() => ({ user_birthday: result['user_birthday'] ? result['user_birthday'] : '' }))
            this.setState(() => ({ user_age: result['user_age'] ? result['user_age'] : '' }))
            this.setState(() => ({ user_nickname: result['user_nickname'] ? result['user_nickname'] : '' }))
            this.setState(() => ({ motto: result['motto'] ? result['motto'] : '' }))
            this.setState({
                item: {
                    user_name: result.user_name,
                    friend_id: this.props.friend_id,
                    user_profile_photo: result.user_profile_photo
                }
            })
        }
    }
    sure = async () => {
        let data = await axios({
            method: 'post',
            url: 'updateFriend',
            data: {
                user_id: this.props.user_id,
                friend_id: this.props.friend_id,
                status: 1
            }
        });
        if (data.code == 1) {
            this.setState({
                status: 1
            })
        }

    }
    refuse = async () => {
        let data = await axios({
            method: 'post',
            url: 'updateFriend',
            data: {
                user_id: this.props.user_id,
                friend_id: this.props.friend_id,
                status: 2
            }
        });
        if (data.code == 1) {
            this.setState({
                status: 1
            })
        }
    }
    toSendMessage = async () => {
        this.handleClickOpen()

    }
    closePage = async () => {
        if (this.props.from=='request') {
            let data = await axios({
                method: 'post',
                url: 'clearFriendBadge',
                data: {
                    user_id: this.props.user_id,
                    friend_id: this.props.friend_id,
                }
            });
            if (data.code == 1) {
                this.props.closePage()
            }
        }
        if(this.props.from=='friend'){
            this.props.closePage()
        }

    }
    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <AppBar className={classes.appBar} position='static'>
                    <Toolbar>
                        <IconButton color="inherit" onClick={this.closePage} aria-label="Close">
                            <i className='iconfont icon-back'></i>
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            用户详情
                                        </Typography>
                    </Toolbar>

                </AppBar>
                <Card className={classes.card}>
                    <CardHeader
                        avatar={
                            this.state.user_profile_photo && <Avatar aria-label="Recipe" className={classes.avatar} src={this.state.user_profile_photo}>
                            </Avatar>
                        }
                        title={this.state.user_name}
                        subheader={this.state.user_nickname}
                    />

                    <List component="nav">
                        {this.state.motto && <ListItem>

                            <ListItemIcon>
                                <i className='iconfont icon-liuyan'></i>
                            </ListItemIcon>
                            <ListItemText primary={this.state.motto} />
                        </ListItem>}

                        {this.state.user_birthday && <ListItem>
                            <ListItemIcon>
                                <i className='iconfont icon-shengri'></i>
                            </ListItemIcon>
                            <ListItemText primary={moment(this.state.user_birthday).format('YYYY-MM-DD')} />
                        </ListItem>}
                        {this.state.user_age && <ListItem>
                            <ListItemIcon>
                                <i className='iconfont icon-icon_rencai_nianling'></i>
                            </ListItemIcon>
                            <ListItemText primary={this.state.user_age + '岁'} />
                        </ListItem>}
                        {this.state.user_email && <ListItem>
                            <ListItemIcon>
                                <i className='iconfont icon-youjian'></i>
                            </ListItemIcon>
                            <ListItemText primary={this.state.user_email} />
                        </ListItem>}
                    </List>
                    {this.state.status == 0 && this.props.request_id != JSON.parse(localStorage.userInfo).user_id && <Grid
                        container
                        direction="row-reverse"
                        justify="center"
                        alignItems="center"
                        style={{ padding: '10px' }}
                        spacing={8}
                    >
                        <Grid item>
                            <Button variant="outlined" color="primary" className={classes.button} onClick={this.sure}>
                                同意
                    </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="secondary" className={classes.button} onClick={this.refuse}>
                                拒绝
                    </Button>
                        </Grid>

                    </Grid>}

                    {this.state.status == 2 && <div style={{ textAlign: 'center', padding: '10px', color: "red" }}>已拒绝</div>}
                    {this.state.status == 1 && <div style={{ textAlign: 'center', padding: '10px', color: "red" }}>
                        <Button variant="outlined" className={classes.button} onClick={this.toSendMessage}>
                            发送信息
                    </Button>
                    </div>}
                    {/* 子页 */}
                    <Dialog
                        fullScreen
                        open={this.state.open}
                        onClose={this.handleClose}
                        TransitionComponent={Transition}
                    >
                        <AppBar className={classes.appBar} position='static'>
                            <Toolbar>
                                <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                                    <i className='iconfont icon-back'></i>
                                </IconButton>
                                <Typography variant="h6" color="inherit" className={classes.grow}>
                                    {this.state.title}
                                </Typography>
                            </Toolbar>

                        </AppBar>
                        {this.state.open == true && <SendMessage {...this.state.item} handleClose={this.handleClose.bind(this)}></SendMessage>}

                    </Dialog>
                </Card>
            </React.Fragment>

        );
    }
}

UserDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserDetail);