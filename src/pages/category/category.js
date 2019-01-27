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
function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
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
        const { classes } = this.props;
        const { value } = this.state;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                        >
                            <Avatar alt="Remy Sharp" src={this.state.userInfo.user_profile_photo} className={classes.avatar} />
                            <Typography variant="h6" color="inherit">
                                首页
                            </Typography>
                            <IconButton className={classes.button} aria-label="Delete" ><i className='iconfont icon-sousuo'></i></IconButton>
                        </Grid>

                    </Toolbar>
                </AppBar>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={this.handleChange}
                        variant="scrollable"
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label='全部' key='all' />
                        {this.state.categorylist.map(item => (<Tab label={item.name} key={item.categoryId} />))}
                    </Tabs>
                </AppBar>
                {value == 0 && <List categoryId='all'></List>}
                {this.state.categorylist.map((item, k) => (<React.Fragment key={item.categoryId}>
                    {value == k + 1 && <List categoryId={item.categoryId}></List>}
                </React.Fragment>))}

            </div>
        );
    }
}

Category.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Category);