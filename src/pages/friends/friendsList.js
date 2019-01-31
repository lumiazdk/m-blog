import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import axios from 'axios'
import Divider from '@material-ui/core/Divider';
import Swiper from 'swiper'
import './friendsList.scss'
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';
import UserDetail from '../userDetail/userDetail.js'
const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});
function Transition(props) {
  return <Slide direction="left" {...props} />;
}
class FriendsList extends React.Component {
  state = {
    newfriendList: [],
    open: false,//子页
    title: '详情',


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
    this.getFriends()
  }
  //获取好友
  getFriends = async (event) => {
    let data = await axios({
      method: 'post',
      url: 'getallFriend',
      data: {
        user_id: JSON.parse(localStorage.userInfo).user_id,
        status: 1
      }
    });
    if (data.code == 1) {
      this.setState({
        newfriendList: data.result.data
      })
    }
  }
  //子页
  handleClickOpen = (item) => {
    this.setState({
      item: item,
      open: true

    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  render() {
    const { classes } = this.props;
    return (
      <div ref='wrapper' className='wrapper friendsList'>
        <div className="swiper-wrapper" ref='swiperwrapper'>
          <div className="swiper-slide" style={{ height: 'auto' }} ref='swiperslide'>
            <List className={classes.root}>
              {this.state.newfriendList.map(item => <React.Fragment key={item.id}>
                <ListItem onClick={this.handleClickOpen.bind(this, item)}>
                  <Avatar src={item.friendInfo.user_profile_photo}>
                  </Avatar>
                  <ListItemText primary={item.friendInfo.user_name} />
                </ListItem><Divider />
              </React.Fragment>)}
            </List>
          </div>
        </div>
        {/* 子页 */}
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          {this.state.open == true && <UserDetail {...this.state.item} closePage={this.handleClose.bind(this)} from='friend'></UserDetail>}
        </Dialog>
      </div>

    );
  }
}

FriendsList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FriendsList);