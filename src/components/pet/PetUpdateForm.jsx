import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {useState} from "react";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import {Button, FormHelperText, InputAdornment} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {petUpdateRequest} from "../../service/petApi.jsx";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import { storageURL } from "../../utils/single.js";

const PetUpdateForm = ({ closeModal, pet }) => {

    const [petName, setPetName] = useState(pet.petName);
    const [petImage, setPetImage] = useState(pet.petImage);
    const [petImagePreview, setPetImagePreview] = useState(`${storageURL}/pet/` + pet.petImage);
    const [petCategory1, setPetCategory1] = useState(pet.petCategory1);
    const [petCategory2, setPetCategory2] = useState(pet.petCategory2);
    const [petGender, setPetGender] = useState(pet.petGender);
    const [petBirth, setPetBirth] = useState();
    const [petWeight, setPetWeight] = useState();
    const navigate = useNavigate();

    console.log(pet)

    const updatePet = async () => {

        if (petName === undefined || petName === "") {
            alert("Please enter petName");
            return;
        } else if (petCategory1 === undefined || petCategory1 === "") {
            alert("Please enter petCategory1");
            return;
        } else if (petCategory2 === undefined || petCategory2 === "") {
            alert("Please enter petCategory2");
            return;
        } else if (petBirth === undefined || petBirth === "") {
            alert("Please enter petBirth");
            return;
        } else if (petGender === undefined || petGender === "") {
            alert("Please enter petGender");
            return;
        }  else if (petWeight === undefined || petWeight === null) {
            alert("Please enter petWeight");
            return;
        }

        const dto = {
            petId: pet.petId,
            createdWho: null,
            petName: petName,
            petImage: pet.petImage,
            petCategory1: petCategory1,
            petCategory2: petCategory2,
            petBirth: petBirth.toString(),
            petGender: petGender,
            petWeight: petWeight,
        }

        const result = await petUpdateRequest(dto, petImage);
        console.log(result);
        if (result === true) {
            window.location.reload();
        } else {
            await Swal.fire({
                title: '펫 등록 실패',
                text: '정보를 다시 입력해주세요',
                icon: 'warning'
            });
        }
    };

    const handleChangePetName = (e) => {
        setPetName(e.target.value);
    }
    const handleChangePetCategory1 = (e) => {
        setPetCategory1(e.target.value);
    }
    const handleChangePetCategory2 = (e) => {
        setPetCategory2(e.target.value);
    }
    const handleChangePetGender = (e) => {
        setPetGender(e.target.value);
    }
    const handleChangePetWeight = (e) => {
        setPetWeight(e.target.value);
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setPetImage(file);
        const reader = new FileReader();
        reader.onload = () => {
            setPetImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    }

    return (
        <>
            <div className="pet">
                <h2>반려동물 정보 수정</h2>
            </div>
            <div className="register-form">
                <TextField id="outlined-basic" fullWidth={true} label="petName" variant="outlined"
                           value={petName} onChange={handleChangePetName} required/>
                <br/>
                <br/>
                {petImagePreview && (
                    <img src={petImagePreview} width="100" height="100" alt="펫 이미지 미리보기" />
                )}
                <input
                    accept="image/*"
                    style={{display: 'none'}}
                    id="raised-button-file"
                    type="file"
                    onChange={handleImageUpload}
                />
                <br/>
                <label htmlFor="raised-button-file">
                    <Button variant="contained" component="span">
                        이미지 업로드
                    </Button>
                </label>
                <br/>
                <br/>
                <FormControl fullWidth={true}>
                    <InputLabel id="petCategory1_label">대분류</InputLabel>
                    <Select
                        labelId="petCategory1_label"
                        id="demo-simple-select"
                        value={petCategory1}
                        label="petCategory1"
                        onChange={handleChangePetCategory1}
                    >
                        <MenuItem value={'dog'}>강아지</MenuItem>
                        <MenuItem value={'cat'}>고양이</MenuItem>
                    </Select>
                </FormControl>
                &nbsp;&nbsp;&nbsp;&nbsp;
                {
                    petCategory1 === "dog" && (
                        <FormControl fullWidth={true}>
                            <InputLabel id="petCategory2_label">소분류</InputLabel>
                            <Select
                                labelId="petCategory2_label"
                                id="demo-simple-select"
                                value={petCategory2}
                                label="petCategory2"
                                onChange={handleChangePetCategory2}
                            >
                                <MenuItem value={''}>선택하세요</MenuItem>
                                <MenuItem value={'koka'}>코카니얼</MenuItem>
                                <MenuItem value={'jindo'}>진돗개</MenuItem>
                                <MenuItem value={'siba'}>시바견</MenuItem>
                            </Select>
                        </FormControl>
                    )
                }
                {
                    petCategory1 === "cat" && (
                        <FormControl fullWidth={true}>
                            <InputLabel id="petCategory2_label">소분류</InputLabel>
                            <Select
                                labelId="petCategory2_label"
                                id="demo-simple-select"
                                value={petCategory2}
                                label="petCategory2"
                                onChange={handleChangePetCategory2}
                            >
                                <MenuItem value={''}>선택하세요</MenuItem>
                                <MenuItem value={'Ragdoll'}>랙돌</MenuItem>
                                <MenuItem value={'RussianBlue'}>러시안 블루</MenuItem>
                                <MenuItem value={'NorwegianForestCat'}>노르웨이 숲 고양이</MenuItem>
                            </Select>
                        </FormControl>
                    )
                }
                <br/>
                <br/>
                <FormControl fullWidth={true}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="출생일"
                            value={petBirth}
                            onChange={(newValue) => setPetBirth(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                        />
                    </LocalizationProvider>
                </FormControl>
                <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <FormControl fullWidth={true}>
                    <InputLabel id="petGender">성별</InputLabel>
                    <Select
                        labelId="petGender"
                        id="demo-simple-select"
                        value={petGender}
                        label="petGender"
                        onChange={handleChangePetGender}
                    >
                        <MenuItem value={'M'}>남아</MenuItem>
                        <MenuItem value={'F'}>여아</MenuItem>
                    </Select>
                </FormControl>
                <br/>
                <br/>
                <FormControl fullWidth={true} variant="outlined">
                    <OutlinedInput
                        value={petWeight}
                        onChange={handleChangePetWeight}
                        id="outlined-adornment-weight"
                        endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                        aria-describedby="outlined-weight-helper-text"
                        inputProps={{
                            'aria-label': 'weight',
                        }}
                    />
                    <FormHelperText id="outlined-weight-helper-text">Weight</FormHelperText>
                </FormControl>

                <Button variant="outlined" onClick={updatePet}>등록</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button variant="outlined" onClick={closeModal}>취소</Button>

            </div>
        </>
    );
}

export default PetUpdateForm;