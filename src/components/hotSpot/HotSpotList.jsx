import React, {useEffect, useState} from 'react';
import {Box, Card, CardMedia, Divider, List, ListItem, ListItemText, Rating, Typography} from '@mui/material';
import {Link, useNavigate} from "react-router-dom";
import "../../styles/hotspot/hotSpot.css";
import VisibilityIcon from "@mui/icons-material/Visibility.js";
import {checkIsManager, getAllHostSpotList} from "../../service/hotSpotApi.jsx";
import BuildIcon from '@mui/icons-material/Build';
import {storageURL} from "../../utils/single";

const HotSpotList = () => {

    const navigate = useNavigate();

    const [hotSpotList, setHotSpotList] = useState([]);
    const [isManager, setIsManager] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getAllHostSpotList();
            console.log("data = " , result);
            setHotSpotList(result);

            // 회원 정보 가 role이 ADMIN인지 확인하는 요청
            const checkManager = await checkIsManager();
            if (checkManager === true) {
                setIsManager(checkManager);
            }
        }

        fetchData();
    }, []);


    return (
        <Box sx={{padding: 2}}>
            <br/>
            <Typography variant="h6" align="center"
                        sx={{ fontWeight: 'bold' }}
                        gutterBottom>
                🐕반려동물와 명소를 방문해보세요🐕‍🦺
            </Typography>
            <List>
                {hotSpotList.map((hotSpot, index) => (
                    <React.Fragment key={hotSpot.hotSpotId}>
                        <ListItem sx={{flexDirection: 'column', alignItems: 'center', paddingTop: 3, paddingBottom: 3}}>
                            <Card sx={{width: '100%'}}
                                  className="card"
                                  onClick={() => navigate(`/hotspot/details/${hotSpot.hotSpotId}`)}
                            >
                                <div className='cardCapter' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <CardMedia component="img"
                                           sx={{
                                               height: 200,
                                               width: '100%',
                                               objectFit: 'cover', // 이미지 비율을 유지하면서 크기 조정
                                               objectPosition: 'center' // 이미지의 중심을 기준으로 자르기
                                           }}
                                           image={`${storageURL}/palettepets/hotspot/` + hotSpot.imgUrl}
                                           alt={hotSpot.placeName}/>
                                    <ListItemText
                                        primary={hotSpot.placeName}
                                        secondary={
                                            <>
                                                <Rating value={hotSpot.rating} precision={0.5} readOnly size="small"/>
                                                <Typography variant="body2" color="textSecondary" component="p" className="truncated-text">
                                                    {hotSpot.simpleContent}
                                                </Typography>
                                                <Typography variant="" color="text.secondary">
                                                    <VisibilityIcon
                                                        sx={{verticalAlign: 'middle', mr: 0.5}}/> {hotSpot.countViews}
                                                </Typography>
                                            </>
                                        }
                                        align="center"
                                    />
                                </div>
                            </Card>

                        </ListItem>
                        {index !== hotSpotList.length - 1 && <Divider variant="middle"/>}
                    </React.Fragment>
                ))}
                {isManager && (
                    <>
                        <Link to="/hotspot/write">
                            <button className="write-button">
                                <BuildIcon/>
                            </button>
                        </Link>
                    </>
                )}

            </List>
        </Box>

    );
};

export default HotSpotList;