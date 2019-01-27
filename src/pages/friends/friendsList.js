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

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class FriendsList extends React.Component {
  state = {
    newfriendList: []
  }
  componentDidMount() {
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
  render() {
    const { classes } = this.props;
    return (
      <List className={classes.root}>
        {this.state.newfriendList.map(item => <React.Fragment key={item.id}>
          <ListItem >
            <Avatar src={item.friendInfo.user_profile_photo}>
            </Avatar>
            <ListItemText primary={item.friendInfo.user_name} />
          </ListItem><Divider />
        </React.Fragment>)}
      </List>
    );
  }

}

FriendsList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FriendsList);