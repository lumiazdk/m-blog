import ReactPullLoad, { STATS } from "react-pullload";
import React from 'react'
import Button from '@material-ui/core/Button';
import IScroll from 'iscroll'
import Swiper from 'swiper'

class Load extends React.Component {
    constructor() {
        super();
        this.state = {

        };
    }
    componentDidMount() {
        var swiper = new Swiper('.pull-container', {
            direction: 'vertical',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbar: {
                el: '.swiper-scrollbar',
            },
            mousewheel: true,
        });
    }
    aa = () => {
        alert(22)
    }
    render() {


        return (
                <div className="pull-container" style={{height:'100%',overflow:'hidden'}}>
                    <div className="swiper-wrapper">
                        <div className="swiper-slide" style={{height:'auto'}}>
                        
                        </div>
                    </div>
                    <div className="swiper-scrollbar"></div>
                </div>
        );
    }
}
export default Load