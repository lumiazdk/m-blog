import Index from './pages/index';
import Login from './pages/account/login.js';

export default [
    { path: "/", name: "App", component: Index, auth: true },
    { path: "/Login", name: "Login", component: Login, },

]