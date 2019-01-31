import React from 'react';
import './homeList.scss'
import Items from '../../components/items.js'
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios'
import Swiper from 'swiper'

// import ReactPullLoad, { STATS } from "react-pullload";
const styles = theme => ({
    progress: {
        margin: theme.spacing.unit * 2,
    },
});
class homeList extends React.Component {
    state = {
        scroll: '',
        list: [],
        loadipullloadingng: false,
        downloading: false,
        no_data: false,
        page: 1,
        pageSize: 10,
        loadingText: '没有更多内容',
        where: {

        }
    };
    getlist = () => {
        let { page, pageSize, where } = this.state
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
        let data = await this.getlist()
        if (data.code == 1) {
            await this.setState({
                list: data.result.result
            })
            swiper.update()

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
            // 上拉加载
            if (swiper.translate <= _viewHeight - _contentHeight - 50 && swiper.translate < 0) {
                console.log("已经到达底部！");

                if (!_this.state.no_data) {
                    await _this.setState({
                        downloading: true
                    })
                    let { page } = _this.state
                    page = page + 1
                    await _this.setState({ page: page })
                    let data = await _this.getlist()

                    if (data.code == 1) {
                        if (data.result.result.length > 0) {
                            if (data.result.result.length == _this.state.pageSize) {
                                let list = [..._this.state.list, ...data.result.result]
                                await _this.setState({ list })
                                await _this.setState({
                                    downloading: false
                                })
                                await _this.setState({
                                    no_data: false,
                                })
                            } else {
                                let list = [..._this.state.list, ...data.result.result]
                                await _this.setState({ list })
                                await _this.setState({
                                    downloading: false
                                })
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
                            await _this.setState({
                                downloading: false
                            })

                        }

                    } else {
                        page = page - 1
                        await _this.setState({ page: page })
                        await _this.setState({
                            downloading: false
                        })
                    }
                    swiper.update()
                }

            }

            // 下拉刷新
            if (swiper.translate >= 50) {
                const page = 1
                _this.setState({ page })
                _this.setState({
                    pullloading: true
                })
                let data = await _this.getlist()
                if (data.code == 1) {
                    await _this.setState({
                        list: data.result.result
                    })
                    await _this.setState({
                        pullloading: false
                    })
                }
                swiper.update()

            } else if (swiper.translate >= 0 && swiper.translate < 50) {

            }
            return false;
        }
        // let scroll = new BScroll(wrapper, {
        //     HWCompositing:false,
        //     pullDownRefresh: {
        //         threshold: 20,
        //         stop: 20
        //     },
        //     pullUpLoad: {
        //         threshold: 20,

        //     }
        // })
        // await this.setState({
        //     scroll
        // })
        // //上拉
        // scroll.on('pullingUp', async () => {
        //     if (!this.state.no_data) {
        //         await this.setState({
        //             downloading: true
        //         })
        //         let { page } = this.state
        //         page = page + 1
        //         await this.setState({ page: page })
        //         let data = await this.getlist()

        //         if (data.code == 1) {
        //             if (data.result.result.length > 0) {
        //                 let list = [...this.state.list, ...data.result.result]
        //                 await this.setState({ list })
        //                 await this.setState({
        //                     downloading: false
        //                 })
        //                 await this.setState({
        //                     no_data: false,
        //                 })
        //             } else {
        //                 await this.setState({
        //                     no_data: true,
        //                 })

        //                 page = page - 1
        //                 await this.setState({ page: page })
        //                 await this.setState({
        //                     downloading: false
        //                 })

        //             }

        //         } else {
        //             page = page - 1
        //             await this.setState({ page: page })
        //             await this.setState({
        //                 downloading: false
        //             })
        //         }
        //         scroll.refresh()
        //         scroll.finishPullUp()
        //     }

        // })
        // //下拉
        // scroll.on('pullingDown', async () => {

        //     const page = 1
        //     this.setState({ page })
        //     this.setState({
        //         pullloading: true
        //     })
        //     let data = await this.getlist()
        //     if (data.code == 1) {
        //         await this.setState({
        //             list: data.result.result
        //         })
        //         await this.setState({
        //             pullloading: false
        //         })
        //         scroll.finishPullDown()
        //         scroll.refresh()

        //     }
        // })
    }

    render() {
        const { classes } = this.props;
        return (
            <div className='homeList'>
                {this.state.pullloading && <LinearProgress />}
                <div className="wrapper" ref='wrapper'>
                    <div className="swiper-wrapper" ref='swiperwrapper'>
                        <div className="swiper-slide" style={{ height: 'auto' }} ref='swiperslide'>
                            {this.state.list.length == 0 && <div className='up'>暂无数据</div>}
                            {this.state.list.map((item, k) => (<React.Fragment key={k}><Items item={item}></Items></React.Fragment>))}
                            <div className='down' ref='down'>
                                {this.state.no_data && this.state.loadingText}
                            </div>
                            {this.state.downloading && <LinearProgress color="secondary" />}
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

homeList.propTypes = {
    // classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(homeList);