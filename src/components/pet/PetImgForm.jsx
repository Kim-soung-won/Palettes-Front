import {Box, Button, IconButton, ImageList, ImageListItem} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import DeleteIcon from '@mui/icons-material/Delete';
import PetUpdateForm from "./PetUpdateForm.jsx";
import {useEffect, useState} from "react";
import PetImgRegisterForm from "./PetImgRegisterForm.jsx";
import {petImgDeleteRequest, petImgListRequest} from "../../service/petApi.jsx";
import { storageURL } from '../../utils/single.js';

const PetImgForm = ({ closePictures, petId }) => {

    const [photos, setPhotos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // dummy data
    // const photos = [
    //     { img: 'https://cdn.imweb.me/upload/S201910012ff964777e0e3/62f9a36ea3cea.jpg', title: 'Photo 1' },
    //     { img: 'https://product.cdn.cevaws.com/var/storage/images/media/adaptil-2017/images/www-ww/shutterstock_395310793-3-2/3547034-1-www-WW/shutterstock_395310793-3-2.jpg', title: 'Photo 2' },
    //     { img: 'https://shop.peopet.co.kr/data/goods/388/2022/06/_temp_16557127733930list1.jpg', title: 'Photo 3' },
    //     { img: 'https://m.segye.com/content/image/2022/05/23/20220523519355.jpg', title: 'Photo 4' },
    //     { img: 'https://www.dailysecu.com/news/photo/202104/123449_145665_1147.png', title: 'Photo 5' },
    //     { img: 'https://cdn.imweb.me/upload/S201807025b39d1981b0b0/5cac274d00b12.jpg', title: 'Photo 6' },
    // ];

    // pet img 리스트 get 요청
    useEffect( () => {
        const fetchData = async () => {
            console.log(petId);
            const result = await petImgListRequest(petId);
            console.log("result", result);
            setPhotos(result);
        };
        fetchData();
    }, []);

    // 사진 삭제 함수
    const handleDeletePhoto = async (imgPetId) => {
        try {
            await petImgDeleteRequest(imgPetId);
            setPhotos(photos.filter((photo) => photo.imgPetId !== imgPetId));
        } catch (error) {
            console.error('사진 삭제 중 오류가 발생했습니다:', error);
        }
    };

    return (
        <Box sx={{ width: '100%', height: '100%', overflowY: 'scroll' }}>
            <ImageList variant="masonry" cols={2} gap={8}>
                {
                    photos.length > 0 && (
                        photos.map((photo) => (
                            <ImageListItem key={photo.imgPetId}>
                                <img
                                    src={`${storageURL}/pet/img/${photo.imgUrl}?w=248&fit=crop&auto=format`}
                                    srcSet={`${storageURL}/pet/img/${photo.imgUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    alt={photo.imgPetId}
                                    loading="lazy"
                                />
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        color: 'white',
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    }}
                                    onClick={() => handleDeletePhoto(photo.imgPetId)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ImageListItem>
                        ))
                    )
                }
                {
                    photos.length === 0 && (
                        <>
                            <ImageNotSupportedIcon/>
                            <div>아직 등록한 사진이 없어요</div>
                        </>
                    )
                }
            </ImageList>
            <Button onClick={() => setIsModalOpen(!isModalOpen)}
                    variant="contained"
                    color={"inherit"}
                    startIcon={<AddAPhotoIcon/>}
                    size="large"
            >
                사진 추가
            </Button>

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <PetImgRegisterForm closeModal={closeModal} petId={petId} />
                    </div>
                </div>
            )}
        </Box>
    );
}

export default PetImgForm;