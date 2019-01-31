import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import moment from 'moment'
import './items.scss'
import axios from 'axios'
import Button from '@material-ui/core/Button';
import CardActionArea from '@material-ui/core/CardActionArea';
import { withRouter } from 'react-router'
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import PostDetail from '../pages/postDetail/postDetail.js'
//子页动画
function pageTransition(props) {
    return <Slide direction="left" {...props} />;
}
const options = [
    {
        k: 'guanzhu',
        // name: '关注'
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
        pageopen: false,
        title: '详情'
    };
    //子页
    pagehandleClickOpen = () => {
        this.setState({ pageopen: true });
    };

    pagehandleClose = () => {
        this.setState({ pageopen: false });
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
            if (item.isfabulous) {
                item.fabulous_num = item.fabulous_num - 1
            } else {
                item.fabulous_num = item.fabulous_num + 1

            }
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
    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.item != this.props.item) {
            this.setState({
                item: this.props.item
            })
        }
        return true;
    }
    //刷新
    fresh = (item) => {
        this.setState({ item })
        this.pagehandleClose()
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
                        // action={
                        //     <div>
                        //         <div
                        //             aria-label="More"
                        //             aria-owns={open ? 'long-menu' : undefined}
                        //             aria-haspopup="true"
                        //             onClick={this.handleClick}
                        //         >
                        //             <MoreVertIcon />
                        //         </div>
                        //         <Menu
                        //             id="long-menu"
                        //             anchorEl={anchorEl}
                        //             open={open}
                        //             onClose={this.handleClose}
                        //             PaperProps={{
                        //                 style: {
                        //                     maxHeight: ITEM_HEIGHT * 4.5,
                        //                     width: 200,
                        //                 },
                        //             }}
                        //         >
                        //             {options.map(option => (
                        //                 <MenuItem key={option.k} selected={option.k === 'guanzhu'} onClick={this.handleClose}>
                        //                     {option.name}
                        //                 </MenuItem>
                        //             ))}
                        //         </Menu>
                        //     </div>
                        // }
                        title={item.user.user_name}
                        subheader={moment(item.create_time).fromNow()}
                    />
                    <CardMedia
                        className={classes.media}
                        image={item.background}
                        title="Paella dish"
                        onClick={this.pagehandleClickOpen}
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
                                    {item.fabulous_num}
                                </Typography>
                            </Button>
                        </Grid>

                        <Grid item xs={3}>
                            <Button className={classes.button}>
                                <i className='iconfont icon-xiaoxi'></i>
                                <Typography component="span" style={{ marginLeft: '10px' }}>
                                    {item.comment_num}
                                </Typography>
                            </Button>
                        </Grid>

                        <Grid item xs={3}>
                            <Button className={classes.button}>
                                <i className='iconfont icon-zhuanfa'></i>
                                <Typography component="span" style={{ marginLeft: '10px' }}>
                                    {item.forward_num}
                            </Typography>
                            </Button>
                        </Grid>

                        <Grid item xs={3}>
                            <Button className={classes.button}>
                                <i className='iconfont icon-chakan'></i>
                                <Typography component="span" style={{ marginLeft: '10px' }}>
                                    {item.see_num}
                            </Typography>
                            </Button>
                        </Grid>

                    </Grid>
                </CardActions>
                {/* 子页 */}
                <Dialog
                    fullScreen
                    open={this.state.pageopen}
                    onClose={this.pagehandleClose}
                    TransitionComponent={pageTransition}
                >

                    {this.state.pageopen == true && <PostDetail item={item} fresh={this.fresh.bind(this)}></PostDetail>}
                </Dialog>
            </Card>
        );
    }
}

RecipeReviewCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter((withStyles(styles)(RecipeReviewCard)));