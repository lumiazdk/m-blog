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
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import moment from 'moment'
import { withSnackbar } from 'notistack';


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
        detail: {},
        open: false,
        isReply: false,
        replyName: '',
        comment: '',
        commentList: [],
        fabulousList: []
    }
    async componentDidMount() {
        const { id } = this.props
        let data = await axios({
            method: 'post',
            url: 'getPost',
            data: {
                page: 1,
                pageSize: 10,
                user_id: JSON.parse(localStorage.userInfo).user_id,
                where: {
                    id: id
                }
            }
        });
        if (data.code == 1) {
            this.setState({
                detail: data.result.result[0]
            })
        }
        //获取评论
        this.getComment()
        //获取赞
        this.getfabulous()
    }
    //通知
    enqueueSnackbar = (text, variant) => {
        this.props.enqueueSnackbar(text, {
            variant: variant,
            autoHideDuration: 1000,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'left',
            },
        });
    }

    //赞
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
            if (item.isfabulous) {
                item.fabulous_num = item.fabulous_num - 1
            } else {
                item.fabulous_num = item.fabulous_num + 1

            }
            item.isfabulous = !item.isfabulous
            this.setState((prevState) => ({
                item: item
            }))
            this.getfabulous()
        }
    };
    //获取赞
    getfabulous = async () => {
        let data = await axios({
            method: 'post',
            url: 'getFabulous',
            data: {
                post_id: this.state.detail.id,
            }
        });
        if (data.code == 1) {
            this.setState({
                fabulousList: data.result.result
            })
        }
    }
    //打开回复
    handleClickOpen = (value, item) => {
        if (value) {
            this.setState({
                father_id: item.userInfo.user_id,
                replyName: item.userInfo.user_name
            })
        }
        this.setState({ open: true });
        this.setState({ isReply: value });

    };

    handleClose = () => {
        this.setState({ open: false });
    };
    // 获取评论
    getComment = async () => {
        let data = await axios({
            method: 'post',
            url: 'getComment',
            data: {
                post_id: this.state.detail.id,
            }
        });
        if (data.code == 1) {
            this.setState({
                commentList: data.result.result
            })
        }
    }
    //回复
    addComment = async () => {
        console.log(this.refs.comment)
        let form = {
            post_id: this.state.detail.id,
            user_id: JSON.parse(localStorage.userInfo).user_id,
            content: this.state.comment,
        }
        if (this.state.isReply) {
            form.father_id = this.state.father_id
        } else {
            form.father_id = -1
        }
        let data = await axios({
            method: 'post',
            url: 'addComment',
            data: form
        });
        if (data.code == 1) {
            this.enqueueSnackbar('评论成功', 'success')
            this.getComment()
            this.handleClose()
        } else {
            this.enqueueSnackbar('评论失败', 'error')
            this.handleClose()
        }
    }
    //mommentchange
    commentChange = (event) => {
        this.setState({ comment: event.target.value });
    }
    render() {
        const { classes } = this.props;
        const { detail } = this.state;
        const name = (<span>回复:{this.state.replyName}</span>)
        return (
            <div className={classes.root}>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogContent>
                        <DialogContentText>
                            {this.state.isReply && name}
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="评论"
                            type="text"
                            fullWidth
                            onChange={this.commentChange}
                            value={this.state.comment}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            取消
                        </Button>
                        <Button onClick={this.handleClose} color="primary" onClick={this.addComment}>
                            回复
                        </Button>
                    </DialogActions>
                </Dialog>
                <Paper className={classes.paper} elevation={1}>
                    <Typography variant="h5" component="span" >
                        <span dangerouslySetInnerHTML={{ __html: detail.content }}></span>
                    </Typography>
                    <Grid container spacing={24}>
                        <Grid item xs={3}>
                            <Button color={detail.isfabulous ? 'secondary' : 'default'} className={classes.button} onClick={this.addfabulous.bind(this, detail)}>
                                <i className='iconfont icon-like-b'></i>
                                <Typography component="span" style={{ marginLeft: '10px' }} color={detail.isfabulous ? 'secondary' : 'default'}>
                                    {detail.fabulous_num}
                                </Typography>
                            </Button>
                        </Grid>

                        <Grid item xs={3}>
                            <Button className={classes.button} onClick={this.handleClickOpen.bind(this, false)}>
                                <i className='iconfont icon-xiaoxi'></i>
                                <Typography component="span" style={{ marginLeft: '10px' }}>
                                    {this.state.commentList.length}
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
                        {this.state.fabulousList.slice(0, 9).map((item, k) =>
                            <Grid item key={k}>
                                <Avatar alt="Remy Sharp" src={item.userInfo.user_profile_photo} className={classes.avatar} />
                            </Grid>)}

                    </Grid>
                    <Typography gutterBottom variant="subtitle1" style={{ marginTop: '10px' }}>
                        回帖({this.state.commentList.length})
                        <Divider />
                    </Typography>
                    {this.state.commentList.map((item, k) => <Grid container spacing={8} style={{ marginBottom: '10px' }} key={k}>
                        <Grid item xs={2}>
                            <ButtonBase className={classes.image}>
                                <Avatar alt="Remy Sharp" src={item.userInfo.user_profile_photo} className={classes.avatar} />
                            </ButtonBase>
                        </Grid>
                        <Grid item xs={10} sm container style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.54)' }}>
                            <Grid item xs container direction="column" spacing={16}>
                                <Grid item xs>
                                    <Typography gutterBottom variant="subtitle1">
                                        {item.userInfo.user_name}
                                    </Typography>
                                    <Typography color="textSecondary">{k + 1}楼</Typography>
                                    <Typography gutterBottom>{item.fatherInfo && <span className='fathername'>@{item.fatherInfo.user_name}&nbsp;</span>}{item.content}</Typography>

                                </Grid>
                                <Grid item>
                                    <Typography color="textSecondary">{moment(item.create_time).fromNow()}</Typography>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Button color="primary" onClick={this.handleClickOpen.bind(this, true, item)}>
                                    回复
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>)}

                </Paper>

            </div>
        );
    }

}

PostDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withSnackbar(withStyles(styles)(PostDetail)));