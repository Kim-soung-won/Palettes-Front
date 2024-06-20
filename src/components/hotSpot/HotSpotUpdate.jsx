import React, {useEffect, useState} from 'react';
import ImageUpload from "../article/write/atoms/ImageUpload.jsx";
import {Button} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import "../../styles/hotspot/hotSpotUpdate.css";
import {checkIsManager, getHotSpotDetail, updateHotSpot} from "../../service/hotSpotApi.jsx";
import Swal from "sweetalert2";


const HotSpotUpdate = () => {


    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [simpleContent, setSimpleContent] = useState("");
    const [address, setAddress] = useState("");
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);

    const [imgFiles, setImgFiles] = useState([]);
    const [previewList,setPreviewList] = useState([]);

    const navigate = useNavigate();
    const {id} = useParams();

    // 수정할 글 내용들 가져오기 -> 사진은 그냥 없앰
    useEffect(() => {
        const fetchData = async () => {
            const result = await getHotSpotDetail(id);
            console.log(result);
            setTitle(result.placeName);
            setSimpleContent(result.simpleContent);
            setContent(result.content);
            setAddress(result.address);
            setLat(result.lat);
            setLng(result.lng);
        }
        fetchData();
    }, []);

    const changeTitle = (e) => {
        setTitle(e.target.value);
    }

    const onSubmit = async () => {

        // 간단한 검증

        const dto = {
            hotSpotId:id,
            placeName: title,
            simpleContent:simpleContent,
            content: content,
            address: address,
            lat: lat,
            lng: lng
        };

        const formData = new FormData();
        Object.values(imgFiles).map((item) => {
            formData.append('files', item);
        });
        const blob = new Blob([JSON.stringify(dto)], { type: "application/json" });
        formData.append('request', blob);

        // 글 수정 api 연결
        const result = await updateHotSpot(id, formData);

        if (result === true) {
            navigate("/hotspot", {replace: true});
        } else {
            await Swal.fire({
                title: '명소 추천 글 수정 실패',
                text: '알 수 없는 이유로 실패했습니다. 관리자에게 문의해주세요',
                icon: 'warning'
            });
        }

    }

    const onReset = () =>{

        setTitle("");
        setSimpleContent("");
        setContent("");
        setImgFiles([]);
        setPreviewList([]);

    }


    return (
        <>
            <h1>수정 페이지</h1>
            <input type="hidden" value="6"/>
            <input
                value={title}
                className="update-title"
                type="update-text"
                placeholder="제목 수정"
                onChange={(e) => changeTitle(e)}
            />
            <br/>
            <input
                value={simpleContent}
                className="update-simpleContent"
                type="text"
                placeholder="간단 소개 수정"
                onChange={(e) => setSimpleContent(e.target.value)}
            />
            <br/>
            <textarea
                value={content}
                className="update-content"
                type="text"
                placeholder="내용 수정"
                onChange={(e) => setContent(e.target.value)}
            />
            <br/>
            <input
                value={address}
                className="update-address"
                type="text"
                placeholder="주소 수정"
                onChange={(e) => setAddress(e.target.value)}
            />
            <br/>
            <input
                value={lat}
                className="update-lat"
                type="number"
                placeholder="위도"
                onChange={(e) => setLat(e.target.value)}
            />
            <br/>
            <input
                value={lng}
                className="update-lng"
                type="number"
                placeholder="경도"
                onChange={(e) => setLng(e.target.value)}
            />
            <br/>
            <br/>
            <ImageUpload previewList={previewList} setPreviewList={setPreviewList} imgFiles={imgFiles}
                         setImgFiles={setImgFiles}/>

            <Button className="update-onSubmit" onClick={() => onSubmit()}>수정 완료</Button>
            <Button className="update-onReset" onClick={onReset}>다시 쓰기</Button>
        </>
    );
};

export default HotSpotUpdate;