import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import moment from 'moment'
import './items.scss'
import axios from 'axios'
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import CardActionArea from '@material-ui/core/CardActionArea';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withRouter } from 'react-router'
import Grid from '@material-ui/core/Grid';

const options = [
    {
        k: 'guanzhu',
        name: '关注'
    }
];
const styles = theme => ({
    card: {
        // maxWidth: 400,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },

    fabulous: {
        color: 'red'
    },
});
const ITEM_HEIGHT = 48;
class RecipeReviewCard extends React.Component {
    state = {
        expanded: false,
        item: this.props.item,
        anchorEl: null,
    };

    addfabulous = async (item) => {
        let data = await axios({
            method: 'post',
            url: 'addFabulous',
            data: {
                post_id: item.id,
                fabulousUser_id: JSON.parse(localStorage.userInfo).user_id
            }
        });
        if (data.code == 1) {
            item.isfabulous = !item.isfabulous
            this.setState((prevState) => ({
                item: item
            }))
        }
    };
    //menu
    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };
    // shouldComponentUpdate(nextProps, nextState) {
    //     if (this.state.item != this.props.item) {
    //         this.setState({
    //             item: this.props.item
    //         })
    //     }
    //     return true;
    // }
    postDetail = () => {
        const { match, location, history } = this.props
        history.push(`/postDetail/${this.state.item.id}`)
    }
    render() {
        const { item, anchorEl } = this.state;
        const { classes } = this.props;
        const open = Boolean(anchorEl);
        return (
            <Card className={classes.card} >
                <CardActionArea>
                    <CardHeader
                        avatar={
                            <Avatar alt="Remy Sharp" src={item.user.user_profile_photo} className={classes.avatar} />
                        }
                        action={
                            <div>
                                <div
                                    aria-label="More"
                                    aria-owns={open ? 'long-menu' : undefined}
                                    aria-haspopup="true"
                                    onClick={this.handleClick}
                                >
                                    <MoreVertIcon />
                                </div>
                                <Menu
                                    id="long-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={this.handleClose}
                                    PaperProps={{
                                        style: {
                                            maxHeight: ITEM_HEIGHT * 4.5,
                                            width: 200,
                                        },
                                    }}
                                >
                                    {options.map(option => (
                                        <MenuItem key={option.k} selected={option.k === 'guanzhu'} onClick={this.handleClose}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </div>
                        }
                        title={item.user.user_name}
                        subheader={moment(item.create_time).fromNow()}
                    />
                    <CardMedia
                        className={classes.media}
                        image={item.background}
                        title="Paella dish"
                        onClick={this.postDetail}
                    />
                    <CardContent>
                        <Typography component="p" style={{ fontWeight: 'bolder' }}>
                            {item.title}
                        </Typography>
                        <Typography component="p">
                            {item.describes}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions className={classes.actions} disableActionSpacing>
                    <Grid container spacing={24}>
                        <Grid item xs={3}>
                            <Button color={item.isfabulous ? 'secondary' : 'default'} className={classes.button} onClick={this.addfabulous.bind(this, item)}>
                                <i className='iconfont icon-like-b'></i>
                                <Typography component="span" style={{ marginLeft: '10px' }} color={item.isfabulous ? 'secondary' : 'default'}>
                                    0
                                </Typography>
                            </Button>
                        </Grid>

                        <Grid item xs={3}>
                            <Button className={classes.button}>
                                <i className='iconfont icon-xiaoxi'></i>
                                <Typography component="span" style={{ marginLeft: '10px' }}>
                                    0
                            </Typography>
                            </Button>
                        </Grid>

                        <Grid item xs={3}>
                            <Button className={classes.button}>
                                <i className='iconfont icon-zhuanfa'></i>
                                <Typography component="span" style={{ marginLeft: '10px' }}>
                                    0
                            </Typography>
                            </Button>
                        </Grid>

                        <Grid item xs={3}>
                            <Button className={classes.button}>
                                <i className='iconfont icon-chakan'></i>
                                <Typography component="span" style={{ marginLeft: '10px' }}>
                                    0
                            </Typography>
                            </Button>
                        </Grid>

                    </Grid>
                </CardActions>
            </Card>
        );
    }
}

RecipeReviewCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter((withStyles(styles)(RecipeReviewCard)));