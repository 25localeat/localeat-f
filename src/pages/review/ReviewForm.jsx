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
    const [productId, setProductId] = useState(null);
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUserId = storedUser.userId;


    // 상품명 조회
    useEffect(() => {
        axios.get(`/api/order-items/${orderItemId}`)
            .then((res) => {
                console.log("서버 응답:", res.data);
                setProductName(res.data.productName);
                setProductId(res.data.productId);
            })
            .catch(() => setProductName('상품명을 불러오지 못했습니다.'));
    }, [orderItemId]);

    // 이미지 업로드 핸들러
    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (images.length + selectedFiles.length > 4) {
            alert('이미지는 최대 4장까지 첨부할 수 있습니다.');
            return;
        }

        setImages([...images, ...selectedFiles]);
        setImagePreviews([...imagePreviews, ...selectedFiles.map(file => URL.createObjectURL(file))]);
    };

    // 등록 버튼
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('orderItemId', orderItemId);
        formData.append('productId', productId);
        formData.append('rating', rating);
        formData.append('content', content);
        formData.append('userId', currentUserId);

        images.forEach((img) => {
            formData.append('images', img);
        });

        try {
            await axios.post('/api/reviews', formData);
            alert("리뷰 등록이 완료되었습니다.");
            navigate('/mypage/buyer/review');
        } catch (err) {
            console.error(err);
            alert("리뷰 등록에 실패했습니다.");
        }
    };

    return (
        <div className="review-form">
            <h2>리뷰 작성하기</h2>

            <table className="review-table">
                <tbody>
                <tr>
                    <th>상품명</th>
                    <td><input type="text" value={productName || ''} readOnly /></td>
                </tr>
                <tr>
                    <th>등록일</th>
                    <td>{new Date().toISOString().slice(0, 10)}</td>
                </tr>
                <tr>
                    <th>평점</th>
                    <td className="stars">
                        {[1, 2, 3, 4, 5].map(n => (
                            <span key={n} onClick={() => setRating(n)} style={{ cursor: 'pointer', color: n <= rating ? 'gold' : 'gray' }}>★</span>
                        ))}
                    </td>
                </tr>
                <tr>
                    <th>내용</th>
                    <td><textarea value={content} onChange={e => setContent(e.target.value)} /></td>
                </tr>
                <tr>
                    <th>사진첨부</th>
                    <td>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                        <div className="image-preview">
                            {imagePreviews.map((src, i) => (
                                <img key={i} src={src} alt={`미리보기 ${i}`} className="preview-img" />
                            ))}
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>

            <button className="submit-btn" onClick={handleSubmit}>리뷰 등록하기</button>
        </div>
    );
};

export default ReviewForm;
