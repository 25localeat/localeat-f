/*
파일명: ViewGroupBuy.css
파일 설명: 로컬잇 공동구매 전체 보기 페이지
작성자: 김미현
기간: 2025-04-28 ~
*/

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './ViewGroupBuy.css'

const ViewGroupBuy = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const productId = searchParams.get('productId');
    const productName = searchParams.get('productName');
    const imageUrl = searchParams.get('imageUrl');
    const local = searchParams.get('local');
    const maxParticipants = searchParams.get('maxParticipants');
    const [groupBuyList, setGroupBuyList] = useState([]);

    useEffect(() => {
        const fetchGroupBuys = async () => {
            try {
                const res = await axios.get(`/groupBuy/list?productId=${productId}`);
                setGroupBuyList(res.data);
            } catch (err) {
                console.error('공동구매 리스트 불러오기 실패:', err);
            }
        };
        if (productId) fetchGroupBuys();
    }, [productId]);

    const handleDetailClick = (groupBuyId) => {
        navigate('/groupBuy/detail', {
            state: {
                groupBuyId,
                productId,
                productName,
                imageUrl,
                local,
                maxParticipants
            }
        });
    };

    const handleCreateClick = () => {
        navigate('/groupBuy/create', {
            state: {
                productId,
                productName,
                imageUrl,
                local,
                maxParticipants
            }
        });
    };

    const handleJoinClick = (groupBuyId) => {
        navigate('/groupBuy/join', {
            state: {
                groupBuyId,
                productId,
                productName,
                imageUrl,
                local,
                maxParticipants
            }
        });
    };

    return (
        <div className="vgb-container">
            <p className="vgb-title">공동 구매</p>
            <div className="vgb-box">
                <div className="vgb-header-section">
                    <div className="vgb-img-wrapper">
                        <img className="vgb-product-image" src={imageUrl} alt={productName} />
                    </div>
                    <div className="vgb-product-info">
                        <div className="vgb-top-row">
                            <p className="vgb-product-name">{productName}</p>
                            <button className="vgb-create-button" onClick={handleCreateClick}>공동구매 만들기</button>
                        </div>
                        <p className="vgb-guide">현재 상품에 대한 공동구매 진행 건은 다음과 같습니다.</p>
                    </div>
                </div>
                <hr className="vgb-divider" />
                <div className="vgb-list-wrapper">
                    {groupBuyList.map((item) => (
                        <div key={item.groupBuyId} className="vgb-list">
                            <p className="vgb-list-text" onClick={() => handleDetailClick(item.groupBuyId)}>
                                지역: {item.local} 상품명: {item.productName} 모집인원 {item.partiCount}/{item.maxParticipants}
                            </p>
                            <button className="vgb-join-button" onClick={() => handleJoinClick(item.groupBuyId)}>참여하기</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewGroupBuy;