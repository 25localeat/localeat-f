/*
파일명: ReviewForm.jsx
파일 설명: 리뷰 작성 페이지
작성자: 김민하
기간: 2025-04-26 ~ 28
*/
import React, { useState } from 'react';
import './ReviewForm.css';

export default function ReviewForm() {
    // 폼 상태
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);

    // 테스트용 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('리뷰 제출 데이터:', { rating, content, files });
        alert('리뷰 제출 데이터가 콘솔에 찍혔습니다.');
        // 폼 초기화
        setRating(5);
        setContent('');
        setFiles([]);
    };

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files).slice(0, 4); // 최대 4장
        setFiles(selected);
    };

    return (
        <div className="review-form-page">
            <h1 className="review-form-page-title">리뷰 작성</h1>
            <form className="review-form" onSubmit={handleSubmit}>
                {/* 상품명, 등록일 (필요시 외부에서 props로 받을 수 있습니다) */}
                <div className="form-group">
                    <label>상품명</label>
                    <input type="text" value="테스트 상품명" disabled />
                </div>
                <div className="form-group">
                    <label>등록일</label>
                    <input type="text" value="2025-05-01" disabled />
                </div>

                {/* 평점 선택 */}
                <div className="form-group">
                    <label>평점</label>
                    <select
                        value={rating}
                        onChange={(e) => setRating(+e.target.value)}
                    >
                        {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>
                                {n}점
                            </option>
                        ))}
                    </select>
                </div>

                {/* 리뷰 내용 */}
                <div className="form-group">
                    <label>리뷰 내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="리뷰를 작성해주세요"
                        required
                    />
                </div>

                {/* 이미지 첨부 */}
                <div className="form-group">
                    <label>이미지 첨부 (최대 4장)</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                    />
                    {files.length > 0 && (
                        <div className="preview-images">
                            {files.map((file, i) => (
                                <img
                                    key={i}
                                    src={URL.createObjectURL(file)}
                                    alt={`preview ${i}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* 제출 버튼 */}
                <div className="form-buttons">
                    <button type="submit">리뷰 등록</button>
                </div>
            </form>
        </div>
    );
}
