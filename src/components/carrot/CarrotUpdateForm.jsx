import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import carrotService from '../../service/carrotService';
import '../../styles/carrot/CarrotForm.css';
import ImageUpdate from './ImageUpdate';
import { storageURL } from '../../utils/single';

const imageAsFile = (url) => {
  const fullUrl = `${storageURL}/carrot/img/${url}`
  const blob = new Blob([JSON.stringify(fullUrl)], { type: "application/json" });
  const file = new File([blob], url, { type: blob.type });
  return file
};

const CarrotUpdateForm = () => {
  const navigate = useNavigate();

  const {id} = useParams();
  const [carrot, setCarrot] = useState([]);
  const [carrotTitle, setCarrotTitle] = useState('');
  const [carrotContent, setCarrotContent] = useState(null);
  const [carrotTag, setCarrotTag] = useState('');
  const [carrotPrice, setCarrotPrice] = useState('');
  const [imgFiles, setImgFiles] = useState([]);
  const [previewList, setPreviewList] = useState([]);

  useEffect(() => {
    setCarrotContent(null);
    fetchCarrot(id);
  }, [id]);

  const fetchCarrot = (id) => {
    console.log("id = "+id)
    //기존 정보 가져오기
    carrotService.getCarrotDetails(id).then((res) => {
      setCarrot(res.data);
      setCarrotTitle(res.data.carrotTitle);
      setCarrotContent(res.data.carrotContent);
      setCarrotPrice(res.data.carrotPrice);

      const imgArray = res.data.imgList && res.data.imgList.map(image => `${storageURL}/carrot/img/${image}`)
      console.log("real = " + imgArray);

      const files = res.data.imgList && res.data.imgList.map((item) => 
        imageAsFile(item)
      )

      setImgFiles(files);
      setPreviewList(imgArray);
      }).catch((err) => { 
        console.log(err)
      });
    }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

  // 사용자가 새로 입력한 값이 있는 경우 FormData에 추가
  if (carrotTitle !== '') {
    formData.append('carrotTitle', carrotTitle);
  } else {
    formData.append('carrotTitle', carrot.carrotTitle);
  }

  if (carrotContent !== '') {
    formData.append('carrotContent', carrotContent);
  } else {
    formData.append('carrotContent', carrot.carrotContent);
  }

  if (carrotTag !== '') {
    formData.append('carrotTag', carrotTag);
  } else {
    formData.append('carrotTag', carrot.carrotTag);
  }

  if (carrotPrice !== '') {
    formData.append('carrotPrice', carrotPrice);
  } else {
    formData.append('carrotPrice', carrot.carrotPrice);
  }
  // 이미지 파일 추가
//   Object.values(imgFiles).map((item, index) => {
//     formData.append('files', item);
// });

    try {
      const response = await carrotService.putCarrotUpdate(formData, id);
      console.log("stauts" + response.status);
      if (response.status === 200) {
        alert('글 수정에 실패했습니다. 다시 시도해주세요.');
      } else {
          alert('글 수정에 성공했습니다.')
          navigate(-1); // 이전 페이지로 이동
      }
      console.log("폼데이터2@= ", Object.fromEntries(formData.entries()));
    } catch (error) {
      // 글 작성 실패 시 오류 처리 로직 작성
      alert('글 수정에 실패했습니다. 다시 시도해주세요.');
      console.error('Error writing carrot:', error);
    }
  };

  const handleCancel = () => {
    navigate(-1); // 이전 페이지로 이동
  };

    return (
        <form className="write-post-form" onSubmit={handleSubmit}>
            <h2 >내 물건 수정하기</h2>
        <div className="form-group">
          <label style={{textAlign: 'left'}}>제목</label>
          <input
            type="text"
            id="carrotTitle"
            value={carrotTitle}
            onChange={(event) => setCarrotTitle(event.target.value)}            
            // placeholder={carrot.carrotTitle}
            style={{backgroundColor : 'white', color:'black'}}
          />
        </div>
        <div className="form-group">
          <label style={{textAlign: 'left'}}>설명</label>
          <textarea
            id="carrotContent"
            value={carrotContent}
            onChange={(event) => setCarrotContent(event.target.value)}
            // placeholder={carrot.carrotContent}
            style={{backgroundColor : 'white', color:'black'}}
          ></textarea>
        </div>
        <div className="form-group">
          <label style={{textAlign: 'left'}}>거래 방식</label>
          <select 
              id="carrotTag" 
              value={carrotTag || carrot.carrotContent} 
              onChange={(event) => setCarrotTag(event.target.value)}
              style={{backgroundColor : 'white', color:'black'}}>
            <option value="판매" selected={carrotTag === '판매'}>판매</option>
            <option value="구매" selected={carrotTag === '구매'}>구매</option>
            <option value="나눔" selected={carrotTag === '나눔'}>나눔</option>
            <option value="산책" selected={carrotTag === '산책'}>산책</option>
          </select>
        </div>
        <div className="form-group">
          <label style={{textAlign: 'left'}}>가격</label>
          <input
            type="text"
            id="carrot_price"
            value={carrotPrice}
            onChange={(event) => setCarrotPrice(event.target.value)}
            style={{backgroundColor : 'white', color:'black'}}
          />
        </div>
        <div className="form-group">
          <ImageUpdate previewList={previewList} setPreviewList={setPreviewList} imgFiles={imgFiles} setImgFiles={setImgFiles}/>
        </div>
        <button type="submit" className="submit-button" onClick={() => handleSubmit(formatDate)}>
          수정 완료
        </button>
        <button type="reset" className="submit-button" onClick={() => handleCancel()}>취소</button>
      </form>
    );
};

export default CarrotUpdateForm;