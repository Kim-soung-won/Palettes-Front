import {Button, Card, CardContent, CardMedia, createTheme, Typography, useMediaQuery} from '@mui/material';
import PetRegisterForm from "./PetRegisterForm.jsx";
import {useEffect, useState} from "react";
import {json, useNavigate} from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { styled } from '@mui/system';
import "./../../styles/pet/slickArrows.css"
import {petListRequest} from "../../service/petApi.jsx";
import {CardImg} from "react-bootstrap";
import { storageURL } from '../../utils/single.js';

const RoundedCardMedia = styled(CardMedia)(({ theme }) => ({
    borderRadius: '50%',
    width: 150,
    height: 150,
    margin: 'auto',
    marginTop: 20,
    marginBottom: 10,
    [theme.breakpoints.down('sm')]: {
        width: 100,
        height: 100,
    },
}));


const PetList = () => {

    const [petList, setPetList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = createTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // pet list query
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await petListRequest();
                console.log("data = " + data);
                if (data === 'REFRESH_TOKEN_EXPIRED_ERROR') {
                    window.location.replace('/login');
                } else {
                    setPetList(data);
                    setIsLoading(false);
                }
            } catch (error) {
                console.log('Failed to fetch data = ' + error);
                console.log(error);
                setError(error);
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    // 펫 등록 폼 -> 모달 처럼 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const navigate = useNavigate();

    const NextArrow = ({ onClick }) => {
        return (
            <div
                className="slick-next"
                onClick={onClick}
            >
            </div>
        );
    };

    const PrevArrow = ({ onClick }) => {
        return (
            <div
                className="slick-prev"
                onClick={onClick}
            >
            </div>
        );
    };

    const settings = {
        dots: true,          // 캐러셀 밑에 ... 을 표시할지
        infinite: true,      // 슬라이드가 끝까지 가면 다시 처음으로 반복
        speed: 500,         // 속도
        autoplay: true,      // 자동 재생
        autoplaySpeed: 3000, // 자동 재생 속도
        slidesToShow: 1,     // 한 번에 보여줄 슬라이드 개수
        slidesToScroll: 1,   // 한 번에 넘어가는 슬라이드 개수
        nextArrow: <NextArrow />, // 화살표 버튼을 커스텀해서 사용
        prevArrow: <PrevArrow />,
    };

    if (isLoading) {
        return (
            <>
                <br/>
                <br/>
                <br/>
                <div>로딩 중...</div>
            </>
        );
    }

    if (error) {
        return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
    }

    return (
        <>
            <h1>반려 동물 목록</h1>
            {petList.length === 0 ? (
                <Card>
                    <CardImg
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMAnGv9ThfxJ0b0vVQ3zcT114cT6C-675rmg&s"
                        style={{ width: '50%', height: 'auto' }}
                    />
                    <CardContent>
                        등록된 반려동물이 없습니다! 반려 동물을 등록해주세요
                    </CardContent>
                </Card>
            ) : petList.length === 1 ? (
                <Card onClick={() => navigate(`/pet/details/${petList[0].petId}`)}>
                    <RoundedCardMedia
                        component="img"
                        height="200"
                        image={`${storageURL}/pet/` + petList[0].petImage}
                        alt={petList[0].petName}
                    />
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {petList[0].petName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {petList[0].petCategory1} - {petList[0].petCategory2}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            생일: {petList[0].petBirth}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            체중: {petList[0].petWeight}kg
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Slider {...settings}>
                    {petList.map((pet) => (
                        <div key={pet.petId}>
                            <Card onClick={() => navigate(`/pet/details/${pet.petId}`)}>
                                <RoundedCardMedia
                                    component="img"
                                    height="200"
                                    image={`${storageURL}/pet/` + pet.petImage}
                                    alt={pet.petName}
                                />
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {pet.petName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {pet.petCategory1} - {pet.petCategory2}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        생일: {pet.petBirth}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        체중: {pet.petWeight}kg
                                    </Typography>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </Slider>
            )}
            <br />
            <br />
            <Button onClick={openModal}>펫 등록하기</Button>
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <PetRegisterForm closeModal={closeModal} />
                    </div>
                </div>
            )}
        </>
    );
}

export default PetList;