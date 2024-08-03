import DefaultLayout from "../layouts/DefaultLayout.jsx";
import BoardViewComp from "../components/mainPage/BoardViewComp.jsx";
import {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {saveToken} from "../store/MemberSlice.js";
import Cookies from 'js-cookie';
import axios from "axios";

const MainPage = () => {

    // 네이버 연동 로그인 리다이렉트를 위한 로직
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const oauthCallback = searchParams.get('oauthCallback');
    const dispatch = useDispatch();

    useEffect(() => {
        if (oauthCallback === "true") {
            const token = "Bearer " + Cookies.get('Authorization');
            console.log(token);
            dispatch(saveToken(token));
            // Authorization 쿠키 제거
            Cookies.remove('Authorization');
        }
        axios.get('/hello')
            .then(res => {
            })
            .catch(err => {
            })
    },[]);

    return (
        <>
            <DefaultLayout>
                {/* <UpdateComp/> */}
                <br/>
                <BoardViewComp/>
                <hr/>
                {/* <ReviewComp/> */}
                <br/>
            </DefaultLayout>
        </>
    )
}

export default MainPage;