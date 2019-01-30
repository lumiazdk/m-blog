import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import axios from 'axios'
import List from './list.js'
import './category.scss'
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';
import postDetail from '../postDetail/postDetail.js'
import SwipeableViews from 'react-swipeable-views';
function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir} style={{ height: '100%', position: 'relative' }}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        height: '100%'
    },
    button: {
        color: 'white'
    }

});

class Category extends React.Component {
    state = {
        value: 0,
        categorylist: [],
        userInfo: JSON.parse(localStorage.userInfo),
    };
    async componentDidMount() {
        let getCategory = await this.getCategory()
        if (getCategory.code == 1) {
            this.setState({
                categorylist: getCategory.result.data
            })
        }
    }
    //tabs
    handleChange = (event, value) => {
        this.setState({ value });
        console.log(22)
    };
    handleChangeIndex = index => {
        this.setState({ value: index });
    };
    //获取分类
    getCategory = () => {
        let data = axios({
            method: 'post',
            url: 'getAllCategory',
            data: {
            }
        });
        return data
    }
    render() {
        const { classes, theme } = this.props;
        const { value } = this.state;
        return (
            <div className={classes.root}>
                <AppBar position="absolute">
                    <Tabs
                        value={value}
                        onChange={this.handleChange}
                        variant="scrollable"
                        scrollButtons="on"
                    >
                        <Tab label='全部' key='all' />
                        {this.state.categorylist.map(item => (<Tab label={item.name} key={item.categoryId} />))}
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={this.state.value}
                    onChangeIndex={this.handleChangeIndex}
                    style={{ height: '100%' }}
                >
                    <TabContainer dir={theme.direction}><List categoryId='all'></List></TabContainer>
                    {this.state.categorylist.map((item, k) => (<TabContainer dir={theme.direction} key={item.categoryId}>
                        <List categoryId={item.categoryId}></List>
                    </TabContainer>))}
                </SwipeableViews>
            </div>
        );
    }
}

Category.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Category);