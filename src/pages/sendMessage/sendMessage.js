import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import './sendMessage.scss'
import Swiper from 'swiper'
import axios from 'axios'

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

class SendMessage extends React.Component {
    state = {
        message: '',
        messageList: [],
        swiper: '',


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
        this.setState({
            swiper
        })

        if (!this.props.chat_id) {
            let getChatId = await this.getChatId()
            if (getChatId.length > 0) {
                await this.setState({
                    chat_id: getChatId.result.chat[0].id,
                })
            } else {
                let addChat = await this.addChat()
                if (addChat.code == 1) {
                    getChatId = await this.getChatId()
                    await this.setState({
                        chat_id: getChatId.result.chat[0].id
                    })
                }
            }
        }
        await this.getMessage()
        global.socket.on('getMessage', () => {
            if (this.refs.sendMessage) {
                this.getMessage()
            }
        })
        swiper.slideTo(1, 0, false)

    }

    //关闭
    handleClose = async (event) => {
        let data = axios({
            method: 'post',
            url: 'updateChat',
            data: {
                friend_id: this.props.friend_id,
                user_id: JSON.parse(localStorage.userInfo).user_id,
            }
        });
        if (this.props.getChat) {
            this.props.getChat()
        }
        this.props.handleClose()
    }
    //获取chatId
    getChatId = () => {
        let data = axios({
            method: 'post',
            url: 'getOneChat',
            data: {
                friend_id: this.props.friend_id,
                user_id: JSON.parse(localStorage.userInfo).user_id,
            }
        });
        return data
    }
    //文字
    messageChange = (event) => {
        this.setState({
            message: event.target.value
        })
    }
    //addChat
    addChat = () => {
        let data = axios({
            method: 'post',
            url: 'addChat',
            data: {
                user_id: JSON.parse(localStorage.userInfo).user_id,
                friend_id: this.props.friend_id,
            }
        });
        return data

    }
    sendMessage = async () => {
        let data = await axios({
            method: 'post',
            url: 'addMessage',
            data: {
                chat_id: this.props.id ? this.props.id : this.state.chat_id,
                user_id: JSON.parse(localStorage.userInfo).user_id,
                friend_id: this.props.friend_id,
                message: this.state.message
            }
        });
        if (data.code == 1) {
            this.setState({
                message: ''
            })
            this.getMessage(300)
            global.socket.emit('getMessage', { user_id: this.props.friend_id })
        }
    }
    //获取所有聊天记录
    getMessage = async (time = 0) => {
        let data = await axios({
            method: 'post',
            url: 'getMessage',
            data: {
                chat_id: this.props.id ? this.props.id : this.state.chat_id,
            }
        });
        if (data.code == 1) {
            await this.setState({
                messageList: data.result.message
            })
            this.state.swiper.update()
            this.state.swiper.slideTo(1, time, false)
        }
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root} className='sendMessage' ref='sendMessage'>
                <AppBar position="absolute">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.handleClose}>
                            <i className='iconfont icon-back'></i>
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            {this.props.user_name}
                        </Typography>
                        {/* <Button color="inherit">Login</Button> */}
                    </Toolbar>
                </AppBar>

                <ul className="chat-thread" ref='wrapper'>
                    <div className="swiper-wrapper" ref='swiperwrapper'>
                        <div className="swiper-slide fix" ref='swiperslide'>
                            {this.state.messageList.map(item => {
                                if (item.user_id == JSON.parse(localStorage.userInfo).user_id) {
                                    return (<li className="me animated slideInRight" key={item.id}>
                                        <Avatar alt="Remy Sharp" className='Avatar' src={JSON.parse(localStorage.userInfo).user_profile_photo} />
                                        {item.message}</li>)
                                } else {
                                    return (<li className="you animated slideInLeft" key={item.id}>
                                        <Avatar alt="Remy Sharp" className='Avatar' src={this.props.user_profile_photo} />
                                        {item.message}</li>)
                                }

                            })}

                        </div>
                    </div>

                </ul>

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
                                value={this.state.message}
                                style={{ margin: '5px' }}
                                onChange={this.messageChange}

                            />
                        </Grid>
                        <Grid item xs={2}
                            container
                            justify="flex-end"
                            alignItems="center"
                        >
                            <Button color="primary" className={classes.button} onClick={this.sendMessage}>
                                发送
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>


            </div>
        );
    }

}

SendMessage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SendMessage);