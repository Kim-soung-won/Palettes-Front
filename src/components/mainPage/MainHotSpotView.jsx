import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faHeart } from '@fortawesome/free-solid-svg-icons';
import { Box, Modal } from '@mui/material';
import Swal from 'sweetalert2'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link } from 'react-router-dom';
import VisibilityIcon from "@mui/icons-material/Visibility.js";
import "../../styles/mainPage/MainHotSpotView.css";
import BoardViewStyle from '../../styles/mainPage/boardView.module.css'
import { useSelector } from 'react-redux';
import connectChat from '../../utils/connectChat';
import axios from 'axios';
import {storageURL, url} from '../../utils/single';

const MainHotSpotView = () => {
    const [modal, setModal] = useState({});
    const token = useSelector((state) => state).MemberSlice.token;


    const [hotSpots, setHotSpots] = useState([]);

    const openModal = (hotSpotId) => {
        setModal((prevState) => ({
            ...prevState,
            [hotSpotId]: true
        }));
    }

    const closeModal = (hotSpotId) => {
        setModal((prevState) => ({
            ...prevState,
            [hotSpotId]: false
        }));
    }


    const alarm = () => {
        console.log("alarm")
        Swal.fire({
            title: '로그인이 필요합니다.',
            text: '로그인 해주세요^^',
            icon: 'warning'
        });
    }

    const requestChat = (e) =>() => {
        console.log("click")
        if (token === '') {
            console.log("token is on")
            alarm();
        } else {
            connectChat(e);
        }
    }

    const fetchData = async () => {
        try {
            const result = await axios.get(`${url}/api/hotspot/main`)
            .then(res => res.data 
            )
            .catch(err => {
                console.error(err);
                return err.response.data;
            });
            console.log("List result :: ",result);
            setHotSpots(result);
        } catch (e) {
            console.error(e);
        }
    
    };

    useEffect(() => {
        fetchData();
    }, []);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <>
            {hotSpots ? hotSpots.map((hotSpot) => (
                <div key={hotSpot.hotSpotId} className={BoardViewStyle.postsList}>
                    <div className={BoardViewStyle.post}>
                        <div className={BoardViewStyle.postHeader}>
                            <img src = {`${storageURL}/hotspot/` + hotSpot.imgUrl}
                            alt="User" className={BoardViewStyle.postUserImage} onClick={() => openModal(hotSpot.hotSpotId)} />
                            <div>
                                <Link to={`/hotspot/details/${hotSpot.hotSpotId}`} className={"detailLink"}>
                                {/* <p className={BoardViewStyle.postUserName}>{carrot.memberNickname}님</p> */}
                                <p className={BoardViewStyle.postContent}>{hotSpot.placeName}</p>
                                <p className={BoardViewStyle.postTime}>{hotSpot.uploadAt}</p>
                                </Link>
                            {/* <span className='Item-icon'>
                                <FavoriteBorderIcon sx={{fontSize:'16pt'}}/>
                            </span> {carrot.carrotLike}                                  */}
                            {/* <span className='Item-icon'>
                                <VisibilityIcon sx={{verticalAlign: 'middle', mr: 0.5}}/> </span> {carrot.carrotView}</p> */}
                            </div>
                        </div>


                        <Modal
                            open={modal[hotSpot.hotSpotId]}
                            onClose={() => closeModal(hotSpot.hotSpotId)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description">
                            <Box sx={style}>
                                <img src={`${storageURL}/hotspot/` + hotSpot.imgUrl} // 디테일 이미지 URL 사용
                                     alt="HotSpot" />
                            </Box>
                        </Modal>
                    </div>
                </div>
            )):null}
            <div className={BoardViewStyle.postHeader}>
            <Link to={{ pathname: '/hotspot/list' }} className={BoardViewStyle.moreplz}>
                    <button className={BoardViewStyle.moreplzBtn}>더보기</button>
            </Link>
            </div>
        </>
    );
};

export default MainHotSpotView;