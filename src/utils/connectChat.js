import jwtAxios from '../service/jwtAxios.js';
import {url} from './single.js';

// 매개변수 = member PK
const connectChat = (e) => {
    jwtAxios.get(`${url}/api/chat?id=${e}`).then((response) => {
        console.log(response);
        const encoder = new TextEncoder();
        const encodedNickname = btoa(encoder.encode(response.data.nickname).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        const redirectUrl = `http://175.45.204.119:3000/chat/${response.data.roomId}-${encodedNickname}`;
        window.location.href = redirectUrl;
    }).catch((error) => {
        console.error(error);
    });
}

export default connectChat;