import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './GroupBuyDetail.css'

const GroupBuyDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 이전 페이지에서 넘겨준 값들
    const {
        groupBuyId,
        productId,
        productName,
        imageUrl,
        local,
        maxParticipants,
        description,
        deadline
    } = location.state || {};

    const [detail, setDetail] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8080/groupBuy/${groupBuyId}`,
                    { headers: { 'X-USER-ID': userId } }
                );
                setDetail(res.data);
            } catch (err) {
                console.error('상세 조회 실패', err);
                alert('상세 조회에 실패했습니다.');
            }
        };
        fetchDetail();
    }, [groupBuyId, userId]);

    if (!detail) {
        return <p>로딩 중…</p>;
    }

    return (
        <div className="dgb-container">
            <p className="dgb-title">공동 구매 상세 정보</p>
            <p className="dgb-sub">
                내가 참여한 공동 구매의 정보, 마감 시간 등을 확인해 보세요
            </p>
            <p className="dgb-time-guide">
                공동구매 성사까지 남은 시간 {detail.remainingTime}
            </p>

            <div className="dgb-groupBuy-box">
                <div className="dgb-header-section">
                    <div className="dgb-img-wrapper">
                        <img
                            className="qproduct-image"
                            src={imageUrl || detail.imageUrl || '/placeholder.png'}
                            alt={productName || detail.productName}
                        />
                    </div>
                    <div className="dgb-product-info">
                        <div className="dgb-top-row">
                            <p className="dgb-product-name">{detail.productName}</p>
                        </div>
                        <p className="dgb-groupBuy-description">
                            {detail.description}
                        </p>
                    </div>
                </div>

                <hr className="dgb-divider" />

                <div className="dgb-list-wrapper">
                    <p className="dgb-participants">참여인원</p>
                    <p className="dgb-count">
                        ( {detail.partiCount} / {detail.maxParticipants} )
                    </p>

                    {detail.participants.map((p) => (
                        <div key={p.consumerId} className="dgb-list">
                            <p className="dgb-list-text">
                                아이디: {p.consumerId} / 구매 수량: {p.quantity}개
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <button className="dgb-back-button" onClick={() => navigate(-1)}>
                뒤로가기
            </button>
        </div>
    );
};

export default GroupBuyDetail;
