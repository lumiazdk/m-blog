import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FriendList from './friendsList'
import Rooms from './rooms.js'
import Recent from './recent.js'
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CommentIcon from '@material-ui/icons/Comment';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import axios from 'axios'
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withSnackbar } from 'notistack';

function TabContainer(props) {
  return (
    <Typography component="div">
      {props.children}
    </Typography>
  );
}
function Transition(props) {
  return <Slide direction="up" {...props} />;
}
function sureTransition(props) {
  return <Slide direction="up" {...props} />;
}
const afoptions = [
  {
    k: 'add',
    name: '添加'
  },
  {
    k: 'follow',
    name: '关注'
  }
];
const afITEM_HEIGHT = 48;
const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    height: '100%'
  },
  button: {
    color: 'white'
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
    zIndex: 10
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: 200,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
});

class Friends extends React.Component {
  state = {
    value: 'one',
    addfriendopen: false,
    afanchorEl: null,
    friendList: [],
    user_id: '',
    sureopen: false,
    user_name: ''
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
  handleChange = (event, value) => {
    this.setState({ value });
  };
  addfriendopen = () => {
    this.setState({ addfriendopen: true });
  };
  addfriendclose = () => {
    this.setState({ addfriendopen: false });
  };
  //addfriend menu
  afhandleClick = event => {
    this.setState({ afanchorEl: event.currentTarget });
  };

  afhandleClose = (k, item) => {
    if (k == 'add') {
      console.log(k, item)
      this.setState({
        user_id: item.user_id,
        user_name: item.user_name
      })
      this.surehandleClickOpen()

    }
    this.setState({ afanchorEl: null });
  };
  //获取好友
  getFriends = async (event) => {
    if ((/^1[34578]\d{9}$/.test(event.currentTarget.value)) && (event.currentTarget.value != JSON.parse(localStorage.userInfo).user_telephone_number)) {
      let data = await axios({
        method: 'post',
        url: 'getUsers',
        data: {
          page: 1,
          pageSize: 99999,
          where: {
            user_telephone_number: event.currentTarget.value
          }
        }
      });
      if (data.code == 1) {
        this.setState({
          friendList: data.result.data
        })
      }
    }
  }
  //确认添加
  surehandleClickOpen = () => {
    this.setState({ sureopen: true });
  };

  surehandleClose = () => {
    this.setState({ sureopen: false });
  };
  //添加好友
  sureadd = async () => {
    let data = await axios({
      method: 'post',
      url: 'addFriend',
      data: {
        user_id: JSON.parse(localStorage.userInfo).user_id,
        friend_id: this.state.user_id,
        status: 0,
        request_id: JSON.parse(localStorage.userInfo).user_id
      }
    });
    if (data.code == 1) {
      this.enqueueSnackbar('请求成功', 'success')
      this.surehandleClose()
    } else {
      this.enqueueSnackbar('请求失败', 'error')
      this.surehandleClose()
    }
  }
  render() {
    const { classes } = this.props;
    const { value, afanchorEl } = this.state;
    const afopen = Boolean(afanchorEl);
    return (
      <div className={classes.root} style={{ position: 'relative' }}>
        {this.state.value == 'two' && <Fab color="secondary" className={classes.absolute}>
          <AddIcon onClick={this.addfriendopen} />
        </Fab>}

        <AppBar position="absolute">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            centered
          >
            <Tab value="one" label="最近" />
            <Tab value="two" label="好友" />
            {/* <Tab value="three" label="群组" /> */}
          </Tabs>
        </AppBar>
        {value === 'one' && <TabContainer><Recent></Recent></TabContainer>}
        {value === 'two' && <TabContainer><FriendList></FriendList></TabContainer>}
        {/* {value === 'three' && <TabContainer><Rooms></Rooms></TabContainer>} */}
        {/* 添加好友 */}
        <Dialog
          fullScreen
          open={this.state.addfriendopen}
          onClose={this.addfriendclose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar} position="static">
            <Toolbar>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="搜索手机号"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    onChange={this.getFriends}
                  />
                </div>
                <Button color="inherit" onClick={this.addfriendclose}>
                  完成
              </Button>
              </Grid>

            </Toolbar>
          </AppBar>

          <List className={classes.root}>
            {this.state.friendList.map(item =>
              <ListItem key={item.user_id}>
                <Avatar src={item.user_profile_photo}>

                </Avatar>
                <ListItemText primary={item.user_name} secondary={item.motto} />
                <ListItemSecondaryAction>
                  <IconButton
                    aria-label="More"
                    aria-owns={afopen ? 'long-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.afhandleClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={afanchorEl}
                    open={afopen}
                    onClose={this.afhandleClose}
                    PaperProps={{
                      style: {
                        maxHeight: afITEM_HEIGHT * 4.5,
                        width: 200,
                      },
                    }}
                  >
                    {afoptions.map(option => (
                      <MenuItem key={option.k} onClick={this.afhandleClose.bind(this, option.k, item)}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Menu>
                </ListItemSecondaryAction>
              </ListItem>)}

          </List>
          <Dialog
            open={this.state.sureopen}
            TransitionComponent={sureTransition}
            keepMounted
            onClose={this.surehandleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              确认添加{this.state.user_name}为好友？
          </DialogTitle>
            <DialogActions>
              <Button onClick={this.surehandleClose} color="primary">
                取消
            </Button>
              <Button onClick={this.sureadd} color="primary">
                同意
            </Button>
            </DialogActions>
          </Dialog>
        </Dialog>
        {/* 确认添加 */}

      </div>
    );
  }
}

Friends.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withSnackbar(withStyles(styles)(Friends));