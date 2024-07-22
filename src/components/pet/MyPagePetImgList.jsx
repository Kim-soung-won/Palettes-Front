import React, { useEffect, useState } from "react";
import { petImgListInMyPageRequest } from "../../service/petApi.jsx";
import { Box, Typography, Button, Grid, Card, CardMedia } from '@mui/material';
import Slider from "react-slick";
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

// Slick carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {useNavigate} from "react-router-dom";
import { storageURL } from "../../utils/single.js";

const MyPagePetImgList = () => {
    const [list, setList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const result = await petImgListInMyPageRequest();
        console.log("이미지 리스트 = ", result);
        setList(result);
    }

    const AddPetComponent = () => (
        <Box
            sx={{
                textAlign: 'center',
                mt: 5,
                border: '2px solid #e0e0e0', // 연한 회색 테두리
                borderRadius: '8px', // 둥근 모서리
                padding: '20px', // 내부 여백
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)' // 약간의 그림자 효과
            }}
        >
            <Typography variant="h6" sx={{ color: "black" }} gutterBottom>
                반려동물을 추가해주세요
            </Typography>
            <Button variant="contained" color="success" sx={{ mt: 2 }}
                onClick={() => navigate("/pet/list")}
            >
                반려동물 추가하러 가기
            </Button>
        </Box>
    );

    const PetImagesCarousel = () => {
        const settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 2,
            arrows: false,
            swipe: true,
        };

        return (
            <Box sx={{ maxWidth: '100%', flexGrow: 1 }}>
                <Slider {...settings}>
                    {list.map((img) => (
                        <Box key={img.imgId} sx={{ padding: '0 5px' }}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    paddingTop: '100%', // 1:1 Aspect Ratio
                                    width: '100%',
                                }}
                            >
                                <Box
                                    component="img"
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                    src={`${storageURL}/pet/img/${img.imgUrl}`}
                                    alt={img.petId}
                                    onClick={() => navigate(`/pet/details/${img.petId}`)}
                                />
                            </Box>
                        </Box>
                    ))}
                </Slider>
            </Box>
        );
    };

    return (
        <Box sx={{ mt: 4 }}>
            {list.length === 0 ? (
                <AddPetComponent />
            ) : (
                <PetImagesCarousel />
            )}
        </Box>
    );
}

export default MyPagePetImgList;