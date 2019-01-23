import React from 'react';
import PropTypes from 'prop-types';
import BScroll from 'better-scroll'
import './homeList.scss'
import Items from './items.js'
import { setTimeout } from 'core-js';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios'
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
        loadingText: '没有更多数据',
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
                where
            }
        });
        return data
    }
    async componentDidMount() {
        const _this = this
        let data = await this.getlist()
        if (data.code == 1) {
            this.setState({
                list: data.result.result
            })
        }
        let wrapper = this.refs.wrapper
        let scroll = new BScroll(wrapper, {
            pullDownRefresh: {
                threshold: 50,
                stop: 50
            },
            pullUpLoad: {
                threshold: 50,

            }
        })
        await this.setState({
            scroll
        })
        //上拉
        scroll.on('pullingUp', async () => {
            if (!this.state.no_data) {
                await this.setState({
                    downloading: true
                })
                let { page } = this.state
                page = page + 1
                await this.setState({ page: page })
                let data = await this.getlist()

                if (data.code == 1) {
                    if (data.result.result.length > 0) {
                        let list = [...this.state.list, ...data.result.result]
                        await this.setState({ list })
                        await this.setState({
                            downloading: false
                        })
                        await this.setState({
                            no_data: false,
                        })
                    } else {
                        await this.setState({
                            no_data: true,
                        })

                        page = page - 1
                        await this.setState({ page: page })
                        await this.setState({
                            downloading: false
                        })

                    }

                } else {
                    page = page - 1
                    await this.setState({ page: page })
                    await this.setState({
                        downloading: false
                    })
                }
                scroll.refresh()
                scroll.finishPullUp()
            }

        })
        //下拉
        scroll.on('pullingDown', async () => {

            const page = 1
            this.setState({ page })
            this.setState({
                pullloading: true
            })
            let data = await this.getlist()
            if (data.code == 1) {
                await this.setState({
                    list: data.result.result
                })
                await this.setState({
                    pullloading: false
                })
                scroll.finishPullDown()
                scroll.refresh()

            }
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <div className='homeList'>
                {this.state.pullloading && <LinearProgress />}
                <div className="wrapper" ref='wrapper'>
                    <div className="content">
                        {this.state.list.length == 0 && <div className='up'>暂无数据</div>}
                        {this.state.list.map((item, k) => (<div className='items' key={k}><Items item={item}></Items></div>))}
                        <div className='down' ref='down'>
                            {this.state.no_data && this.state.loadingText}
                        </div>
                        {this.state.downloading && <LinearProgress color="secondary" />}
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