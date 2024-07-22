import { useState, useEffect } from 'react';
import { Box, Modal } from '@mui/material';
import Swal from 'sweetalert2'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link } from 'react-router-dom';
import '../../styles/mainPage/mainPage.css';

import BoardViewStyle from '../../styles/mainPage/boardView.module.css';
import { useSelector } from 'react-redux';
import connectChat from '../../utils/connectChat';
import axios from 'axios';
import {storageURL, url} from '../../utils/single';
import icon_image from '../../image/icon-image.png';

const BoardView = () => {
    const [modal, setModal] = useState({});
    const [like, setLike] = useState({});
    const token = useSelector((state) => state).MemberSlice.token;


    const [articles, setArticles] = useState([]);
    
    const openModal = (articleId) => {
        setModal((prevState) => ({
            ...prevState,
            [articleId]: true
        }));
    }

    const closeModal = (articleId) => {
        setModal((prevState) => ({
            ...prevState,
            [articleId]: false
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
        const controller = new AbortController();
        const { signal } = controller;

        const result = await axios.get(`${url}/popular`, { signal })
        .then(res => res.data[0]
        )
        .catch(err => {
            console.error(err);
            return err.response.data;
        });
        if(result){
            setArticles(result);
        }
        return () => controller.abort();
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

    const connectArticle = (articleId) => {
        window.location.href = `/article/view/${articleId}`;
    }

    return (
        <>
            {articles && articles.map((article) => (
                <div key={article.articleId} className={BoardViewStyle.postsList}>
                    <div className={BoardViewStyle.post}>
                        <div className={BoardViewStyle.postHeader}>
                            <img src={article.memberImg ? `${storageURL}/member/Profile/${article.memberImg}`
                            : `${icon_image}`} alt="User" className={BoardViewStyle.postUserImage} onClick={() => openModal(article.articleId)} />
                            <div onClick={()=>connectArticle(article.articleId)}>
                                <p className={BoardViewStyle.postUserName}>{article.memberNickname}님</p>
                                <p className={BoardViewStyle.postContent}>{article.title}</p>
                                <p className={BoardViewStyle.postTime}>                             
                                <span className='Item-icon'>
                                    <FavoriteBorderIcon sx={{fontSize:'16pt'}}/>
                                </span> {article.countLoves}                                 

                                <span className='Item-icon'>
                                    <ChatBubbleOutlineIcon sx={{fontSize:'16pt'}} /> 
                                </span> 
                                {article.countComments}</p>
                            </div>
                        </div>


                        <Modal
                            open={modal[article.articleId]}
                            onClose={() => closeModal(article.articleId)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description">
                            <Box sx={style}>
                                <p className={BoardViewStyle.postUserName}>{article.memberNickname}</p>
                                <img src={article.memberImg ? `${storageURL}/member/Profile/${article.memberImg}`
                                : `${icon_image}`}
                                alt="User" />
                                <div className={BoardViewStyle.ModalContainer}>
                                    {/* <button className={BoardViewStyle.chackBt}>팔로우</button> */}
                                    <button className={BoardViewStyle.chackBt} onClick={requestChat(article.memberId)}>
                                        <span style={{ color: '#ffffff' }}>1:1 대화</span>
                                    </button>
                                </div>
                            </Box>
                        </Modal>


                    </div>
                </div>
            ))}
            <div className={BoardViewStyle.postHeader}>
            <Link to={{ pathname: '/recent', search: '?sort=articleId' }} className={BoardViewStyle.moreplz}>
                    <button className={BoardViewStyle.moreplzBtn}>더보기</button>
            </Link>
            </div>
            
        </>
    );
};

export default BoardView;