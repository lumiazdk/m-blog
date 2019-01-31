import React from 'react';
import ReactDOM from 'react-dom';
import Routers from './routerMap'
import * as serviceWorker from './serviceWorker';
import { Switch, HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import './libs/moment.js'
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
// import enLocale from 'date-fns/locale/zh-CN';
import DateFnsUtils from '@date-io/date-fns';


// pick utils
class SwitchCom extends React.Component {
    componentDidMount() {
        const { match, location, history } = this.props

    }
    render() {
        return (
            <Router>
                <Switch>
                    {Routers.map((item, index) => {
                        return <Route key={index} path={item.path} exact render={props =>
                            (!item.auth ? (<item.component {...props} />) : (localStorage.token ? <item.component {...props} /> : <Redirect to={{
                                pathname: '/login',
                                state: { from: props.location }
                            }} />)
                            )} />
                    })}
                    // 所有错误路由跳转页面
                    {/* <Route component={NotFound} /> */}
                </Switch>
            </Router>
        )
    }
}
ReactDOM.render((<MuiPickersUtilsProvider utils={DateFnsUtils}><SnackbarProvider maxSnack={3}><SwitchCom></SwitchCom></SnackbarProvider></MuiPickersUtilsProvider>), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
