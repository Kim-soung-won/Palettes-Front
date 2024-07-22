import {Link, useNavigate, useParams} from "react-router-dom";
import Kakao from "./kakaoMap/Kakao.jsx";
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import "../../styles/hotspot/hotSpotDetail.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {Button, Card, Rating} from "@mui/material";
import ReactQuill from "react-quill";
import {
    checkIsManager,
    deleteHotSpot,
    getHotSpotDetail,
    getStarRate,
    sendStarRating
} from "../../service/hotSpotApi.jsx";
import BuildIcon from "@mui/icons-material/Build.js";
import Swal from "sweetalert2";
import {Col, Row} from 'react-bootstrap';
import "./../../styles/toast/toast.css"
import {storageURL} from "../../utils/single";

const HotSpotDetails = () => {

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
        customClass: {
            container: 'toastContainer',
        }
    });

    const [hotspot, setHotspot] = useState({rating: 0});
    const [isManager, setIsManager] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();

    // 이미 별점 평가를 했는 지 -> 했다면 얼마인지
    const [starRated, setStarRated] = useState(0);

    // 별점 수정 버튼 관련
    const [starRatedTemp, setStarRatedTemp] = useState(0);

    const handleUpdateRating = () => {
        // 임시 저장
        setStarRatedTemp(starRated);
        // 등록 버튼 다시 보이기 -> 0
        setStarRated(0);
    }

    const handleRatingCancel = () => {
        // 임시 저장했던 거 다시 원상복구하기
        setStarRated(starRatedTemp);
        setStarRatedTemp(0);
        setUserRating(0);
    }

    // 별점 평가 수행 여부 + 몇개 인지 가져오기 -> 무조건 1점부터 5점까지만 사용 (0은 평가 아직 안함을 나타냄)
    const [userRating, setUserRating] = useState(0);

    const handleRatingChange = (event, newValue) => {
        setUserRating(newValue);
    };

    const handleRatingSubmit = async () => {
        try {
            const dto = {
                hotSpotId: hotspot.hotSpotId,
                rating: userRating,
                memberId: null
            }
            // 서버에 별점 평가 요청 보내기
            const result = await sendStarRating(dto);
            if (result === true) {
                await Toast.fire({
                    icon: 'success',
                    title: '소중한 평가 감사합니다!',
                    width: 450,
                    allowOutsideClick: false
                });
                window.location.reload();
            } else {
                await Toast.fire({
                    icon: 'error',
                    title: '별점 평가 실패했습니다',
                    width: 450
                });
            }
        } catch (err) {
            await Toast.fire({
                icon: 'error',
                title: '별점 평가 실패했습니다',
                width: 450
            });
            console.error(err);
        }
    };


    useEffect(() => {
        // axios로 핫스팟 정보 가져오기
        const fetchData = async () => {
            const result = await getHotSpotDetail(id);
            console.log(result);
            setHotspot(result);
            // 회원 정보 가 role이 ADMIN인지 확인하는 요청
            const checkManager = await checkIsManager();
            if (checkManager === true) {
                setIsManager(checkManager);
            }
            // 열람 중인 회원이 이미 별점 평가를 했는 지 여부 확인
            const isAlreadyRated = await getStarRate(id);
            console.log("isAlreadyRated = ", isAlreadyRated);
            setStarRated(isAlreadyRated);
        }
        fetchData();
    }, []);

    // eslint-disable-next-line react/prop-types
    const NextArrow = ({onClick}) => {
        return (
            <Button
                className="slick-next"
                onClick={onClick}
                type="slick-next-button"
            >
            </Button>
        );
    };

    // eslint-disable-next-line react/prop-types
    const PrevArrow = ({onClick}) => {
        return (
            <Button
                className="slick-prev"
                onClick={onClick}
                type="slick-prev-button"
            >
            </Button>
        );
    };

    // 명소 글 삭제 요청
    const handleDeleteHotSpot = async (hotSpotId) => {
        try {
            const result = await deleteHotSpot(hotSpotId);
            if (result === true) {
                navigate("/hotspot/list", {replace: true});
            } else {
                await Swal.fire({
                    title: '명소 추천 글 삭제 실패',
                    text: '알 수 없는 이유로 실패했습니다. 관리자에게 문의해주세요',
                    icon: 'warning'
                });
            }
        } catch (err) {
            await Swal.fire({
                title: '명소 추천 글 삭제 실패',
                text: '알 수 없는 이유로 실패했습니다. 관리자에게 문의해주세요',
                icon: 'warning'
            });
            console.error(err);
        }
    }

    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow/>,
        prevArrow: <PrevArrow/>
    };

    return (
        <>
            {
                <>
                    <div className="image-list">
                        {hotspot.imgList && (
                            hotspot.imgList.length > 1 ? (
                                <div id="sliderDiv">
                                    <Slider {...settings}>
                                        {hotspot.imgList.map((imgSrc, index) => (
                                            <div key={imgSrc.imgHotSpotId}>
                                                <img
                                                    src={`${storageURL}/palettepets/hotspot/` + imgSrc.imgUrl}
                                                    alt={`Hotspot image ${index + 1}`}
                                                    className="centered-image"
                                                />
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            ) : (
                                hotspot.imgList.map((imgSrc, index) => (
                                    <div key={imgSrc.imgHotSpotId}>
                                        <img
                                            src={`${storageURL}/hotspot/` + imgSrc.imgUrl}
                                            alt={`Hotspot image ${index + 1}`}
                                            className="centered-image"
                                        />
                                    </div>
                                ))
                            )
                        )}
                    </div>
                    {isManager && (
                        <>
                            <Button
                                onClick={() => handleDeleteHotSpot(hotspot.hotSpotId)}
                                variant="outlined"
                            >
                                게시물 삭제
                            </Button>
                            <Link to={`/hotspot/update/${hotspot.hotSpotId}`}>
                                <button className="update-button">
                                    <BuildIcon />
                                </button>
                            </Link>
                        </>
                    )}
                    <Card
                        sx={{width: '96%', display: "inline-block", marginTop: '2%'}}
                    >
                        <h2>{hotspot.placeName}</h2>
                        <div id="ratingAverage">
                            <Rating value={hotspot.rating} precision={0.5} readOnly size="big"/>
                            <span style={{fontWeight: 'bold'}}>&nbsp;{hotspot.rating}</span>
                        </div>
                        <p>{hotspot.simpleContent}</p>
                    </Card>
                    <ReactQuill
                        value={hotspot.content}
                        readOnly={true}
                        theme="snow"
                        modules={{toolbar: false}}
                        style={{height: 'auto', backgroundColor: 'white', display: 'inline-block',
                                minHeight: '100px', width: '96%', marginTop: '2%',
                                whiteSpace: 'pre-wrap' // 줄바꿈과 공백 유지
                        }}
                    />
                </>
            }
            {
                hotspot.lat && hotspot.lng && (
                    <Card
                        sx={{width: '96%', display: "inline-block", marginTop: '2%'}}
                    >
                        <h3 style={{textAlign: 'left', marginLeft: '1%'}}>위치 보기</h3>
                        <p style={{textAlign: 'left', marginLeft: '1%'}}>{hotspot.address}</p>
                        <Kakao
                            lat={hotspot.lat} lng={hotspot.lng}
                        />
                    </Card>
                )
            }
            <br/>
            {
                starRated === 0 ? (

                    <Card
                        sx={{width: '96%', display: "inline-block", marginTop: '2%', paddingBottom: '2.5%'}}
                    >
                        <Row className="mt-4">
                            <Col>
                                <h4>이 명소에 대한 별점을 남겨주세요!</h4>
                                <Rating
                                    name="user-rating"
                                    value={userRating}
                                    onChange={handleRatingChange}
                                    size="large"
                                />
                                <br/>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleRatingSubmit}
                                    disabled={userRating === 0}
                                    className="ml-2"
                                >
                                    평가 제출
                                </Button>
                                &nbsp;&nbsp;&nbsp;
                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={handleRatingCancel}
                                    className="ml-2"
                                >
                                    취소
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                ) : (
                    <Card
                        sx={{width: '96%', display: "inline-block", marginTop: '2%', paddingBottom: '2%'}}
                    >
                        <Row className="mt-4" onClick={handleUpdateRating}>
                            <Col>
                                <h4>회원님의 평가</h4>
                                <Rating
                                    name="user-rating"
                                    value={starRated}
                                    precision={1}
                                    readOnly
                                    size="large"
                                />
                            </Col>
                        </Row>
                    </Card>
                )
            }
            <br/>
            <br/>
            <br/>
        </>
    );
};
export default HotSpotDetails;