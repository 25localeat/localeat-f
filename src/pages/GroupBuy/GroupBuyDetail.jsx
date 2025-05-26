import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './GroupBuyDetail.css';

const GroupBuyDetail = () => {
    const location = useLocation();
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
    const [remainingTime, setRemainingTime] = useState('');
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

    // 실시간 타이머 업데이트
    useEffect(() => {
        const updateRemainingTime = () => {
            if (!detail?.deadline) return;
            
            const now = Date.now();
            const deadline = new Date(detail.deadline).getTime();
            const diff = Math.max(0, Math.floor((deadline - now) / 1000));
            
            const hours = String(Math.floor(diff / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
            const seconds = String(diff % 60).padStart(2, '0');
            
            setRemainingTime(`${hours}:${minutes}:${seconds}`);
        };

        // 초기 업데이트
        updateRemainingTime();
        
        // 1초마다 업데이트
        const timer = setInterval(updateRemainingTime, 1000);
        
        // 컴포넌트 언마운트 시 타이머 정리
        return () => clearInterval(timer);
    }, [detail?.deadline]);

    if (!detail) {
        return <p>로딩 중…</p>;
    }

    return (
        <div className="dgb-container">
            <p className="dgb-title">공동 구매 상세 정보</p>
            <p className="dgb-sub">내가 참여한 공동 구매의 정보, 마감 시간 등을 확인해 보세요</p>
            <p className="dgb-time-guide">공동구매 성사까지 남은 시간 <span style={{color:'#03C75A', fontWeight:'bold'}}>{remainingTime}</span></p>
            <div className="dgb-groupBuy-box">
                <div className="dgb-header-section">
                    <div className="dgb-img-wrapper">
                        <img className="dgb-product-image" src={imageUrl || detail.imageUrl || '/placeholder.png'} alt={productName || detail.productName} />
                    </div>
                    <div className="dgb-product-info">
                        <div className="dgb-top-row">
                            <p className="dgb-product-name">{detail.productName}</p>
                        </div>
                        <p className="dgb-groupBuy-guide">{detail.description}</p>
                    </div>
                </div>
                <hr className="dgb-divider" />
                <div className="dgb-list-wrapper">
                    <p className="dgb-participants">
                        <span className="dgb-participants-label">참여 인원</span>
                        <span className="dgb-participants-count">( {detail.partiCount} / {detail.maxParticipants} )</span>
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
        </div>
    );
};

export default GroupBuyDetail;
