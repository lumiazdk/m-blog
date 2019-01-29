import React from 'react';
import PropTypes from 'prop-types';
import './login.scss'
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withRouter } from 'react-router'
import axios from 'axios'
import { withSnackbar } from 'notistack';
import SocketIOClient from '../socket.js'

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
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
});

class Login extends React.Component {
    state = {
        user_telephone_number: '',
        user_password: '',
        phoneerr: '',
        passworderr: '',
        open: false,
        dialogText: '',
        isLogin: true
    };
    phoneChange = event => {
        this.setState({ user_telephone_number: event.target.value });
    };
    passwordChange = event => {
        this.setState({ user_password: event.target.value });
    };
    phoneblur = () => {
        let { user_telephone_number } = this.state
        const [phoneerr, passworderr] = ['手机号不正确', '密码不能为空']
        if (!/^1[34578]\d{9}$/.test(user_telephone_number)) {
            this.setState({ phoneerr })
            return
        } else {
            this.setState({ phoneerr: '' })
        }
    }
    passwordblur = () => {
        let { user_telephone_number, user_password } = this.state
        const [phoneerr, passworderr] = ['手机号不正确', '密码不能为空']
        if (user_password == '') {
            const [phoneerr, passworderr] = ['手机号不正确', '密码不能为空']
            this.setState({ passworderr })
            return
        } else {
            this.setState({ passworderr: '' })
        }
    }
    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };
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
    login = async () => {

        let { user_telephone_number, user_password } = this.state
        const [phoneerr, passworderr] = ['手机号不正确', '密码不能为空']
        if (!/^1[34578]\d{9}$/.test(user_telephone_number)) {
            this.setState({ phoneerr })
            return
        } else {
            this.setState({ phoneerr: '' })
        }
        if (user_password == '') {
            const [phoneerr, passworderr] = ['手机号不正确', '密码不能为空']
            this.setState({ passworderr })
            return
        } else {
            this.setState({ passworderr: '' })
        }
        let data = await axios({
            method: 'post',
            url: 'login',
            data: {
                user_telephone_number,
                user_password
            }
        });
        if (data.code == 1) {
            this.enqueueSnackbar(data.message, 'success')
            localStorage.token = data.result.token
            localStorage.userInfo = JSON.stringify(data.result.userInfo)
            const { match, location, history } = this.props
            SocketIOClient()
            history.push('/')
        } else {
            this.enqueueSnackbar(data.message, 'error')
        }
    }
    changeLogin = () => {
        this.setState({
            isLogin: !this.state.isLogin
        })
    }
    registwer = async () => {
        let { user_telephone_number, user_password } = this.state
        const [phoneerr, passworderr] = ['手机号不正确', '密码不能为空']
        if (!/^1[34578]\d{9}$/.test(user_telephone_number)) {
            this.setState({ phoneerr })
            return
        } else {
            this.setState({ phoneerr: '' })
        }
        if (user_password == '') {
            const [phoneerr, passworderr] = ['手机号不正确', '密码不能为空']
            this.setState({ passworderr })
            return
        } else {
            this.setState({ passworderr: '' })
        }
        let data = await axios({
            method: 'post',
            url: 'register',
            data: {
                user_telephone_number,
                user_password
            }
        });
        if (data.code == 1) {
            this.enqueueSnackbar(data.message, 'success')

            localStorage.token = data.result.token
            localStorage.userInfo = JSON.stringify(data.result.userInfo)
            const { match, location, history } = this.props
            history.push('/')
        } else {
            this.enqueueSnackbar(data.message, 'warning')
        }
    }
    render() {
        const { classes } = this.props;
        const { isLogin } = this.state
        return (
            <div className='logincontent'>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">提示</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" style={{ color: 'rgb(225, 0, 80)' }}>
                            {this.state.dialogText}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    </DialogActions>
                </Dialog>
                <div className={classes.root}>
                    <AppBar position="static">
                        <Toolbar>
                            {this.state.isLogin && <Typography variant="h6" color="inherit" className={classes.grow}>
                                登陆
                            </Typography>}
                            {!this.state.isLogin && <Typography variant="h6" color="inherit" className={classes.grow}>
                                注册
                            </Typography>}
                            {this.state.isLogin && <Button color="inherit" onClick={this.changeLogin}>注册</Button>}
                            {!this.state.isLogin && <Button color="inherit" onClick={this.changeLogin}>登陆</Button>}


                        </Toolbar>
                    </AppBar>
                </div>
                <div className='login'>
                    <div className='input'>
                        <FormControl className={classes.formControl} error={this.state.phoneerr ? true : false} aria-describedby="component-error-text">
                            <InputLabel htmlFor="component-phone">手机号</InputLabel>
                            <Input id="component-phone" value={this.state.user_telephone_number} onChange={this.phoneChange} onBlur={this.phoneblur} />
                            {this.state.phoneerr && <FormHelperText id="component-error-text">{this.state.phoneerr}</FormHelperText>}
                        </FormControl>
                    </div>
                    <div className='input'>
                        <FormControl className={classes.formControl} error={this.state.passworderr ? true : false} aria-describedby="component-error-text">
                            <InputLabel htmlFor="component-password">密码</InputLabel>
                            <Input id="component-password" value={this.state.user_password} onChange={this.passwordChange} type='password' onBlur={this.passwordblur} />
                            {this.state.passworderr && <FormHelperText id="component-error-text">{this.state.passworderr}</FormHelperText>}
                        </FormControl>
                    </div>
                    <div className='loginbtn'>
                        {isLogin && <Button variant="contained" color="primary" className={classes.button} onClick={this.login}>
                            登陆
                        </Button>}
                        {!isLogin && <Button variant="contained" color="secondary" className={classes.button} onClick={this.registwer}>
                            注册
                        </Button>}
                    </div>
                </div>


            </div>

        );
    }

}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withSnackbar(withStyles(styles)(Login)));
