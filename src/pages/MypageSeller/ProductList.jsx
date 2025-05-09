/*
파일명 : ProductList.jsx
파일설명 : 로컬잇 웹사이트의 판매자 마이페이지/상품목록 UI
작성자 : 김소망
기간 : 2025-04-24~
*/
import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './ProductList.css';
import Popup from '../../components/Ui/Popup/Popup';
import axios from "axios";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [popupType, setPopupType] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const editData = location.state?.editData || null;

    useEffect(() => {
        console.log("editData 확인:", editData);
    }, [editData]);

    const localTypeToLabel = {
        SGI: '서울/경기/인천',
        GANGWON: '강원',
        CHUNGCHEONG: '충청',
        JEONBUK: '전북',
        JNGJ: '전남/광주',
        DGGB: '대구/경북',
        GNBNUL: '경남/부산/울산',
        JEJU: '제주',
    };

    useEffect(() => {
        axios.get('/api/products')
            .then(res => {
                setProducts(res.data);
            })
            .catch(err => {
                console.error('상품 목록 불러오기 실패:', err);
            });
    }, []);

    const openDeletePopup = (id) => {
        setItemToDelete(id);
        setPopupType('delete');
    };

    const deleteProduct = async () => {
        console.log("삭제 요청 실행됨, 삭제할 ID:", itemToDelete);
        try {
            await axios.delete(`/api/products/${itemToDelete}`);
            const updated = products.filter(p => p.id !== itemToDelete); // 삭제 필터를 두고, 삭제된 상품을 제외한 새 배열로 갱신합니다.
            setProducts(updated);
            closePopup();
        } catch (err) {
            console.error('상품 삭제 실패:', err);
            alert('삭제에 실패했습니다.');
        }
    };

    const closePopup = () => {
        setPopupType(null);
        setItemToDelete(null);
    };

    const handleEdit = (product) => {
        navigate('/mypage/register', { state: { editData: product } });
    };

    useEffect(() => {
        console.log("editData 확인:", editData);
    }, []);

    return (
        <div className="mypage-wrapper">
            <div className="page-header">마이페이지</div>

            <div className="mypage-body">
                <div className="sidebar">
                    <ul>
                        <li className="active">상품 목록</li>
                        <li onClick={() => navigate('/mypage/orders')}>주문 관리</li>
                        <li onClick={() => navigate('/mypage/member-edit')}>회원 정보 수정</li>
                    </ul>
                </div>

                <div className="container">
                    <h2 className="section-title">상품 목록</h2>

                    <div className="section-header">
                        <button className="register-btn" onClick={() => navigate('/mypage/register')}>등록하기</button>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>상품이름</th>
                                <th>공동구매</th>
                                <th>알뜰상품</th>
                                <th>지역</th>
                                <th>가격</th>
                                <th>등록일</th>
                                <th>수정</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.productName}</td>
                                    <td>{item.isGroupBuy  ? 'O' : 'X'}</td>
                                    <td>{item.productGrade}</td>
                                    <td>{localTypeToLabel[item.local] || item.local}</td>
                                    <td>{item.price != null ? item.price.toLocaleString() + '원' : '가격 미정'}</td>
                                    <td>
                                        {item.createAt ? new Date(item.createAt).toLocaleDateString() : '등록일 없음'}
                                    </td>
                                    <td><button className="modify-btn" onClick={() => handleEdit(item)}>수정</button></td>
                                    <td><button className="delete-btn" onClick={() => openDeletePopup(item.id)}>삭제</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {popupType === 'delete' && (
                <Popup
                    type="delete"
                    onCancel={closePopup}
                    onConfirm={deleteProduct}
                />
            )}
        </div>
    );
}

export default ProductList;
