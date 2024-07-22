import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faHeart } from '@fortawesome/free-solid-svg-icons';
import { Box, Modal } from '@mui/material';
import Swal from 'sweetalert2'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link } from 'react-router-dom';
import VisibilityIcon from "@mui/icons-material/Visibility.js";

import BoardViewStyle from '../../styles/mainPage/boardView.module.css'
import { useSelector } from 'react-redux';
import connectChat from '../../utils/connectChat';
import axios from 'axios';
import {url} from '../../utils/single';
import { storageURL } from '../../utils/single';
import icon_image from '../../image/icon-image.png';

const MainCarrotView = () => {
    const [modal, setModal] = useState({});
    const token = useSelector((state) => state).MemberSlice.token;


    const [carrots, setCarrots] = useState([]);

    const openModal = (carrotId) => {
        setModal((prevState) => ({
            ...prevState,
            [carrotId]: true
        }));
    }

    const closeModal = (carrotId) => {
        setModal((prevState) => ({
            ...prevState,
            [carrotId]: false
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
            const result = await axios.get(`${url}/carrot/recent`)
            .then(res => res.data 
            )
            .catch(err => {
                console.error(err);
                return err.response.data;
            });
            console.log("List result :: ",result);
            setCarrots(result);
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


    const connectCarrot = (carrotId) => {
        window.location.href = `/carrot/details/${carrotId}`;
    }


    return (
        <>
            {carrots && carrots.map((carrot) => (
                <div key={carrot.carrotId} className={BoardViewStyle.postsList}>
                    <div className={BoardViewStyle.post}>
                        <div className={BoardViewStyle.postHeader}>
                            <img src={carrot.carrotImage ? `${storageURL}/carrot/img/${carrot.carrotImage}`
                                : `${icon_image}`}
                            alt="User" className={BoardViewStyle.postUserImage} onClick={() => openModal(carrot.carrotId)} />
                            <div onClick={()=>connectCarrot(carrot.carrotId)}>
                                {/* <p className={BoardViewStyle.postUserName}>{carrot.memberNickname}님</p> */}
                                <p className={BoardViewStyle.postContent}>{carrot.carrotTitle}</p>
                                <p className={BoardViewStyle.postTime}>
                            <span className='Item-icon'>
                                <FavoriteBorderIcon sx={{fontSize:'16pt'}}/>
                            </span> {carrot.carrotLike}
                            <span className='Item-icon'>
                                <VisibilityIcon sx={{verticalAlign: 'middle', mr: 0.5}}/> </span> {carrot.carrotView}</p>
                            </div>
                        </div>


                        <Modal
                            open={modal[carrot.carrotId]}
                            onClose={() => closeModal(carrot.carrotId)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description">
                            <Box sx={style}>
                                <img src={carrot.carrotImage ? `${storageURL}/carrot/img/${carrot.carrotImage}`
                                : `${icon_image}`}
                                alt="User" 
                                style={{width: '100%', height: '30%', objectFit: 'none'}}/>
                                {/* <div className={BoardViewStyle.ModalContainer}>
                                    <button className={BoardViewStyle.chackBt}>팔로우</button>
                                    <button className={BoardViewStyle.chackBt} onClick={requestChat(carrot.memberId)}>
                                        <span style={{ color: '#ffffff' }}>1:1 대화</span>
                                    </button>
                                </div> */}
                            </Box>
                        </Modal>
                    </div>
                </div>
            ))}
            <div className={BoardViewStyle.postHeader}>
            <Link to={{ pathname: '/carrot/list' }} className={BoardViewStyle.moreplz}>
                    <button className={BoardViewStyle.moreplzBtn}>더보기</button>
            </Link>
            </div>
        </>
    );
};

export default MainCarrotView;