/*
파일명 : ProductRegister.jsx
파일설명 : 로컬잇 웹사이트의 판매자 마이페이지/상품등록록 UI
작성자 : 김소망(프론트), 정여진(백엔드 일부 수정)
기간 : 2025-04-24~
*/
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProductRegister.css';
import Popup from '../../components/Ui/Popup/Popup';
import axios from 'axios';

const ProductRegister = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const editData = location.state?.editData || null;

    const [formData, setFormData] = useState({
        region: '',
        groupbuy: '',
        limit: '',
        cheap: '',
        price: '',
        name: '',
        description: '',
        image: null,
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

    const REVERSE_LOCAL_TYPE_MAP = Object.fromEntries(
        Object.entries(LOCAL_TYPE_MAP).map(([key, value]) => [value, key])
    );

    useEffect(() => {
        axios.get('/api/products/local').then(res => setRegionOptions(res.data));
        axios.get('/api/products/group-buy').then(res => setGroupBuyOptions(res.data));
        axios.get('/api/products/grade-b').then(res => setGradeBOptions(res.data));
    }, []);

    useEffect(() => {
        if (editData) {
            setFormData({
                region: editData.region,
                groupbuy: editData.groupbuy,
                limit: editData.limit,
                cheap: editData.cheap,
                price: editData.price,
                name: editData.name,
                description: editData.description,
                image: editData.image,
            });
            setImagePreview(editData.imagePreview || null);
        }
    }, [editData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            product_name: formData.name,
            price: Number(formData.price),
            local: formData.region,
            is_group_buy: formData.groupbuy === 'O' ? 'TRUE' : 'FALSE',
            product_grade: formData.cheap === 'O' ? 'B' : 'A',
            max_participants: Number(formData.limit),
            description: formData.description,
        };

        try {
            if (editData) {
                // 수정
                await axios.put(`/api/products/${editData.id}`, payload);
            } else {
                // 등록
                await axios.post('/api/products', payload);
            }
            setPopupType(editData ? 'edit' : 'register');
        } catch (error) {
            console.error("상품 등록/수정 실패", error);
            alert("저장 실패");
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
                        <select name="region" value={formData.region} onChange={handleChange}>
                            <option value="">지역</option>
                            {regionOptions.map((r) => (
                                <option key={r} value={r}>{LOCAL_TYPE_MAP[r] || r}</option>
                            ))}
                        </select>

                        <select name="groupbuy" value={formData.groupbuy} onChange={handleChange}>
                            <option value="">공동 구매</option>
                            {groupBuyOptions.map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>

                        <select name="limit" value={formData.limit} onChange={handleChange}>
                            <option value="">공구제한인원</option>
                            {Array.from({ length: 15 }, (_, i) => (
                                <option key={i + 1}>{i + 1}</option>
                            ))}
                        </select>

                        <select name="cheap" value={formData.cheap} onChange={handleChange}>
                            <option value="">알뜰상품</option>
                            {gradeBOptions.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        <input
                            type="number"
                            name="price"
                            placeholder="가격"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="upload-box">
                        <div className="image-upload">
                            <input type="file" id="fileUpload" onChange={handleFileUpload} hidden />
                            <label htmlFor="fileUpload" className="image-box">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="미리보기" />
                                ) : (
                                    <>
                                        <img src={require('./camera.png')} alt="카메라 아이콘" className="camera-icon" />
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

                    <textarea
                        name="description"
                        placeholder="상세 설명 내용 입력"
                        value={formData.description}
                        onChange={handleChange}
                        className="textarea-box"
                    />

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
