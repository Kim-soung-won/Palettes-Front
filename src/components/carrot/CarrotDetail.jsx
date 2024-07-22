import React, { useState, useEffect } from 'react';
import axios, { Axios } from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faL } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import {IconButton} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import carrotService from '../../service/carrotService';
import '../../styles/carrot/CarrotDetail.css';
import CarrotMenu from './CarrotMenu';
import image from '../../image/icon-photo.png';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import connectChat from '../../utils/connectChat';
import { storageURL } from '../../utils/single';


const CarrotDetail = () => {
  const navigate = useNavigate();

  const {id} = useParams();
  const [carrot, setCarrot] = useState([]);
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState(carrot.carrotState);
  const [isLiked, setIsLiked] = useState(false);
  const [imgList, setImgList] = useState([]);


  useEffect(() => {
    fetchCarrot(id);
      carrotService.checkCarrotId(id).then((res) => {
        if(res.data) {
          setVisible(true)
        }else {
          setVisible(false)
        }
      })
  }, [id]);

  //좋아요
  useEffect(() => {
      carrotService.getLike(id).then((res) => {
          if(res.data) {
            setIsLiked(true);
          }else {
            setIsLiked(false);
          }
      })
  }, [id]);

  //상세 피이지 & 이미지
  const fetchCarrot = (id) => {
    carrotService.getCarrotDetails(id).then((res) => {
      setCarrot(res.data);
      setImgList(res.data.imgList)
      //setPage(page => page + 1);
      }).catch((err) => { 
        console.log(err)
      });
    }

    //거래 상태 변경
  const handleChange = async (event) => {
    const newValue = parseInt(event.target.value, 10);
    if (newValue !== state) {
      if (window.confirm("상태를 바꾸시겠습니까?")) {
        try {
          // Axios 요청 보내기
          await axios.post(`carrot/state/${id}`, newValue,
            { headers: { 'Content-Type': 'application/json' } }
          ).then((res) => {
            setState(newValue); // 상태 업데이트
          });
        } catch (error) {
          console.error("Error updating carrot state:", error);
        }
      }
    }
  }

  //좋아요
  const handleLike = (id) => {
    console.log("like = " + id);
    const likeState = carrotService.getLike(id)
    console.log("checkehcerjd = " + likeState)
    try {
      if (isLiked) {
        // 좋아요 취소 요청
        carrotService.postLike(id)
      } else {
        // 좋아요 요청
        carrotService.postLike(id)
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error(error);
    }
  };

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
    dots: true,
    infinite: imgList.length > 1, // 이미지가 1개일 때는 무한 반복하지 않음
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />, // 화살표 버튼을 커스텀해서 사용
    prevArrow: <PrevArrow />,
}

    return (
      <>
      <div className="carrot-detail-container" >
      <div className="back-shape">
        <IconButton aria-label="history back" sx={{display: 'flex', fontSize: '15pt' }} onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
      </div>
      {visible && <div className="menu-container"><CarrotMenu/></div>}
      <div className="content-container">
      <Slider {...settings} className="image-slider">
            {imgList.map((img, index) => (
              <div key={index} className="imageTool">
                <img className="image" src={ img ? `${storageURL}/carrot/img/${img}` : image} alt={`Image ${index}`} style={{height:"450px", width:"400px"}} />
              </div>
            ))}
          </Slider>
        </div>
        <div className="content-container">
          <div className="seller-info">
            <img src={`${storageURL}/member/Profile/${carrot.memberImg}`} alt="Seller" />
            <span className="seller-name">{carrot.memberNickname}</span>
          </div>
        <div>
        </div>

          <div style={{ display: visible ? 'block' : 'none' }}>
          <select id="carrotState" value={state} onChange={handleChange}>
            <option value="0" selected={carrot.carrotState === 0}>판매중</option>
            <option value="1" selected={carrot.carrotState === 1}>예약중</option>
            <option value="2" selected={carrot.carrotState === 2}>거래 완료</option>
          </select>
        </div>

          <div>
            <div className="title">{carrot.carrotTitle}</div>
          </div>
          <div className="tags-container">
            <span>#{carrot.carrotTag}</span>
            <span style={{color: "#998e8e"}}>{getTimeDifference(carrot.carrotCreatedAt)}</span>
          </div>
          <div className="description">
            <p>
              {carrot.carrotContent}
            </p>
          </div>
          <div style={{ fontSize: "13px" ,color: "#998e8e"}}> 관심 {carrot.carrotLike} • 조회 {carrot.carrotView} </div>
          <br/>
          <div className="price-container">
            <div className="price">
              <FontAwesomeIcon
                icon={faHeart}
                onClick={() => handleLike(carrot.carrotId)}
                style={{ color: isLiked ? 'red' : 'grey' }}
              /> 
              <div style={{paddingLeft:'20px'}}>               
              {carrot.carrotPrice}원
              </div>
            </div>
            {carrot.carrotState === 2 ? null : (<button className="chat-button" onClick={() => connectChat(carrot.memberId)}>채팅하기</button>) }
          </div>
        </div>
      </div>
    </>
    );

        //날짜 형식 변경
        function getTimeDifference(createdAt) {
          const now = new Date();
          const created = new Date(createdAt);
          const diffInSeconds = Math.floor((now - created) / 1000);
  
          if (diffInSeconds < 60) {
              return `${diffInSeconds}초 전`;
          } else if (diffInSeconds < 3600) {
              const diffInMinutes = Math.floor(diffInSeconds / 60);
              return `${diffInMinutes}분 전`;
          } else if (diffInSeconds < 86400) {
              const diffInHours = Math.floor(diffInSeconds / 3600);
              return `${diffInHours}시간 전`;
          } else {
              const diffInDays = Math.floor(diffInSeconds / 86400);
              return `${diffInDays}일 전`;
          }
      }
};

export default CarrotDetail;
