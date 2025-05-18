/* 
파일명 : WishlistManage.jsx
파일설명 : 로컬잇 웹사이트의 구매자 마이페이지/찜관리 UI
작성자 : 김소망
기간 : 2025-04-25~
*/
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WishlistManage.css';
import Popup from '../../components/Ui/Popup/Popup';
import axios from 'axios';

const WishlistManage = () => {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [popupType, setPopupType] = useState(null);
    const [checkedItems, setCheckedItems] = useState([]);


    // 수정 : 정여진
    /**
     * 현재 사용자의 찜 목록만 골라서 화면에 보여주도록 초기 설정을 하는 함수
     */
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        axios.get(`/api/wish`, {
            params: { userId: user.userId }
        })
            .then(res => {
                setWishlist(res.data); // 서버에서 받은 찜 목록 배열
            })
            .catch(err => {
                console.error("찜 목록 불러오기 실패:", err);
                setWishlist([]);
            });
    }, []);

    const toggleCheck = (index) => {
        setCheckedItems(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const confirmDelete = (index) => {
        if (checkedItems.length > 0) {
            setPopupType('delete');
        }
    };

    // 찜 지우기.
    const deleteItems = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        const itemsToDelete = checkedItems.map(idx => wishlist[idx]);

        try {
            // 백엔드에 삭제 요청 (병렬 처리)
            await Promise.all(
                itemsToDelete.map(item =>
                    axios.delete('/api/wish', {
                        params: {
                            userId: user.userId,
                            productId: item.id // ← productId
                        }
                    })
                )
            );

            // 상태에서 삭제한 항목 제거
            const updated = wishlist.filter((_, idx) => !checkedItems.includes(idx));
            setWishlist(updated);
            setCheckedItems([]);
            setPopupType(null);
        } catch (err) {
            console.error('찜 삭제 실패:', err);
            alert('찜 삭제 중 오류가 발생했습니다.');
        }
    };


    const closePopup = () => {
        setPopupType(null);
    };

    return (
        <div className="mypage-wrapper">
            <div className="page-header">마이페이지</div>

            <div className="mypage-body">
                <div className="sidebar">
                    <ul>
                        <li onClick={() => navigate('/mypage/buyer/orders')}>주문 내역</li>
                        <li onClick={() => navigate('/mypage/buyer/review')}>리뷰 관리</li>
                        <li onClick={() => navigate('/mypage/buyer/subscribe')}>구독 관리</li>
                        <li className="active">찜 관리</li>
                        <li onClick={() => navigate('/mypage/buyer/groupBuy')}>공동구매 현황</li>
                        <li onClick={() => navigate('/mypage/buyer/member-edit')}>회원 정보 수정</li>
                    </ul>
                </div>

                <div className="container">
                    <h2 className="section-title">찜 관리</h2>
                    <button
                        className="delete-btn"
                        onClick={confirmDelete}
                        disabled={checkedItems.length === 0}
                    >
                        삭제
                    </button>
                    {wishlist.length === 0 ? (
                        <div className="empty-message">찜한 상품이 없습니다.</div>
                    ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>상품이름</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wishlist.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.productName}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={checkedItems.includes(index)}
                                            onChange={() => toggleCheck(index)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                        )}
                </div>
            </div>

            {popupType && (
                <Popup
                    type="delete"
                    onConfirm={deleteItems}
                    onCancel={closePopup}
                />
            )}
        </div>
    );
};

export default WishlistManage;
