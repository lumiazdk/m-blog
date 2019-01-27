import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import red from '@material-ui/core/colors/red';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import axios from 'axios'
import moment from 'moment'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
const styles = theme => ({
    card: {
        maxWidth: 400,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        // backgroundColor: red[500],
    },
});

class UserDetail extends React.Component {
    state = {
        user_name: '',
        user_email: '',
        user_profile_photo: '',
        user_birthday: moment(),
        user_age: '',
        user_nickname: '',
        motto: '',
        status: this.props.status

    };
    componentDidMount() {
        this.getDetail()
    }
    getDetail = async () => {
        let data = await axios({
            method: 'post',
            url: 'userInfo',
            data: {
                user_id: this.props.friend_id
            }
        });
        if (data.code == 1) {
            let result = data.result.userInfo
            this.setState(() => ({ user_name: result['user_name'] ? result['user_name'] : '' }))
            this.setState(() => ({ user_email: result['user_email'] ? result['user_email'] : '' }))
            this.setState(() => ({ user_profile_photo: result['user_profile_photo'] ? result['user_profile_photo'] : '' }))
            this.setState(() => ({ user_birthday: result['user_birthday'] ? result['user_birthday'] : '' }))
            this.setState(() => ({ user_age: result['user_age'] ? result['user_age'] : '' }))
            this.setState(() => ({ user_nickname: result['user_nickname'] ? result['user_nickname'] : '' }))
            this.setState(() => ({ motto: result['motto'] ? result['motto'] : '' }))
        }
    }
    sure = async () => {
        let data = await axios({
            method: 'post',
            url: 'updateFriend',
            data: {
                user_id: this.props.user_id,
                friend_id: this.props.friend_id,
                status: 1
            }
        });
        if (data.code == 1) {
            this.setState({
                status: 1
            })
        }

    }
    refuse = async () => {
        let data = await axios({
            method: 'post',
            url: 'updateFriend',
            data: {
                user_id: this.props.user_id,
                friend_id: this.props.friend_id,
                status: 2
            }
        });
        if (data.code == 1) {
            this.setState({
                status: 1
            })
        }
    }
    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        this.state.user_profile_photo && <Avatar aria-label="Recipe" className={classes.avatar} src={this.state.user_profile_photo}>
                        </Avatar>
                    }
                    title={this.state.user_name}
                    subheader={this.state.user_nickname}
                />

                <List component="nav">
                    {this.state.motto && <ListItem>

                        <ListItemIcon>
                            <i className='iconfont icon-liuyan'></i>
                        </ListItemIcon>
                        <ListItemText primary={this.state.motto} />
                    </ListItem>}

                    {this.state.user_birthday && <ListItem>
                        <ListItemIcon>
                            <i className='iconfont icon-shengri'></i>
                        </ListItemIcon>
                        <ListItemText primary={moment(this.state.user_birthday).format('YYYY-MM-DD')} />
                    </ListItem>}
                    {this.state.user_age && <ListItem>
                        <ListItemIcon>
                            <i className='iconfont icon-icon_rencai_nianling'></i>
                        </ListItemIcon>
                        <ListItemText primary={this.state.user_age + '岁'} />
                    </ListItem>}
                    {this.state.user_email && <ListItem>
                        <ListItemIcon>
                            <i className='iconfont icon-youjian'></i>
                        </ListItemIcon>
                        <ListItemText primary={this.state.user_email} />
                    </ListItem>}
                </List>

                {this.state.status == 0 && <Grid
                    container
                    direction="row-reverse"
                    justify="center"
                    alignItems="center"
                    style={{ padding: '10px' }}
                    spacing={8}
                >
                    <Grid item>
                        <Button variant="outlined" color="primary" className={classes.button} onClick={this.sure}>
                            同意
                    </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color="secondary" className={classes.button} onClick={this.refuse}>
                            拒绝
                    </Button>
                    </Grid>

                </Grid>}

                {this.state.status == 2 && <div style={{ textAlign: 'center', padding: '10px', color: "red" }}>已拒绝</div>}
            </Card>
        );
    }
}

UserDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserDetail);