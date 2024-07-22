import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button, Grid, IconButton, Link } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useNavigate } from 'react-router-dom';
import { myPageProfile, myPageFeed, follow, unfollow } from '../../service/memberApi';
import {petImgListInMyPageRequest} from "../../service/petApi.jsx";
import { parseJSON } from 'date-fns';
import { storageURL } from '../../utils/single.js';


const MyPageComp = ({ nickname }) => {
    const [user, setUser] = useState({ nickname: '', img: null, following: 0, followers: 0, feeds: 0, memberId: '', followTF: false});
    const [feeds, setFeeds] = useState([]);
    const navigate = useNavigate();
    // 반려동물
    const [pets, setPets] = useState([]);

    useEffect(() => {
        const fetchProfileData = async () => {
            
            try {
                const data = await myPageProfile(nickname);
                setUser({
                    nickname: data.nickname,
                    img: data.img,
                    following: data.following || 0,
                    followers: data.follower || 0,
                    memberId: data.memberId,
                    feeds: data.feed || 0,
                    followTF: data.followTF
                });
                console.log("현재 나 닉네임=="+data.memberId );
                console.log("지금 들어가있는 프로필 닉네임=="+nickname)
                console.log("팔로우 여부 입니다요!!"+ data.followTF);
                console.log("팔로우 여부 입니다요!!"+ user.followTF);
            
            } catch (error) {
                console.error('프로필 정보를 불러오는 중 오류 발생:', error);
            }
            
        };
        
        const fetchFeedData = async () => {
            try {
                const data = await myPageFeed(nickname);
                console.log('feed 응답 데이터:??', data);
                setFeeds(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('피드 정보를 불러오는 중 오류 발생:', error);
            }
        };

        const fetchPetData = async () => {
            console.log("user ::  "+ JSON.stringify(user))
            console.log("user id ::  "+nickname)
            try {
                const data = await petImgListInMyPageRequest(nickname);
                setPets(data);
            } catch (error) {
                console.error('반려동물 정보를 불러오는 중 오류 발생:', error);
            }
        }

        fetchProfileData();
        fetchFeedData();
        fetchPetData();
    }, [nickname]);

    const handleFollowingClick = () => {
        navigate(`/member/following/${user.nickname}`);
    };

    const handleFollowerClick = () => {
        navigate(`/member/follower/${user.nickname}`);
    };

    const navigateBack = () => {
        navigate('/');
    };

    const navigateToSettings = () => {
        navigate('/member/setting'); 
    };

    // 반려동물 추가 페이지 이동 버튼
    const petAddPageButton = () => {
        navigate(`/pet/list`);
    }

    const handleFloatingButtonClick = () => {
        navigate(`/member/feed`);
    };
    const profileImgButton = () => {
        navigate(`/member/image/profile`);
    }
    const followButtonClick = async () => {
        try {
            const response = await follow(user.nickname);
            console.log("팔로우 성공:", response);
            window.location.reload();
            
        } catch (error) {
            console.error("팔로우 실패:", error);
        }
    };
    const unfollowButtonClick = async () => {
        try {
            const response = await unfollow(user.nickname);
            window.location.reload();
        } catch (error) {
            
            console.error("언팔로우 실패:", error);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 ,color: 'black'}}>
                <IconButton onClick={navigateBack}>
                    <ChevronLeftIcon />
                </IconButton>
                <Typography variant="h6">{user.nickname}</Typography>
                <IconButton onClick={navigateToSettings}>
                <MoreVertIcon />
                </IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
                <Avatar src={`${storageURL}/member/Profile/${user.img}`} sx={{ width: 190, height: 190, mr: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center',color: 'black', ml: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 4 }}>
                        <Typography>{user.feeds}</Typography>
                        <Typography>게시물</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 4 }}>
                        <Link onClick={handleFollowingClick} sx={{ textDecoration: 'none', color: 'inherit' }}>
                            {user.following}
                            <Typography>팔로잉</Typography>
                        </Link>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 4 }}>
                        <Link onClick={handleFollowerClick} sx={{ textDecoration: 'none', color: 'inherit' }}>
                            {user.followers}
                            <Typography>팔로워</Typography>
                        </Link>
                    </Box>

                </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2,marginLeft: 5,margin: 5 }}>
  {nickname === user.memberId ? (
    <>
      <Button
        onClick={profileImgButton}
        sx={{
          backgroundColor: '#e1e1e1',
          color: 'black',
          padding: '10px 20px',
          fontSize: '16px',
          minWidth: '200px',
        }} // 연한 회색 배경, 글자 색상 검정, 버튼 크기 확대
      >
        프로필 이미지 변경
      </Button>
      <Button
        variant="contained"
        sx={{
          backgroundColor: 'black',
          color: 'white',
          padding: '9px 100px',
          fontSize: '16px',
          minWidth: '200px',
          '&:hover': {
            backgroundColor: 'white',
            color: 'black',
          },
        }} // 검정색 배경, 글자 색상 흰색, 버튼 크기 확대, 호버 스타일 추가
        onClick={handleFloatingButtonClick}
      >
        피드 작성하기
      </Button>
    </>
  ) : (
    <>
      {user.followTF ? (
        <Button
          variant="contained"
          onClick={followButtonClick}
          sx={{
            backgroundColor: 'black',
            color: 'white',
            padding: '9px 100px',
            fontSize: '16px',
            minWidth: '200px',
            '&:hover': {
              backgroundColor: 'white',
              color: 'black',
            },
          }} // 검정색 배경, 글자 색상 흰색, 버튼 크기 확대, 호버 스타일 추가
        >
          팔로우
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={unfollowButtonClick}
          sx={{
            backgroundColor: '#e1e1e1',
            color: 'black',
            padding: '9px 100px',
            fontSize: '16px',
            minWidth: '200px',
            '&:hover': {
              backgroundColor: 'black',
              color: 'white',
            },
          }} // 흰색 배경, 글자 색상 검정, 버튼 크기 확대
        >
          언팔로우
        </Button>
      )}
    </>
  )}
