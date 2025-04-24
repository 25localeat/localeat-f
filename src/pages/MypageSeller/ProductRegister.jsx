/*
파일명 : ProductRegister.jsx
파일설명 : 로컬잇 웹사이트의 판매자 마이페이지/상품등록록 UI
작성자 : 김소망
기간 : 2025-04-24~
*/
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProductRegister.css';
import Popup from '../../components/Ui/Popup/Popup';

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

    const [imagePreview, setImagePreview] = useState(null);
    const [popupType, setPopupType] = useState(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();

        const newProduct = {
            ...formData,
            id: editData ? editData.id : Date.now(),
            imagePreview,
        };

        const existing = JSON.parse(localStorage.getItem("products")) || [];

        let updated;
        if (editData) {
            updated = existing.map(p => p.id === editData.id ? newProduct : p);
        } else {
            updated = [newProduct, ...existing];
        }

        localStorage.setItem("products", JSON.stringify(updated));
        setPopupType(editData ? 'edit' : 'register');
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
                            <option>서울/경기/인천</option>
                            <option>강원</option>
                            <option>충청</option>
                            <option>전북</option>
                            <option>전남/광주</option>
                            <option>대구/경북</option>
                            <option>경남/부산/울산</option>
                            <option>제주</option>
                        </select>

                        <select name="groupbuy" value={formData.groupbuy} onChange={handleChange}>
                            <option value="">공동 구매</option>
                            <option>O</option>
                            <option>X</option>
                        </select>

                        <select name="limit" value={formData.limit} onChange={handleChange}>
                            <option value="">공구제한인원</option>
                            {Array.from({ length: 15 }, (_, i) => (
                                <option key={i + 1}>{i + 1}</option>
                            ))}
                        </select>

                        <select name="cheap" value={formData.cheap} onChange={handleChange}>
                            <option value="">알뜰상품</option>
                            <option>O</option>
                            <option>X</option>
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
