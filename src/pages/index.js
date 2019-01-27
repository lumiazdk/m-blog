import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import CssBaseline from '@material-ui/core/CssBaseline';
import Swiper from 'swiper'
import indexStyles from './index.scss'
import Message from './message/message.js'
import User from './user/user.js'
import Category from './category/category.js'
import Friends from './friends/friends.js'
import Find from './find/find.js'
import SwipeableViews from 'react-swipeable-views';

import './icon.scss'
import axios from 'axios'
import io from 'socket.io-client';
import SocketIOClient from './socket.js'
const socket = io('http://192.168.0.10:8080');
global.socket = socket
SocketIOClient()
axios.defaults.baseURL = 'http://192.168.0.10:8080/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NDgyNjY4NDkzMTAsIm5hbWUiOiIxMjMifQ.LohSTredC55QcoNI4g7WF_JwpmACbuPNbRd-MXuDIv0';
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response.data;

}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
console.log(indexStyles)
const styles = {
  root: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    // width: 500,
  },
  tab: {
    minWidth: 'auto'
  },
  slide: {
    height: '100%'
  },
};

class Index extends React.Component {
  state = {
    value: localStorage.page ? parseInt(localStorage.page) : 0,
    mySwiper: ''
  };

  handleChange = (event, value) => {
    this.setState({ value });
    localStorage.page = value
  };
  handleChangeIndex = value => {
    this.setState({
      value,
    });
    localStorage.page = value

  };
  componentDidMount() {
    let _this = this
  }
  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <div className='index'>
        <SwipeableViews index={value} onChangeIndex={this.handleChangeIndex} style={{ height: '100%' }}>
          <div style={Object.assign({}, styles.slide)}><Category></Category></div>
          <div style={Object.assign({}, styles.slide)}><Message></Message></div>
          <div style={Object.assign({}, styles.slide)}><Friends></Friends></div>
          <div style={Object.assign({}, styles.slide)}><Find></Find></div>
          <div style={Object.assign({}, styles.slide)}><User></User></div>
        </SwipeableViews>
        <CssBaseline />
        <BottomNavigation
          value={value}
          onChange={this.handleChange}
          className={classes.root}
          showLabels
        >
          <BottomNavigationAction label="首页" icon={<i className='iconfont icon-home-fill'></i>} className={classes.tab} />
          <BottomNavigationAction label="消息" icon={<i className='iconfont icon-xiaoxi'></i>} className={classes.tab} />
          <BottomNavigationAction label="好友" icon={<i className='iconfont icon-tianchongxing-'></i>} className={classes.tab} />
          <BottomNavigationAction label="发现" icon={<i className='iconfont icon-faxian'></i>} className={classes.tab} />
          <BottomNavigationAction label="我的" icon={<i className='iconfont icon-wode'></i>} className={classes.tab} />
        </BottomNavigation>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Index);