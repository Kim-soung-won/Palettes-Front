import React, { useEffect, useState } from 'react';
import "../../styles/board/BoardItem.css"
import { Chip, CssBaseline } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TvIcon from '@mui/icons-material/Tv';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, maxWidth, useMediaQuery } from '@mui/system';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { storageURL } from '../../utils/single';

const BoardPageItem = (articles) => {
    const { article } = articles
    const { title, content, images, articleHead, articleId, articleTags, boardName, countLoves, countViews, countReview, createdAt, createdWho } = article
    const [formattedDateTime, setFormattedDateTime] = useState('');
    const isSmallScreen = useMediaQuery('(max-width:500px)');
 
    useEffect(() => {
        
        const dateTime = new Date(
           createdAt
        );
        const nowTime = new Date();
       
        const beforeTime = nowTime - dateTime;
        

        if (beforeTime < 1000) {
            setFormattedDateTime('방금 전');
        }
        else if (beforeTime < 60000) {
            setFormattedDateTime((beforeTime / 1000).toFixed(0) + ' 초 전')
        }
        else if (beforeTime < 3600000) {
            setFormattedDateTime((beforeTime / 60000).toFixed(0) + ' 분 전')
        }
        else if (beforeTime < 86400000) {
            setFormattedDateTime((beforeTime / 3600000).toFixed(0) + ' 시간 전')
        }
        else {
            setFormattedDateTime(
                `${dateTime.getFullYear()}.${(dateTime.getMonth() + 1).toString().padStart(2, '0')}.${dateTime.getDate().toString().padStart(2, '0')}`
            )
        }
    },[])

    // useEffect(() => {
    //     let time = "";
    //     if (dateTime.getDate !== nowTime.getDate) {
    //         time = `${dateTime.getFullYear()}.${(dateTime.getMonth() + 1).toString().padStart(2, '0')}.${dateTime.getDate().toString().padStart(2, '0')} 
    //                               ${dateTime.getHours().toString().padStart(2, '0')}시
    //                               ${dateTime.getMinutes().toString().padStart(2, '0')}분`;
    //     }
    //     else {
    //         time = `${dateTime.getFullYear()}.${(dateTime.getMonth() + 1).toString().padStart(2, '0')}.${dateTime.getDate().toString().padStart(2, '0')} `;
    //     }

    //     // 연.월.일 시 분 형식으로 포맷
    //     setFormattedDateTime(time);

    // }, [])

    const navigate = useNavigate();

    //글 클릭시 navigate
    const articlePage = () => {
        navigate(`/article/view/${articleId}`)
    }

    const formattedString = articleTags.split(',')
        .map(item => `#${item}`)
        .join(' ');


    return (
        <>
            <Box className="Item-container" onClick={articlePage}>
                <div className="Item-content">
                    <div className="Item-text">

                        <div className={isSmallScreen ? "Item-title Item-small-title" : "Item-title"} >
                            <Stack direction="row" spacing={1} sx={{display:'inline-block' , marginRight: 1}} >
                                <Chip label={articleHead} variant="outlined" />
                            </Stack>
                            {title}
                        </div>
                        <div className="Item-info">
                        &nbsp; {formattedDateTime}
                            <span className='Item-icon'>
                                <FavoriteBorderIcon sx={{ fontSize: '13pt' }} />

                            </span>
                            &nbsp; {countLoves}
                            <span className='Item-icon'>
                                <TvIcon sx={{ fontSize: '13pt' }} />

                            </span>
                            &nbsp; {countViews}
                            <span className='Item-icon'>
                                <ChatBubbleOutlineIcon sx={{ fontSize: '13pt' }} />

                            </span>
                            &nbsp;  {countReview}

                        </div>
                        {
                            articleTags && <div className="Item-tags">{formattedString}</div>
                        }

                    </div>
                    {
                        images.length > 0 &&
                        <div className="Item-image"><img src={`${storageURL}/article/img/${images[0].imgUrl}`} alt='image'  /></div>
                    }
                </div>

            </Box>
            <hr />
        </>
    );
};

export default BoardPageItem;