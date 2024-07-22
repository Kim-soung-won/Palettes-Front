import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {following } from '../../service/memberApi'; // API 호출 함수 경로에 맞게 수정
import { Box, Typography, Avatar, Button, Grid, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { storageURL } from '../../utils/single';

const FollowingComp = ({ nickname }) => {
  const navigate = useNavigate();
  const [followings, setFollowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const data = await following(nickname); // API 호출
        console.log('Fetched data:', data); // 응답 데이터 구조 확인
        setFollowings(data);
      } catch (error) {
        console.error('Error fetching followings:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowings();
  }, [nickname]);

  const navigateBack = () => {
    navigate(`/member/${nickname}`);
  };
  const followerBTN = () => {
    navigate(`/member/follower/${nickname}`);
  };
  const followingBTN =() =>{
    
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px', position: 'relative', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={navigateBack}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', color: 'black' }}>{nickname}</Typography>
        <Box sx={{ width: 48 }} /> {/* 아이콘 버튼의 너비와 동일한 크기의 빈 박스 */}
      </Box>
  
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button variant="text" onClick={followerBTN} sx={{ marginRight: 1, color: 'black', padding: '9px 100px', fontSize: '16px' }}>팔로워</Button>
        <Button variant="text" sx={{ color: 'black', padding: '9px 100px', fontSize: '16px', borderBottom: '2px solid black' }}>팔로잉</Button>
      </Box>
  
      {followings.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'black', marginTop: 'auto', marginBottom: 'auto' }}>팔로잉 하고있는 친구가 없습니다.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 3}}>
          {followings.map(following => (
            <li
              key={following.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '10px 0',
                borderBottom: '1px solid #e1e1e1',
                padding: '10px', // 패딩 추가
                borderRadius: '5px' // 둥근 테두리 추가
              }}
              onClick={() => navigate(`/member/${following.nickname}`)}
            >
              <img
                src={`${storageURL}/member/Profile/${following.profile}`}
                style={{ borderRadius: '50%', marginRight: '10px', width: '50px', height: '50px' }} // 이미지 크기 설정
              />
              <span style={{color: 'black'}}>{following.nickname}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
};

export default FollowingComp;