</Box>

            <div
            style={{
                textAlign: 'left', // 글자 왼쪽 정렬
                fontSize: '12px', // 글자 크기 작게 설정
                color: 'gray'
            }}
            > 반려동물 </div>
            {/* 이곳에 가로 슬라이드를 만들어 */}
            <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', mt: 2 }}>
                {pets.map((pet, index) => (
                    <Box
                        key={index}
                        component="img"
                        src={`${storageURL}/pet/img/${pet.imgUrl}`}
                        alt={`pet-${index}`}
                        sx={{ width: 150, height: 150, objectFit: 'cover', display: 'inline-block', mr: 1 }}
                        onClick={() => navigate(`/pet/details/${pet.petId}`)}
                    />
                ))}
                <Button
                    onClick={petAddPageButton}
                    sx={{
                        width: 150,
                        height: 150,
                        borderRadius: '50%', // 원형 버튼
                        display: 'inline-block',
                        mr: 1,
                        verticalAlign: 'top',
                        backgroundColor: 'white', // 버튼 배경색을 검정색으로 설정
                        fontSize: '60px', // 텍스트 크기 설정
                        color: 'black',
                        '&:hover': {
                            backgroundColor: 'white', // 호버 시 배경색 변경
                            color: 'black' // 호버 시 텍스트 색상 변경
                        }
                    }}
                >+</Button>
            </Box>
            <div
            style={{
                textAlign: 'left', // 글자 왼쪽 정렬
                fontSize: '12px', // 글자 크기 작게 설정
                color: 'gray'
            }}
            > 피드</div>
            {feeds.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', border: '1px solid #ccc', borderRadius: 2, mt: 2 }}>
                    <Typography variant="body1" align="center" sx={{color: 'black'}}>
                        피드가 존재하지 않습니다.
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {feeds.map((feed, index) => (
                        <Grid item xs={4} key={index}>
                            <Box
                                component="img"
                                src={`${storageURL}/feed/img/${feed.img}`}
                                alt={`feed-${index}`}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onClick={() => navigate(`/member/feed/detail/${feed.feedId}`)}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
            
        </Box>
    );
};

export default MyPageComp;
