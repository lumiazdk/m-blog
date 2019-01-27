import React from 'react';
import PropTypes from 'prop-types';
import BScroll from 'better-scroll'
import './list.scss'
import Items from '../../components/items.js'
import { setTimeout } from 'core-js';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios'
import Button from '@material-ui/core/Button';
import Swiper from 'swiper'
const styles = theme => ({
    progress: {
        margin: theme.spacing.unit * 2,
    },
});
class List extends React.Component {
    state = {
        scroll: '',
        list: [],
        uploadingng: true,
        downloading: true,
        no_data: false,
        page: 1,
        pageSize: 10,
        loadingText: '没有更多内容',
        where: {
            cid: this.props.categoryId
        },
        downcompleted: 0,
        upcompleted: 0,

    };
    getlist = () => {
        let { page, pageSize, where } = this.state
        if (where.cid == 'all') {
            delete where.cid
        }
        let data = axios({
            method: 'post',
            url: 'getPost',
            data: {
                page,
                pageSize,
                where,
                user_id: JSON.parse(localStorage.userInfo).user_id
            }
        });
        return data
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
                touchMove: touchMove,
                touchEnd: touchEnd
            }

        });

        this.downprogressstart()
        let data = await this.getlist()
        if (data.code == 1) {
            await this.setState({
                list: data.result.result
            })

            this.downprogressend()
            swiper.update()

        } else {
            this.downprogressend()
        }

        async function touchMove(event) {
            //手动滑动中触发
            // var _viewHeight = this.refs['swiper-wrapper'].offsetHeight;
            // var _contentHeight = this.refs['swiper-slide'].offsetHeight;
            if (swiper.translate < 50 && swiper.translate > 0) {
                console.log('下拉刷新')
            } else if (swiper.translate > 50) {
                console.log('释放刷新')
            }
        }
        async function touchEnd() {
            var _viewHeight = _this.refs.swiperwrapper.offsetHeight;
            var _contentHeight = _this.refs.swiperslide.offsetHeight;
            console.log(_viewHeight, _contentHeight)
            // 上拉加载
            if (swiper.translate <= _viewHeight - _contentHeight - 50 && swiper.translate < 0) {
                console.log("已经到达底部！");

                if (!_this.state.no_data) {
                    _this.upprogressstart()
                    let { page } = _this.state
                    page = page + 1
                    await _this.setState({ page: page })
                    let data = await _this.getlist()

                    if (data.code == 1) {
                        if (data.result.result.length > 0) {
                            if (data.result.result.length == _this.state.pageSize) {
                                let list = [..._this.state.list, ...data.result.result]
                                await _this.setState({ list })
                                _this.upprogressend()
                                await _this.setState({
                                    no_data: false,
                                })
                            } else {
                                let list = [..._this.state.list, ...data.result.result]
                                await _this.setState({ list })
                                _this.upprogressend()

                                await _this.setState({
                                    no_data: true,
                                })
                            }

                        } else {
                            await _this.setState({
                                no_data: true,
                            })

                            page = page - 1
                            await _this.setState({ page: page })
                            _this.upprogressend()
                        }

                    } else {
                        page = page - 1
                        await _this.setState({ page: page })
                        _this.upprogressend()

                    }
                    swiper.update()
                }

            }

            // 下拉刷新
            if (swiper.translate >= 50) {
                const page = 1
                _this.setState({ page })
                _this.downprogressstart()

                let data = await _this.getlist()
                if (data.code == 1) {
                    await _this.setState({
                        list: data.result.result
                    })
                    _this.downprogressend()

                }
                swiper.update()

            } else if (swiper.translate >= 0 && swiper.translate < 50) {

            }
            return false;
        }
    }

    //下拉进度
    downprogressstart = () => {
        let _this = this
        async function progress() {
            const { downcompleted } = _this.state;
            _this.setState({ downcompleted: 0 });
            const diff = Math.random() * 10;
            console.log(diff)
            _this.setState({ downcompleted: Math.min(downcompleted + diff, 100) });
            await _this.setState({
                downloading: true
            })
        }

        this.downtimer = setInterval(progress, 50);
    }
    downprogressend = async () => {
        this.setState({ downcompleted: 100 });
        clearInterval(this.downtimer);
        await this.setState({
            downloading: false
        })

    }
    //上拉进度
    upprogressstart = () => {
        let _this = this
        async function progress() {
            const { upcompleted } = _this.state;
            _this.setState({ upcompleted: 0 });
            const diff = Math.random() * 10;
            console.log(diff)
            _this.setState({ upcompleted: Math.min(upcompleted + diff, 100) });
            await _this.setState({
                uploading: true
            })
        }

        this.uptimer = setInterval(progress, 50);
    }
    upprogressend = async () => {
        this.setState({ upcompleted: 100 });
        clearInterval(this.uptimer);
        await this.setState({
            uploading: false
        })

    }
    render() {
        const { classes } = this.props;
        return (
            <div className='list'>
                {this.state.downloading && <LinearProgress variant="determinate" value={this.state.downcompleted} />}

                <div className="wrapper" ref='wrapper'>
                    <div className="swiper-wrapper" ref='swiperwrapper'>
                        <div className="swiper-slide" style={{ height: 'auto' }} ref='swiperslide'>
                            {this.state.list.length == 0 && <div className='up'>暂无数据</div>}
                            {this.state.list.map((item, k) => (<div className='items' key={k}><Items item={item}></Items></div>))}
                            <div className='down' ref='down'>
                                {this.state.no_data && this.state.loadingText}
                            </div>
                            {this.state.uploading && <LinearProgress variant="determinate" value={this.state.upcompleted} color="secondary" />}
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

List.propTypes = {
    // classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(List);