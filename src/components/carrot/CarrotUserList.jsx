import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import carrotService from '../../service/carrotService';
import '../../styles/carrot/CarrotList.css';
import image from '../../image/icon-photo.png';


const CarrotUserList = () => {
    const navigate = useNavigate();
    const [carrot, setCarrot] = useState([]);

    useEffect(() => {
        fetchCarrot();
      }, []);

      const fetchCarrot = () => {
            carrotService.getUserList().then((res) => {
              setCarrot(res.data);
            }).catch((err) => {
              console.log(err);
            });
      };

      //날짜형식 변경
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

    return (
      <div className="product-list-container">
        {carrot.length === 0 ? (
                <div className="no-products">당근장터에 올린 글이 없습니다.</div>
            ) : (
              carrot.map(carrot =>
                  <div className="product-item-container" onClick={() => navigate(`/carrot/details/${carrot.carrotId}`)}>
                  <div className="product-item" key={carrot.carrotId}>
                      <img src={carrot.carrotImg ? `${storageURL}/carrot/img/${carrot.carrotImg}` : image} alt="이미지" className="product-image" />
                      <div className="product-info">
                          {carrot.carrotState === 1 ? (<h4 style={{color : "green"}}>거래중</h4>) : null}
                          {carrot.carrotState === 2 ? (<h4 style={{color : "gray"}}>거래완료</h4>) : null}
                          <h3 className="product-name">{carrot.carrotTitle}</h3>
                          <p className="product-location">{getTimeDifference(carrot.carrotCreatedAt)}</p>
                          <p className="product-price">{carrot.carrotPrice}원</p>
                          <div className="product-interactions">
                          <span className="like">
                              <i className="fas fa-heart"></i>
                              <span className="like-count">관심 {carrot.carrotLike}</span>
                          </span>
                          </div>
                      </div>
                  </div>
              </div>
              )
          )}    
      </div>
    );
};

export default CarrotUserList;