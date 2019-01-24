import Index from './pages/index';
import Login from './pages/account/login.js';
import PostDetail from './pages/postDetail/postDetail.js';


export default [
    { path: "/", name: "App", component: Index, auth: true },
    { path: "/Login", name: "Login", component: Login, },
    { path: "/PostDetail/:id", name: "Login", component: PostDetail, auth: true },
]