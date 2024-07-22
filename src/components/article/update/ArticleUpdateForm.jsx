import React, { useEffect, useState } from 'react';


import { Button,CircularProgress } from '@mui/material';
import useForm from '../../../hooks/useForm';
import SelectBoard from '../write/atoms/SelectBoard';
import UserMakeTags from '../write/atoms/UserMakeTags';
import InputTitle from '../write/atoms/InputTitle';
import InputContent from '../write/atoms/InputContent';
import ImageUpload from '../write/atoms/ImageUpload';
import { useNavigate, useParams } from 'react-router-dom';
import { getUpdateArticle, resistUpdateArticle } from '../../../service/ArticleService';
import useToast from '../../../hooks/useToast.jsx';
import styled from 'styled-components';
import { Box } from '@mui/system';
import { storageURL } from '../../../utils/single';


const initialForm = {

    boardName: '',
    articleHead: '',
    articleTags: [],
    title: '',
    content: '',

}

const Overlay = styled.div`
  display: ${({ loading }) => (loading === 'true' ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const imageAsFile = (url) => {
    const fullUrl = `${storageURL}/article/img/${url}`
    const blob = new Blob([JSON.stringify(fullUrl)], { type: "application/json" });
    const file = new File([blob], url, { type: blob.type });
    return file
};

const ArticleUpdateForm = () => {

    const { articleId } = useParams();

    const [form, onChange, onInput, reset, setForm] = useForm(initialForm);

    const [resetSwitch, setResetSwitch] = useState(false);

    const [imgFiles, setImgFiles] = useState([]);
    const [previewList, setPreviewList] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const navigate = useNavigate();

    useEffect(() => {

        async function fetchData() {
            // You can await here
            const response = await getUpdateArticle(articleId);
            // ...
            const tagArray = response.articleTags.split(',');

            setForm({
                articleHead: response.articleHead,
                articleTags: tagArray,
                boardName: response.boardName,
                content: response.content,
                title: response.title
            })
            const imgArray = response.images && response.images.map(image => `${storageURL}/article/img/${image.imgUrl}`);

            const files = response.images && response.images.map((item) =>
                imageAsFile(item.imgUrl)
            )

            setImgFiles(files);
            setPreviewList(imgArray);
        }

        fetchData();

    }, [resetSwitch]);

    const validate = (form) => {
        const { articleHead, title, content } = form

        if (articleHead === '' || articleHead === null) {
            toast("머릿말을 선택해주세요.")
            return false;
        } else if (title === '' || title === null) {
            toast("제목을 입력해주세요")
            return false;
        } else if (content === '' || content === null) {
            toast("내용을 입력해주세요")
            return false;
        } else {
            return true;
        }
    }


    const onSubmit = async () => {

        if (validate(form)) {

            const formData = new FormData();
            Object.values(imgFiles).map((item, index) => {
                formData.append('files', item);
            });
            const blob = new Blob([JSON.stringify(form)], { type: "application/json" });
            formData.append('dto', blob);

            setLoading(true);

            await resistUpdateArticle(formData, articleId);

            setLoading(false);

            toast("정상적으로 수정되었습니다.")

            navigate(-1);
        }
    }

    return (

        <div>
            <Overlay loading={loading.toString()}>

                <Box sx={{ display: loading ? 'flex' : 'none' }}>
                    <CircularProgress sx={{ fontSize: '30pt' }} />
                </Box>
            </Overlay>

            <SelectBoard boardName={form.boardName} onChange={onChange} />
            <UserMakeTags articleTags={form.articleTags} onInput={onInput} />
            <InputTitle boardName={form.boardName} articleHead={form.articleHead} title={form.title} onChange={onChange} onInput={onInput} />
            <InputContent content={form.content} onChange={onChange} />
            <ImageUpload previewList={previewList} setPreviewList={setPreviewList} imgFiles={imgFiles} setImgFiles={setImgFiles} />

            <Button onClick={() => onSubmit()}>작성 완료</Button>
            <Button onClick={() => setResetSwitch(!resetSwitch)}>다시 쓰기</Button>

        </div>

    );

};

export default ArticleUpdateForm;