/**
 * Basic Apis
 *
 * - test api
 * - login / logout api
 */

import axios from "axios";
import jwtAxios from "./jwtAxios.js";
import {url, urlNoPort} from "../utils/single.js";

const API_SERVER_HOST = `${url}`;

const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": `${urlNoPort}:3000`,
}


axios.defaults.withCredentials = true; // withCredentials 전역 설정
axios.defaults.baseURL = API_SERVER_HOST;


// test 조회 api -> 예시용 (쓰지마세요)
export const memberTest = () => {
    return axios.get(`${API_SERVER_HOST}/member/test`, {
        headers: {
            jsonHeaders
        }
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error(error);
            return error.response.data;
        });
}

// login 로직
export const login = (dto) => {
    return axios.post(`${API_SERVER_HOST}/login`, {
        username: dto.username,
        password: dto.password,
    }, {
        headers: jsonHeaders
    })
    .then((response) => {
        const token = response.headers.authorization;
        return token;
    })
    .catch((error) => {
        console.error(error);
        console.error(error.response.data);
        return error.response.data;
    });
}

// naver login 로직
// export const naverLogin = () => {
//     return axios.get(`http://localhost:8080/oauth2/authorization/naver`, {
//         headers: jsonHeaders
//     })
//         .then((response) => {
//             if (response.headers.oauth === "true") {
//                 const token = response.headers.authorization;
//                 return token;
//             } 
//         })
//         .catch((error) => {
//             console.error(error);
//             console.error(error.response.data);
//             return error.response.data;
//         });
// }

// logout post 요청
export const logout = () => {
    return axios.post(`${API_SERVER_HOST}/logout`, {}, {
        headers: jsonHeaders
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error(error);
            console.error(error.response.data);
            return error.response.data;
        });
}

// jwt 및 재발급 테스트용 GET 요청
export const jwtTestRequest = () => {
    return jwtAxios.get(`${API_SERVER_HOST}/api/hello`, {
        headers: {
            // "Authorization": token
        }
    })
        .then(response => response.data)
        .catch((error) => {
            console.error(error);
            return error.response.data;
        });
}

export const getAllUnreadNotifications = () => {
    return jwtAxios.get(`${API_SERVER_HOST}/api/issues`, {})
        .then(response => response.data)
        .catch((error) => {
            console.error("error 발생 - [jwtAxios get 요청 /api/issues]");
            console.error(error);
            return error.response.data;
        })
}

export const changeIsReadNotification = (memberIssueId) => {
    return jwtAxios.put(`${API_SERVER_HOST}/api/issues/${memberIssueId}`, {})
        .then(response => response.data)
        .catch((error) => {
            console.error("error 발생 - [jwtAxios get 요청 /api/issues]");
            console.error(error);
            console.error(error.response.data);
            return error.response.data;
        })
}