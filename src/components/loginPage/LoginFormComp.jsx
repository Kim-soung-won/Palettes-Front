import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoginStyle from '../../styles/loginPage/login.module.css';
import { login } from "../../service/api.jsx";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { saveToken } from "../../store/MemberSlice.js";
import {url} from '../../utils/single.js';
import { Toast } from '../../utils/single.js';
import "./../../styles/toast/toast.css"

const LoginFormComp = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('error') === 'true') {
            Toast.fire({
                icon: 'error',
                title: '로그인 실패',
                width: 300
            });
        }
    }, [location]);

    const requestLogin = async (e) => {
        e.preventDefault();
        try {
            const token = await login({ username, password });
            if (token === false) {
                Toast.fire({
                    icon: 'error',
                    title: '로그인 실패',
                    width: 300
                })
            } else {
                console.log('로그인 성공');
                Toast.fire({
                    icon: 'success',
                    title: '로그인 하였습니다',
                    width: 300
                });
                dispatch(saveToken(token));
                navigate({ pathname: '/' }, { replace: true });
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className={LoginStyle.body}>
            <form className={LoginStyle.form}>
                <div className={LoginStyle.formGroup}>
                    <label htmlFor="email" className={LoginStyle.label}>이메일</label>
                    <input type="email"
                           name="email"
                           className={LoginStyle.input}
                           placeholder="이메일 입력"
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                           required />
                </div>

                <div className={LoginStyle.formGroup}>
                    <label htmlFor="password" className={LoginStyle.label}>비밀번호</label>
                    <input type="password"
                           name="pwd"
                           className={LoginStyle.input}
                           placeholder="비밀번호 입력"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required />
                </div>

                <button className={LoginStyle.submitButton}
                        onClick={requestLogin}
                >로그인</button>
            </form>

            <div className={LoginStyle.links}>
                <div className={LoginStyle.linksInline}>
                    <Link to="/password" className={LoginStyle.link}>비밀번호 찾기</Link>
                    <span className={LoginStyle.separator}>|</span>
                    <Link to="/join" className={LoginStyle.link}>회원가입</Link>
                </div>
                <Link to={`${url}/oauth2/authorization/naver`} className={LoginStyle.link}>
                    <img
                        src='https://clova-phinf.pstatic.net/MjAxODAzMjlfOTIg/MDAxNTIyMjg3MzM3OTAy.WkiZikYhauL1hnpLWmCUBJvKjr6xnkmzP99rZPFXVwgg.mNH66A47eL0Mf8G34mPlwBFKP0nZBf2ZJn5D4Rvs8Vwg.PNG/image.png'className={LoginStyle.naverImg}/>
                </Link>
            </div>
        </div>
    );
};

export default LoginFormComp;