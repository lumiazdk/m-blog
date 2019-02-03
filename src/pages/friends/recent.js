import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import axios from 'axios'
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import UserDetail from '../userDetail/userDetail.js'
import SendMessage from '../sendMessage/sendMessage.js'
import Swiper from 'swiper'
import './recent.scss'
import Badge from '@material-ui/core/Badge';
import moment from 'moment'

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
        ischat: false,
        is_readnum: 0,
        swiper: ''
    }
    async componentDidMount() {
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
        await this.setState({
            swiper
        })
        this.getnewfriend()
        this.getChat()
        global.socket.on('getChat', () => {
            if (this.refs.chat) {
                this.getChat()
            }
        })
        global.socket.on('getFriendRequest', () => {
            if (this.refs.chat) {
                this.getnewfriend()
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
    nfhandleClick = async () => {
        this.setState(state => ({ nfopen: !state.nfopen }));
        setTimeout(() => {
            this.state.swiper.update()

        }, 1000);
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
                newfriendList: data.result.result,
                is_readnum: data.result.is_readnum
            })
        }
    }
    //子页传入方法
    closePage = () => {
        this.getnewfriend()
        this.handleClose()
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
        this.setState({
            item: item,
            isDetail: true,
            isChat: false,
        })
        this.handleClickOpen()
    }
    //去聊天
    toChat = (item) => {
        this.setState({
            item: {
                user_id: item.user_id,
                friend_id: item.friend_id,
                user_profile_photo: item.friendInfo.user_profile_photo,
                user_name: item.friendInfo.user_name
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
                                <Badge className={classes.margin} badgeContent={this.state['is_readnum']} color="secondary">
                                    <Avatar src='/img/nf.png'>
                                    </Avatar>
                                </Badge>
                                <ListItemText inset primary="新的好友" />
                                {this.state.nfopen ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={this.state.nfopen} timeout="auto" unmountOnExit>
                                <List component="div">
                                    {this.state.newfriendList.map((item, k) =>
                                        <ListItem button className={classes.nested} onClick={this.toDetail.bind(this, item)} key={k}>
                                            {item.request_id == JSON.parse(localStorage.userInfo).user_id &&
                                                <Avatar src={item.friend.user_profile_photo}>
                                                </Avatar>}
                                            {item.request_id != JSON.parse(localStorage.userInfo).user_id && <Badge className={classes.margin} badgeContent={item.is_read} color="secondary">
                                                <Avatar src={item.friend.user_profile_photo}>
                                                </Avatar>
                                            </Badge>}
                                            {item.status == 0 && <ListItemText primary={item.friend.user_name} secondary="待同意" />}
                                            {item.status == 1 && <ListItemText primary={item.friend.user_name} secondary="已同意" />}
                                            {item.status == 2 && <ListItemText primary={item.friend.user_name} secondary="已拒绝" />}
                                            {/* <ListItemSecondaryAction>
                                                <IconButton className={classes.button} aria-label="Delete">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction> */}
                                        </ListItem>
                                    )}

                                </List>
                            </Collapse>
                            {/* <ListItem>
                                <Avatar>
                                    <ImageIcon />
                                </Avatar>
                                <ListItemText primary="通知提醒" />
                            </ListItem>
                            <li>
                                <Divider variant="inset" />
                            </li> */}
                            {/* 聊天 */}
                            <List className={classes.root} ref='chat'>
                                {this.state.chatList.map(item => <ListItem onClick={this.toChat.bind(this, item)} key={item.id} className='chatItem'>
                                    <Badge className={classes.margin} badgeContent={item.message_num} color="secondary">
                                        <Avatar src={item.friendInfo.user_profile_photo}>
                                        </Avatar>
                                    </Badge>
                                    <ListItemText primary={item.friendInfo.user_name} secondary={item.last_message} />
                                    <div className='chatTime'>{moment(item.chatTime).fromNow()}</div>
                                </ListItem>)}
                            </List>
                            {/* 子页 */}
                            <Dialog
                                fullScreen
                                open={this.state.open}
                                onClose={this.handleClose}
                                TransitionComponent={Transition}
                            >
                                {this.state.open == true && this.state.isDetail == true && <UserDetail {...this.state.item} closePage={this.closePage.bind(this)} from='request'></UserDetail>}
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