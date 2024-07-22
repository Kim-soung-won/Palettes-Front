import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Slider from 'react-slick'; // react-slick을 가져옵니다.
import { Box, Typography, IconButton, CircularProgress, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { GetFeed, DeleteFeed } from '../../service/memberApi'; // API 함수들을 가져옵니다.
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import '../../styles/loginPage/mypage.css';
import { storageURL } from '../../utils/single';

const FeedDetailComp = ({ onDeleteSuccess }) => {
    const { feedId } = useParams();
    const navigate = useNavigate();
    const [feed, setFeed] = useState({ text: "", img: [], writer: false });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedDetail = async () => {
            try {
                const response = await GetFeed(feedId);
                setFeed({
                    text: response.text,
                    img: response.img,
                    writer: response.writer
                });
                setLoading(false);
            } catch (error) {
                setError('피드 상세 정보를 가져오는데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchFeedDetail();
    }, [feedId]);

    const handleDelete = async () => {
        try {
            await DeleteFeed(feedId);
            if (onDeleteSuccess) {
                onDeleteSuccess(feedId);
            }
            navigate(-1); // 삭제 후 피드 목록 페이지로 이동
        } catch (error) {
            setError('피드를 삭제하는데 실패했습니다.');
        }
    };
    const navigateBack = () => {
        navigate(-1);
    };
    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    const settings = {
        dots: true,
        infinite: feed.img.length > 1, // 이미지가 1개일 때는 무한 반복하지 않음
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false, // 화살표 없애기
        appendDots: dots => (
            <div>
                <ul style={{ margin: 0 }}> {dots} </ul>
            </div>
        ),
        customPaging: i => (
            <div
                style={{
                    width: '30px',
                    height: '5px',
                    backgroundColor: 'gray',
                    borderRadius: '5px',
                    display: 'inline-block',
                    margin: '0 3px'
                }}
            />
        )
    };
    

    return (
        <Box sx={{ padding: 2, position: 'relative' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={navigateBack}>
                <ChevronLeftIcon />
                </IconButton>
                <Typography variant="h6"></Typography>
                <IconButton 
                onClick={handleDelete} 
                sx={{ position: 'absolute', top: 8, right: 8 }}
            >
                <DeleteIcon />
            </IconButton>
            </Box>
            <Typography variant="body1"  sx={{color: 'black'}}>{feed.text}</Typography>
            {feed.img && feed.img.length > 0 && (
                <Slider {...settings}>
                    {feed.img.map((image, index) => (
                        <Box key={index}>
                            <Box
                                component="img"
                                src={`${storageURL}/feed/img/${image}`}
                                alt={`feed-detail-${index}`}
                                sx={{ width: '100%', height: 'auto', mb: 2 }}
                            />
                        </Box>
                    ))}
                </Slider>
            )}
            
        </Box>
    );
};

export default FeedDetailComp;
