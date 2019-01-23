import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CssBaseline from '@material-ui/core/CssBaseline';
import Swiper from 'swiper'
import indexStyles from './index.scss'
import HomeList from './home/homeList.js'
import User from './user/user.js'

import axios from 'axios'
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
  },
};

class Index extends React.Component {
  state = {
    value: 0,
    mySwiper: ''
  };

  handleChange = (event, value) => {
    this.setState({ value });
    console.log(value)
    this.state.mySwiper.slideTo(value, 500, false);//切换到第一个slide，速度为1秒
  };
  componentDidMount() {
    let _this = this
    var mySwiper = new Swiper('.swiper-container', {
      autoplay: false,//可选选项，自动滑动
      direction: 'horizontal', // 垂直切换选项
      loop: false, // 循环模式选项
      on: {
        slideChangeTransitionEnd: function () {
          console.log(this.activeIndex);//切换结束时，告诉我现在是第几个slide
          _this.setState({
            value: this.activeIndex
          })
        },
      }
    })
    this.setState({
      mySwiper
    })
    mySwiper.slideTo(2, 500, false);//切换到第一个slide，速度为1秒

  }
  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className='index'>
        <div className="swiper-container">
          <div className="swiper-wrapper">
            <div className="swiper-slide"><HomeList></HomeList></div>
            <div className="swiper-slide"><User></User></div>
            <div className="swiper-slide"><User></User></div>
          </div>
        </div>
        <CssBaseline />
        <BottomNavigation
          value={value}
          onChange={this.handleChange}
          showLabels
          className={classes.root}
        >
          <BottomNavigationAction label="首页" icon={<RestoreIcon />} />
          <BottomNavigationAction label="todo" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="我的" icon={<LocationOnIcon />} />
        </BottomNavigation>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Index);