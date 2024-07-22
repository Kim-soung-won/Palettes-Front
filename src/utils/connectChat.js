import jwtAxios from '../service/jwtAxios.js';
import {url} from './single.js';

// 매개변수 = member PK
const connectChat = (e) => {
    jwtAxios.get(`${url}/api/chat?id=${e}`).then((response) => {
        console.log(response);
        const persistData = JSON.parse(localStorage.getItem("persist:root"));
        console.log("persistData : "+persistData)
        const memberSlice = JSON.parse(persistData.MemberSlice);
        console.log("memberSlice : "+memberSlice)
        const token = memberSlice.token;
        const encoder = new TextEncoder();
        const encodedNickname = btoa(encoder.encode(response.data.nickname).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        const redirectUrl = `http://175.45.204.119:3000/chat/${response.data.roomId}-${encodedNickname}?token=${token}`;
        window.location.href = redirectUrl;
    }).catch((error) => {
        console.error(error);
    });
}

export default connectChat;