import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/carrot/CarrotList.css';
import image from '../../image/icon-photo.png';
import { storageURL } from '../../utils/single';

function CarrotResults({carrot}) {
    const navigate = useNavigate();

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
        <div>
            {
                carrot.map(carrot =>
                    <div className="product-item-container" onClick={() => navigate(`/carrot/details/${carrot.carrotId}`)}>
                    <div className="product-item" key={carrot.carrotId}>
                        <img src={carrot.carrotImg ? `${storageURL}/carrot/img/${carrot.carrotImg}` : image} alt="이미지" className="product-image" />
                        <div className="product-info">
                            <div className="product-name">
                                <div className="product-status">
                                {carrot.carrotState === 1 ? (
                                    <div className="status-label trading">거래중</div>
                                ) : carrot.carrotState === 2 ? (
                                    <div className="status-label completed">거래완료</div>
                                ) : null
                            }
                            </div>
                            <div className="product-title">
                                {carrot.carrotTitle}
                                </div>
                            </div>
                            <p className="product-location" style={{ textAlign: 'left', paddingLeft:'20px' }}>{getTimeDifference(carrot.carrotCreatedAt)}</p>
                            <p className="product-price" style={{ textAlign: 'left',paddingLeft:'20px' }}>{carrot.carrotPrice}원</p>
                            <div className="product-interactions">
                                <i className="fas fa-heart"></i>
                                <span className="like-count" style={{justifyContent:'right'}}>❤︎ {carrot.carrotLike}</span>
                            </div>
                        </div>
                    </div>
                </div>
                )
            }     
        </div>
    );
};

export default CarrotResults;