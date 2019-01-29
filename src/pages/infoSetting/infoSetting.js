import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { PureComponent } from 'react';
import { DatePicker } from 'material-ui-pickers';
import moment from 'moment';
import axios from 'axios'
import TextField from '@material-ui/core/TextField';
import { withSnackbar } from 'notistack';
import ImageCompressor from 'image-compressor.js'

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
    bigAvatar: {
        margin: 10,
        width: 60,
        height: 60,
    },
    grow: {
        flexGrow: 1,
    },
    formControl: {
        width: '80%'
    }
});

class InfoSetting extends PureComponent {
    state = {
        background: '',
        imgPath: '',
        user_name: '',
        user_email: '',
        user_profile_photo: '',
        user_birthday: moment(),
        user_age: '',
        user_nickname: '',
        motto: '',
        error: {
            user_name: '',
        }
    }
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
    componentDidMount() {
        this.getDetail()
    }
    //返回
    back = () => {
        const { match, location, history } = this.props
        history.goBack()

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
                user_profile_photo: file
            });
        }.bind(this);
    }
    //表单
    user_nameChange = (event) => {
        this.setState({ user_name: event.target.value });
    }
    user_emailChange = (event) => {
        this.setState({ user_email: event.target.value });
    }
    user_birthdayChange = (date) => {
        this.setState({ user_birthday: date });
    }
    user_ageChange = (event) => {
        this.setState({ user_age: event.target.value });
    }
    user_nicknameChange = (event) => {
        this.setState({ user_nickname: event.target.value });
    }
    mottoChange = (event) => {
        this.setState({ motto: event.target.value });
    }
    user_nameblur = () => {
        if (this.state.user_name == '') {
            let error = { ...this.state.error }
            error.user_name = '姓名不能为空'
            this.setState({ error })
            return false
        } else {
            let error = { ...this.state.error }
            error.user_name = ''
            this.setState({ error })
            return true

        }
    }
    //设置
    set = async () => {


        if (this.user_nameblur()) {
            new ImageCompressor(this.state.user_profile_photo, {
                quality: 0,
                success: async (result) => {
                    var formData = new FormData();
                    formData.append("user_id", JSON.parse(localStorage.userInfo).user_id);
                    formData.append("user_name", this.state.user_name);
                    formData.append("user_email", this.state.user_email);
                    formData.append("user_profile_photo", result);
                    formData.append("user_birthday", moment(this.state.user_birthday).format('YYYY-MM-DD'));
                    formData.append("user_age", this.state.user_age ? this.state.user_age : 0);
                    formData.append("motto", this.state.motto);
                    formData.append("user_nickname", this.state.user_nickname);
                    let data = await axios({
                        method: 'post',
                        url: 'updateUserInfo',
                        data: formData
                    });
                    if (data.code == 1) {
                        localStorage.userInfo = JSON.stringify(data.result.userInfo)
                        this.enqueueSnackbar('更新成功', 'success')
                    } else {
                        this.enqueueSnackbar('更新失败', 'error')
                    }
                },
                error(e) {
                    console.log(e.message);
                },
            });



        }
    }
    getDetail = async () => {
        let data = await axios({
            method: 'post',
            url: 'userInfo',
            data: {
                user_telephone_number: JSON.parse(localStorage.userInfo).user_telephone_number
            }
        });
        if (data.code == 1) {
            let result = data.result.userInfo
            this.setState(() => ({ user_name: result['user_name'] ? result['user_name'] : '' }))
            this.setState(() => ({ user_email: result['user_email'] ? result['user_email'] : '' }))
            this.setState(() => ({ imgPath: result['user_profile_photo'] ? result['user_profile_photo'] : '' }))
            this.setState(() => ({ user_birthday: result['user_birthday'] ? result['user_birthday'] : '' }))
            this.setState(() => ({ user_age: result['user_age'] ? result['user_age'] : '' }))
            this.setState(() => ({ user_nickname: result['user_nickname'] ? result['user_nickname'] : '' }))
            this.setState(() => ({ motto: result['motto'] ? result['motto'] : '' }))
        }
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.back}>
                            <i className='iconfont icon-back'></i>
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            资料设置
                        </Typography>
                        <Button color="inherit" onClick={this.set}>设置</Button>
                    </Toolbar>
                </AppBar>
                <Grid
                    container
                    direction="column"
                    justify="space-evenly"
                    alignItems="center"
                    style={{
                        marginTop: '10px'
                    }}
                >
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={this.getFile}
                    />
                    <label htmlFor="contained-button-file">
                        <Avatar alt="Remy Sharp" src={this.state.imgPath} className={classes.bigAvatar} />
                    </label>
                    <FormControl className={classes.formControl} error={this.state.error.user_name ? true : false} aria-describedby="component-error-text">
                        <InputLabel htmlFor="user_name">姓名</InputLabel>
                        <Input id="user_name" value={this.state.user_name} onChange={this.user_nameChange} onBlur={this.user_nameblur} />
                        {this.state.error.user_name && <FormHelperText id="component-error-text">{this.state.error.user_name}</FormHelperText>}
                    </FormControl>
                    <FormControl className={classes.formControl} aria-describedby="component-error-text">
                        <InputLabel htmlFor="user_nickname">昵称</InputLabel>
                        <Input id="user_nickname" value={this.state.user_nickname} onChange={this.user_nicknameChange} />
                    </FormControl>
                    <TextField
                        id="filled-multiline-static"
                        label="个性签名"
                        multiline
                        rows="4"
                        className={classes.formControl}
                        margin="normal"
                        value={this.state.motto}
                        onChange={this.mottoChange}
                    />
                    {/* <FormControl className={classes.formControl} aria-describedby="component-error-text">
                        <InputLabel htmlFor="motto">个性签名</InputLabel>
                        <Input id="motto" value={this.state.motto} onChange={this.mottoChange} />
                    </FormControl> */}
                    <FormControl className={classes.formControl} aria-describedby="component-error-text">
                        <InputLabel htmlFor="user_email">电子邮件</InputLabel>
                        <Input id="user_email" value={this.state.user_email} onChange={this.user_emailChange} />
                    </FormControl>
                    <DatePicker
                        label="生日"
                        clearable
                        okLabel="确定"
                        cancelLabel="取消"
                        clearLabel="清除"
                        value={this.state.user_birthday}
                        onChange={this.user_birthdayChange}
                        animateYearScrolling
                        className={classes.formControl}
                    />
                    <FormControl className={classes.formControl} aria-describedby="component-error-text">
                        <InputLabel htmlFor="component-title">年龄</InputLabel>
                        <Input id="user_age" value={this.state.user_age} onChange={this.user_ageChange} />
                    </FormControl>

                </Grid>
            </div>
        );
    }

}

InfoSetting.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withSnackbar(withStyles(styles)(InfoSetting));