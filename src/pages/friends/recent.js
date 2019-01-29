import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import Divider from '@material-ui/core/Divider';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import axios from 'axios'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';
import UserDetail from '../userDetail/userDetail.js'
import SendMessage from '../sendMessage/sendMessage.js'
import Swiper from 'swiper'
import './recent.scss'
import Badge from '@material-ui/core/Badge';
const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        padding: 0
    },
    nested: {
    }
});
function Transition(props) {
    return <Slide direction="left" {...props} />;
}
class Recent extends React.Component {
    state = {
        nfopen: false,//下拉
        newfriendList: [],
        open: false,//page
        title: '详情',
        item: {
            user_name: '',
            friend_id: '',
            user_profile_photo: ''
        },
        chatList: [],
        isDetail: false,
        ischat: false
    }
    componentDidMount() {
        const _this = this
        let wrapper = this.refs.wrapper
        var swiper = new Swiper(wrapper, {
            direction: 'vertical',
            slidesPerView: 'auto',
            freeMode: true,
            mousewheel: true,
            on: {
                // touchMove: touchMove,
                // touchEnd: touchEnd
            }

        });
        this.getnewfriend()
        this.getChat()
        global.socket.on('getChat', () => {
            if (this.refs.chat) {
                this.getChat()
            }
        })
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
    //新的好友
    nfhandleClick = () => {
        this.setState(state => ({ nfopen: !state.nfopen }));
    };
    //获取好友通知
    getnewfriend = async () => {
        let data = await axios({
            method: 'post',
            url: 'getFriend',
            data: {
                user_id: JSON.parse(localStorage.userInfo).user_id
            }
        });
        if (data.code == 1) {
            this.setState({
                newfriendList: data.result.result
            })
        }
    }
    //获取聊天
    getChat = async () => {
        let data = await axios({
            method: 'post',
            url: 'getChat',
            data: {
                user_id: JSON.parse(localStorage.userInfo).user_id
            }
        });
        if (data.code == 1) {
            this.setState({
                chatList: data.result.chat
            })
        }
    }
    //去详情
    toDetail = (item) => {
        console.log(item)
        this.setState({
            item: item,
            isDetail: true,
            isChat: false

        })
        this.handleClickOpen()
    }
    //去聊天
    toChat = (item) => {
        this.setState({
            item: {
                user_id: item.user_id,
                friend_id: item.friend_id,
                user_profile_photo: item.friendInfo.user_profile_photo
            },
            isChat: true,
            isDetail: false

        })

        this.handleClickOpen()
    }
    render() {
        const { classes } = this.props;
        return (

            <div ref='wrapper' className='wrapper recent'>
                <div className="swiper-wrapper" ref='swiperwrapper'>
                    <div className="swiper-slide" style={{ height: 'auto' }} ref='swiperslide'>
                        <List className={classes.root} >
                            <ListItem button onClick={this.nfhandleClick}>
                                <Avatar src='/img/nf.png'>
                                </Avatar>
                                <ListItemText inset primary="新的好友" />
                                {this.state.nfopen ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={this.state.nfopen} timeout="auto" unmountOnExit>
                                <List component="div">
                                    {this.state.newfriendList.map((item, k) =>
                                        <ListItem button className={classes.nested} onClick={this.toDetail.bind(this, item)} key={k}>
                                            <Avatar src={item.friend.user_profile_photo}>
                                            </Avatar>
                                            {item.status == 0 && <ListItemText primary={item.friend.user_name} secondary="待同意" />}
                                            {item.status == 1 && <ListItemText primary={item.friend.user_name} secondary="已同意" />}
                                            {item.status == 2 && <ListItemText primary={item.friend.user_name} secondary="已拒绝" />}
                                            <ListItemSecondaryAction>
                                                <IconButton className={classes.button} aria-label="Delete">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    )}

                                </List>
                            </Collapse>
                            <ListItem>
                                <Avatar>
                                    <ImageIcon />
                                </Avatar>
                                <ListItemText primary="通知提醒" />
                            </ListItem>
                            <li>
                                <Divider variant="inset" />
                            </li>
                            {/* 聊天 */}
                            <List className={classes.root} ref='chat'>
                                {this.state.chatList.map(item => <ListItem onClick={this.toChat.bind(this, item)} key={item.id}>
                                    <Badge className={classes.margin} badgeContent={item.message_num} color="secondary">
                                        <Avatar src={item.friendInfo.user_profile_photo}>
                                        </Avatar>
                                    </Badge>
                                    <ListItemText primary={item.friendInfo.user_name} secondary={item.last_message} />
                                </ListItem>)}
                            </List>
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
                                {this.state.open == true && this.state.isDetail == true && <UserDetail {...this.state.item}></UserDetail>}
                                {this.state.open == true && this.state.isChat == true && <SendMessage {...this.state.item} handleClose={this.handleClose.bind(this)} getChat={this.getChat.bind(this)}></SendMessage>}
                            </Dialog>
                        </List>
                    </div>
                </div>
            </div>


        );
    }

}

Recent.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Recent);