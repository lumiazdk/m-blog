import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router'
import axios from 'axios'
import { withSnackbar } from 'notistack';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import './addPost.scss'
import E from 'wangeditor'
import Select from '@material-ui/core/Select';
import ImageCompressor from 'image-compressor.js'
const options = [
    {
        k: 'addPost',
        name: '添加文章'
    },
    {
        k: 'infoSetting',
        name: '资料设置'
    },
    {
        k: 'logout',
        name: '退出登录'
    },
];
const ITEM_HEIGHT = 48;

const styles = theme => ({
    card: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    },
    playIcon: {
        height: 38,
        width: 38,
    },
    bigAvatar: {
        margin: 10,
        width: 60,
        height: 60,
    },
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    input: {
        display: 'none',
    },
    button: {
        margin: theme.spacing.unit,
    },
});
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
class User extends React.Component {
    state = {
        userInfo: {},
        anchorEl: null,
        open: false,
        imgPath: '',
        file: '',
        editorContent: '',
        aid: '',
        title: '',
        content: '',
        cid: '',
        describes: '',
        background: '',
        error: {
            aid: '',
            title: '',
            content: '',
            cid: "",
            describes: '',
            background: ''
        },
        categorylist: []
    };

    enqueueSnackbar = (text, variant) => {
        this.props.enqueueSnackbar(text, {
            variant: variant,
            autoHideDuration: 2000,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'left',
            },
        });
    }

    async componentDidMount() {
        await this.setState({ userInfo: JSON.parse(localStorage.userInfo) })
        let category = await this.getCategory()
        this.setState({
            categorylist: category.result.data
        })

    }


    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };
    //关闭菜单
    handleClose = (event) => {
        this.setState({ anchorEl: null });

    };
    //menu菜单选项
    handleMenuItemClick = async (event, index) => {
        // this.setState({ selectedIndex: index, anchorEl: null });
        console.log(index)
        if (index == 'addPost') {
            await this.setState({ open: true });
            const elem = this.refs.editorElem
            const editor = new E(elem)
            editor.customConfig.menus = [
                'head',//
                'bold',//
                'list',  // 列表
                'justify',  // 对齐方式
                'image',  // 插入图片
                'undo',  // 撤销
            ];
            //关闭粘贴样式的过滤
            editor.customConfig.pasteFilterStyle = false;
            //忽略粘贴内容中的图片
            editor.customConfig.pasteIgnoreImg = true;
            // 使用 base64 保存图片
            editor.customConfig.uploadImgShowBase64 = true;
            // 隐藏“网络图片”tab
            editor.customConfig.showLinkImg = false;
            //改变z-index
            editor.customConfig.zIndex = 10;
            // 最大300M

            // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
            editor.customConfig.onchange = html => {
                this.setState({
                    content: html
                })
            }
            editor.create()
            this.handleClose()
        }
        if (index == 'logout') {
            localStorage.clear();
            this.props.history.push('/login')
        }
        if (index == 'infoSetting') {
            this.props.history.push('/infoSetting')
        }
    };
    //打开添加文章
    addPosthandleClickOpen = () => {
        this.setState({ open: true });
    };
    //关闭添加文章
    addPosthandleClose = () => {
        this.setState({ open: false });
    };
    //获取分类
    getCategory = () => {
        let data = axios({
            method: 'post',
            url: 'getAllCategory',
            data: {

            }
        });
        return data
    }
    categorychange = (event) => {

        this.setState({ cid: event.target.value });
    }
    //表单
    titleChange = event => {
        this.setState({ title: event.target.value });
    };
    describesChange = event => {
        this.setState({ describes: event.target.value });

    };

    titleblur = () => {
        if (this.state.title == '') {
            let error = { ...this.state.error }
            error.title = '标题不能为空'
            this.setState({ error })
            return false
        } else {
            let error = { ...this.state.error }
            error.title = ''
            this.setState({ error })
            return true

        }
    }
    describesblur = () => {
        if (this.state.describes == '') {
            let error = { ...this.state.error }
            error.describes = '描述不能为空'
            this.setState({ error })
            return false
        } else {
            let error = { ...this.state.error }
            error.describes = ''
            this.setState({ error })
            return true

        }
    }
    cidblur = () => {
        if (this.state.cid == '') {
            let error = { ...this.state.error }
            error.cid = '分类不能为空'
            this.setState({ error })
            return false
        } else {
            let error = { ...this.state.error }
            error.cid = ''
            this.setState({ error })
            return true
        }
    }
    send = async () => {
        let { title, content, describes, background, cid } = this.state
        let _this = this
        if (this.titleblur() && this.describesblur() && this.cidblur()) {
            if (this.state.background == '') {
                this.enqueueSnackbar('请选择背景图片', 'error')
                return
            }
            if (this.state.content == '') {
                this.enqueueSnackbar('请书写文章', 'error')
                return
            }
            new ImageCompressor(background, {
                quality: 0,
                success: async (result) => {
                    let formData = new FormData();
                    formData.append('title', title)
                    formData.append('aid', this.state.userInfo.user_id)
                    formData.append('content', content)
                    formData.append('cid', cid)
                    formData.append('describes', describes)
                    formData.append('background', result)
                    let data = await axios({
                        method: 'post',
                        url: 'addPost',
                        data: formData
                    });
                    if (data.code == 1) {
                        this.enqueueSnackbar('添加成功', 'success')

                    } else {
                        this.enqueueSnackbar(data.message, 'error')
                    }
                },
                error(e) {
                    console.log(e.message);
                },
            });


        }
    }
    //图片
    getFile = (e) => {
        const reader = new FileReader();
        // 读取文件内容，结果用data:url的字符串形式表示
        let file = e.target.files[0]
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            console.log(e.target.result);  // 上传的图片的编码
            this.setState({
                imgPath: e.target.result
            });
            this.setState({
                background: file
            });
        }.bind(this);
    }
    render() {
        const { classes, theme } = this.props;
        const { userInfo, anchorEl } = this.state
        const open = Boolean(anchorEl);
        return (
            <div >
                <Dialog
                    fullScreen
                    open={this.state.open}
                    onClose={this.addPosthandleClose}
                    TransitionComponent={Transition}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.addPosthandleClose} aria-label="Close">
                                <i className='iconfont icon-iconfontjiantou'></i>
                            </IconButton>
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                            </Typography>
                            <Button color="inherit" onClick={this.send}>
                                发送
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <form className='formwrapper'>
                        <div className='formItem'>
                            <FormControl className='FormControl' error={this.state.error.title ? true : false} aria-describedby="component-error-text">
                                <InputLabel htmlFor="component-title">标题</InputLabel>
                                <Input id="component-title" value={this.state.title} onChange={this.titleChange} onBlur={this.titleblur} />
                                {this.state.error.title && <FormHelperText id="component-error-text">{this.state.error.title}</FormHelperText>}
                            </FormControl>
                        </div>
                        <div className='formItem'>
                            <FormControl className='FormControl' error={this.state.error.describes ? true : false} aria-describedby="component-error-text">
                                <InputLabel htmlFor="component-title">描述</InputLabel>
                                <Input id="component-title" value={this.state.describess} onChange={this.describesChange} onBlur={this.describesblur} type='text' />
                                {this.state.error.describes && <FormHelperText id="component-error-text">{this.state.error.describes}</FormHelperText>}
                            </FormControl>
                        </div>
                        <div className='formItem'>

                            <FormControl className='FormControl' error={this.state.error.cid ? true : false} onBlur={this.cidblur}>
                                <InputLabel htmlFor="age-simple">分类</InputLabel>
                                <Select
                                    value={this.state.cid}
                                    onChange={this.categorychange}
                                    inputProps={{
                                        name: 'category',
                                    }}
                                >
                                    {this.state.categorylist.map((item) => <MenuItem value={item.categoryId} key={item.categoryId}>{item.name}</MenuItem>)}
                                </Select>
                                {this.state.error.cid && <FormHelperText id="component-error-text">{this.state.error.cid}</FormHelperText>}

                            </FormControl>
                        </div>
                        <Card className={classes.card}>
                            <img src={this.state.imgPath} alt="" width='100%' height='219px' />
                        </Card>
                        <input
                            accept="image/*"
                            className={classes.input}
                            id="contained-button-file"
                            multiple
                            type="file"
                            onChange={this.getFile}
                        />
                        <div className='formItem'>
                            <label htmlFor="contained-button-file">
                                <Button variant="contained" component="span" className={classes.button}>
                                    添加封面背景
                                </Button>
                            </label>
                        </div>
                        <div className='formItem'>
                            <div ref="editorElem" style={{ textAlign: 'left' }}>
                            </div>
                        </div>
                    </form>
                </Dialog>
                <Card className={classes.card}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            alt="Contemplative Reptile"
                            className={classes.media}
                            height="140"
                            image="/img/bj.jpg"
                            title="Contemplative Reptile"
                        />
                        <CardHeader
                            avatar={
                                <Avatar alt="头像" src={userInfo.user_profile_photo} className={classes.bigAvatar} />
                            }
                            action={

                                <div>
                                    <div
                                        aria-label="More"
                                        aria-owns={open ? 'long-menu' : undefined}
                                        aria-haspopup="true"
                                        onClick={this.handleClick}
                                    >
                                        <MoreVertIcon />
                                    </div>
                                    <Menu
                                        id="long-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={this.handleClose}
                                        PaperProps={{
                                            style: {
                                                maxHeight: ITEM_HEIGHT * 4.5,
                                                width: 200,
                                            },
                                        }}
                                    >
                                        {options.map(option => (
                                            <MenuItem key={option.k} selected={option === 'Pyxis'} onClick={event => this.handleMenuItemClick(event, option.k)}>
                                                {option.name}

                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </div>
                            }
                            title={userInfo.user_name}
                        // subheader="September 14, 2016"
                        />
                        <CardContent>

                            <Typography component="p">
                                {userInfo.motto}
                            </Typography>
                        </CardContent>
                    </CardActionArea>

                </Card>
            </div>
        );
    }

}

User.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withSnackbar(withStyles(styles, { withTheme: true })(User)));
