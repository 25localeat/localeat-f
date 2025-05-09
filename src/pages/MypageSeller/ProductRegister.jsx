/*
파일명 : ProductRegister.jsx
파일설명 : 로컬잇 웹사이트의 판매자 마이페이지/상품등록록 UI
작성자 : 김소망(프론트), 정여진(백엔드 일부 수정)
기간 : 2025-04-24~
*/
import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import './ProductRegister.css';
import Popup from '../../components/Ui/Popup/Popup';
import axios from 'axios';

const ProductRegister = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const editData = location.state?.editData || null;
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        region: '',
        groupbuy: '',
        limit: '',
        cheap: '',
        price: '',
        name: '',
        description: '',
        image: null,
        isSubscription: true,
        sellerId: '',
    });

    const [regionOptions, setRegionOptions] = useState([]);
    const [groupBuyOptions, setGroupBuyOptions] = useState([]);
    const [gradeBOptions, setGradeBOptions] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [popupType, setPopupType] = useState(null);

    const LOCAL_TYPE_MAP = {
        SGI: '서울/경기/인천',
        GANGWON: '강원',
        CHUNGCHEONG: '충청',
        JEONBUK: '전북',
        JNGJ: '전남/광주',
        DGGB: '대구/경북',
        GNBNUL: '경남/부산/울산',
        JEJU: '제주'
    };

    useEffect(() => {
        axios.get('/api/products/form-options').then(res => {
            setRegionOptions(res.data.localTypes);
            setGroupBuyOptions(res.data.groupBuyOptions);
            setGradeBOptions(res.data.gradeBOptions);
        });
    }, []);

    useEffect(() => {
        if (editData) {
            console.log("editData 값:", editData);

            setFormData({
                region: editData.region,
                groupbuy: editData.groupbuy,
                limit: editData.limit,
                cheap: editData.cheap,
                price: editData.price,
                name: editData.productName,
                description: editData.description,
                image: editData.image,
                isSubscription: true,
            });


            // 이미지 blob 요청
            axios.get(`/api/images/${editData.id}`, {
                responseType: 'blob'
            }).then(res => {
                const url = URL.createObjectURL(res.data);
                setImagePreview(url);
            }).catch(err => {
                console.error('이미지 로드 실패', err);
                setImagePreview(null);
            });
        }
    }, [editData]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({...formData, image: file});
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("전송 직전 이미지:", formData.image);

        if (!formData.image && !editData) {
            alert("이미지를 업로드해주세요.");
            return;
        }

        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const sellerId = storedUser.userId;

        const payload = {
            productName: formData.name,
            price: formData.price ? Number(formData.price) : null,
            local: formData.region || null,
            isGroupBuy: formData.groupbuy === 'O' ? true : formData.groupbuy === 'X' ? false : null,
            productGrade: formData.cheap === 'O' ? 'B' : formData.cheap === 'X' ? 'A' : null,
            maxParticipants: formData.groupbuy === 'O' && formData.limit ? Number(formData.limit) : null,
            description: formData.description,
            isSubscription: true,
            sellerId: sellerId,
        };


        try {
            let productId;
            if (editData) {
                await axios.put(`/api/products/${editData.id}`, payload);
                productId = editData.id;
            } else {
                const res = await axios.post('/api/products', payload);
                productId = res.data.id; // 백엔드가 productId 반환해야 함
            }

            if (formData.image) {
                const imageFormData = new FormData();
                imageFormData.append("file", formData.image);
                await axios.post(`/api/images/${productId}`, imageFormData, {
                    headers: {"Content-Type": "multipart/form-data"}
                });
            }

            setPopupType(editData ? 'edit' : 'register');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrors(error.response.data.errors || {});
                console.log(error.response.data.errors);
            } else {
                alert("저장 실패");
            }
        }
    };

    const closePopup = () => {
        setPopupType(null);
        navigate("/SellerMypage");
    };

    return (
        <div className="register-container">
            <h1 className="page-title">마이페이지</h1>
            <div className="form-box">
                <h2>{editData ? '상품 수정' : '상품 등록'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div>
                            <select name="region" value={formData.region} onChange={handleChange}>
                                {!editData && <option value="">지역</option>}
                                {regionOptions.map((r) => (
                                    <option key={r} value={r}>{LOCAL_TYPE_MAP[r] || r}</option>
                                ))}
                            </select>
                            {errors.local && <div className="error-text">{errors.local}</div>}

                        </div>
                        <div>
                            <select name="groupbuy" value={formData.groupbuy} onChange={handleChange}>
                                {!editData && <option value="">공동구매</option>}
                                {groupBuyOptions.map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                            {errors.isGroupBuy && <div className="error-text">{errors.isGroupBuy}</div>}
                        </div>

                        {/*공동구매를 할 때만 제한 인원 필드 노출*/}
                        {formData.groupbuy === 'O' && (
                            <div>
                                <select name="limit" value={formData.limit} onChange={handleChange}>
                                    <option value="">공구제한인원</option>
                                    {Array.from({length: 15}, (_, i) => (
                                        <option key={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                                {errors.maxParticipants && <div className="error-text">{errors.maxParticipants}</div>}
                            </div>
                        )}
                        <select name="cheap" value={formData.cheap} onChange={handleChange}>
                            {!editData && <option value="">알뜰상품</option>}
                            {gradeBOptions.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        {errors.productGrade && <div className="error-text">{errors.productGrade}</div>}

                        <input
                            type="number"
                            name="price"
                            placeholder="가격"
                            value={formData.price}
                            onChange={handleChange}
                        />
                        {errors.price && <div className="error-text">{errors.price}</div>}
                    </div>

                    <div className="upload-box">
                        <div className="image-upload">
                            <input type="file" id="fileUpload" onChange={handleFileUpload} hidden/>
                            <label htmlFor="fileUpload" className="image-box">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="미리보기"/>
                                ) : (
                                    <>
                                        <img src={require('./camera.png')} alt="카메라 아이콘" className="camera-icon"/>
                                        <div>대표 사진 올리기</div>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>


                    <input
                        type="text"
                        name="name"
                        placeholder="상품 이름"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-text"
                    />
                    {errors.productName && <div className="error-text">{errors.productName}</div>}

                    <textarea
                        name="description"
                        placeholder="상세 설명 내용 입력"
                        value={formData.description}
                        onChange={handleChange}
                        className="textarea-box"
                    />
                    {errors.description && <div className="error-text">{errors.description}</div>}

                    <button type="submit" className="submit-btn">
                        {editData ? '수정 완료' : '등록하기'}
                    </button>
                </form>

            </div>

            {popupType && (
                <Popup
                    type={popupType}
                    onCancel={closePopup}
                    onConfirm={closePopup}
                />
            )}
        </div>
    );
};

export default ProductRegister;