/*
파일명: ReviewForm.jsx
파일 설명: 리뷰 작성 페이지
작성자: 김민하
기간: 2025-04-26 ~ 28
*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewForm.css';
import { useNavigate, useParams } from 'react-router-dom';

const ReviewForm = () => {
    const { orderItemId } = useParams();
    const [productName, setProductName] = useState('');
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const navigate = useNavigate();

    // 상품명 조회
    useEffect(() => {
        axios.get(`/orders/item/${orderItemId}`)
            .then((res) => setProductName(res.data.productName))
            .catch(() => setProductName('상품명을 불러오지 못했습니다.'));
    }, [orderItemId]);

    // 이미지 업로드 핸들러
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(file => URL.createObjectURL(file));
        setImages(files);
        setImagePreviews(previews);
    };

    // 등록 버튼
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('orderItemId', orderItemId);
        formData.append('rating', rating);
        formData.append('content', content);
        formData.append('userId', 1); // 임시 userId

        images.forEach((img, i) => {
            formData.append('images', img);
        });

        try {
            await axios.post('/reviews', formData);
            alert("리뷰 등록이 완료되었습니다.");
            navigate('/mypage/buyer/review');
        } catch (err) {
            alert("리뷰 등록에 실패했습니다.");
        }
    };

    return (
        <div className="review-form">
            <h2>리뷰 작성하기</h2>

            <div className="form-table">
                <div className="row">
                    <div className="label">상품명</div>
                    <div><input type="text" value={productName} readOnly /></div>
                </div>

                <div className="row">
                    <div className="label">등록일</div>
                    <div className="review-date">{new Date().toISOString().slice(0, 10)}</div>
                </div>

                <div className="row">
                    <div className="label">평점</div>
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map(n => (
                            <span key={n} onClick={() => setRating(n)} style={{ cursor: 'pointer', color: n <= rating ? 'gold' : 'gray' }}>★</span>
                        ))}
                    </div>
                </div>

                <div className="row">
                    <div className="label">내용</div>
                    <div className="content">
                    <textarea placeholder="상세리뷰를 작성해주세요" value={content} onChange={e => setContent(e.target.value)} />
                    </div>
                </div>

                <div className="row photo-row">
                    <div className="label">사진첨부</div>
                    <div className="file-upload-wrapper">
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                        <div className="image-preview">
                            {imagePreviews.map((src, i) => (
                                <img key={i} src={src} alt={`미리보기 ${i}`} className="preview-img" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <button className="submit-btn" onClick={handleSubmit}>리뷰 등록하기</button>
        </div>
    );
};

export default ReviewForm;
