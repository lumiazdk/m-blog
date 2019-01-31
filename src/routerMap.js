import Index from './pages/index';
import Login from './pages/account/login.js';
import PostDetail from './pages/postDetail/postDetail.js';
import InfoSetting from './pages/infoSetting/infoSetting.js';
import SendMessage from './pages/sendMessage/sendMessage.js';




export default [
    { path: "/", name: "App", component: Index, auth: true },
    { path: "/Login", name: "Login", component: Login, },
    { path: "/InfoSetting", name: "InfoSetting", component: InfoSetting, auth: true },
    // { path: "/PostDetail/:id", name: "PostDetail", component: PostDetail, auth: true },
    // { path: "/SendMessage", name: "SendMessage", component: SendMessage, auth: true },

]