import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Badge from '@mui/material/Badge';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {CssBaseline, Typography, useMediaQuery} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {getAllUnreadNotifications, logout} from "../service/api.jsx";
import {deleteToken} from "../store/MemberSlice.js";
import Swal from 'sweetalert2';
import {EventSourcePolyfill} from "event-source-polyfill";
import {url} from "../utils/single.js";
import LogoutIcon from '@mui/icons-material/Logout';
import "./../styles/toast/toast.css"
import "./../styles/layout/header.css"
import {useTheme} from "@mui/material/styles";
import LoginIcon from '@mui/icons-material/Login';

import base64 from 'base-64';
import {getMemberNickname} from "../service/memberApi.jsx";
import logo from '../image/header/logo.png';

export default function Header() {
    const navigate = useNavigate();
    const token = useSelector((state) => state.MemberSlice.token);
    const dispatch = useDispatch();

    const [notification, setNotification] = useState([]);
    const [eventSource, setEventSource] = useState(null);

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
        customClass: {
            container: 'toastContainer',
        }
    })

    // JWT 토큰에서 닉네임을 추출하는 함수
    // const getNicknameFromToken = () => {
    //     let payload = token.substring(token.indexOf('.')+1,token.lastIndexOf('.'));
    //     let dec = base64.decode(payload)
    
    //     let nickname = JSON.parse(dec).memberNickname;
    //     console.log("dec="+nickname);
    //     return nickname;
    //     // navigate(`/member/${nickname}}`);
    // };

    const ToastLogout = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 500,
        timerProgressBar: false,
        customClass: {
            container: 'toastContainer',
        }
    })

    // 알림 버튼 누르면 알림으루
    const handleGoToNotification = () => {
        if (token) {
            navigate("/notification");
        } else {
            Toast.fire({
                icon: 'error',
                title: '로그인 해주세요!',
                width: 300
            })
            navigate("/login");
        }
    };

    // 읽지 않은 알림들 가져오기
    const fetchData = async () => {
        try {
            const result = await getAllUnreadNotifications();
            if (result === "스프링 시큐리티 세션에서 가져올 정보가 존재하지 않음") {
                fetchData();
            }
            setNotification(result);
        } catch (e) {
            console.log("error 발생 ,", e);
        }
    }

    // 실시간 알림 SSE 요청
    useEffect(() => {

        // if (token === undefined || token === '' || !token) {
        //     return;
        // }

        // //SSE 연결 로직
        // const connectSSE = () => {
        //     const source = new EventSourcePolyfill(`${url}/connect`, {
        //         headers: {
        //             authorization: token,
        //         },
        //         withCredentials: true,
        //         timeout : 40000 // 40초
        //     });

        //     source.addEventListener('notification', (e) => {
        //         //'notification' 이벤트가 오면 할 동작
        //         setEventSource(source);
        //         if (e.data === "NOTIFICATION_CONNECT_SUCCESS") {
        //             return;
        //         }
        //         Toast.fire({
        //             icon: 'success',
        //             title: e.data,
        //             width: 450
        //         })
        //         fetchData();
        //     });

        //     return () => {
        //         source.close();
        //     };
        // };

        // connectSSE();

        // const intervalId = setInterval(() => {
        //     if (eventSource && eventSource.readyState === EventSource.CLOSED) {
        //         console.log('SSE connection closed, reconnecting...');
        //         connectSSE();
        //     }
        // }, 5000);

        // return () => {
        //     clearInterval(intervalId);
        //     if (eventSource) {
        //         eventSource.close();
        //     }
        // };

    }, []);

    // 기본 알림 기능
    useEffect(() => {

        if (token === undefined || token === '' || !token) {
            return;
        }
        fetchData();

    }, []);

    // 로그인 했으면 프로필로, 아니면 로그인
    const handleProfileOrLogIn = async () => {
        if (token === undefined || token === '' || !token) {
            Toast.fire({
                icon: 'error',
                title: '로그인 해주세요!',
                width: 300
            })
            navigate("/login");
        } else {
            let nickname = await getMemberNickname();
            navigate(`/member/${nickname}`); // 나중에 회원 마이페이지 가도록
        }
    }

    // 로그아웃 요청 api
    const requestLogout = async () => {
        const result = await logout();
        dispatch(deleteToken());
        setNotification([]);
        ToastLogout.fire({
            icon: 'success',
            title: '로그아웃 하였습니다',
            width: 300
        }).then((Res) => {
            if(Res.value) {
                navigate("/");
            }
        })
    }

    // 모바일 메뉴 관련 기능
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
    const goToMain = () => {
        navigate("/");
    }

    return (
        <Box sx={{ flexGrow: 1 }} className={'mainHeader'}>
            <CssBaseline />
            <AppBar
                sx={{
                    position: 'fixed',
                    bottom: '10',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            mr: 2,
                            flexShrink: 0,
                            display: 'flex',
                            justifyContent: isMobileView ? 'flex-start' : 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            component="img"
                            alt="logo"
                            src={logo}
                            onClick={goToMain}
                            sx={{
                                width: isMobileView ? '30%' : '40%',
                                height: 'auto',
                                cursor: 'pointer',
                            }}
                        />
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: isMobileView ? 'flex-end' : 'flex-end',
                            width: isMobileView ? '100%' : 'auto',
                            pr: isMobileView ? 2 : 0,
                        }}
                    >
                        <IconButton
                            size={isMobileView ? 'small' : 'large'}
                            aria-label="show new notifications"
                            color="inherit"
                            onClick={handleGoToNotification}
                            sx={{ ml: isMobileView ? 0.5 : 1, color: 'black'}}
                        >
                            <Badge badgeContent={notification.length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size={isMobileView ? 'small' : 'large'}
                            aria-label="account of current user"
                            aria-haspopup="true"
                            onClick={handleProfileOrLogIn}
                            color="inherit"
                            sx={{ ml: isMobileView ? 0.5 : 1, color: 'black' }}
                        >
                            <AccountCircle />
                        </IconButton>
                        {
                            token ? (
                                <IconButton
                                    size={isMobileView ? 'small' : 'large'}
                                    edge="end"
                                    aria-label="logout btn show when user login"
                                    aria-haspopup="true"
                                    onClick={requestLogout}
                                    color="inherit"
                                    sx={{ ml: isMobileView ? 0.5 : 1, color: 'black' }}
                                >
                                    <LogoutIcon />
                                </IconButton>
                            ) : (
                                <IconButton
                                    size={isMobileView ? 'small' : 'large'}
                                    edge="end"
                                    aria-label="login btn show when user logout"
                                    aria-haspopup="true"
                                    onClick={() => navigate("/login")}
                                    color="inherit"
                                    sx={{ ml: isMobileView ? 0.5 : 1, color: 'black' }}
                                >
                                    <LoginIcon />
                                </IconButton>
                            )
                        }
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
