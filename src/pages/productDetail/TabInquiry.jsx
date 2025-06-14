import React, { useState } from 'react';
import './TabInquiry.css';
import axios from "axios";

const TabInquiry = ({ inquiries, user, setInquiries, productId }) => {

    const categoryToEnum = (label) => {
        switch (label) {
            case '상품문의': return 'PRODUCT';
            case '배송문의': return 'DELIVERY';
            case '공동구매문의': return 'GROUP';
            default: return 'PRODUCT';
        }
    };

    const translateCategory = (category) => {
        switch (category) {
            case 'PRODUCT': return '상품문의';
            case 'DELIVERY': return '배송문의';
            case 'GROUP': return '공동구매문의';
            default: return category;
        }
    };

    const [showForm, setShowForm] = useState(false);
    const [newInquiry, setNewInquiry] = useState({ category: '상품문의', content: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [replyVisible, setReplyVisible] = useState({});
    const [replyInput, setReplyInput] = useState({});

    const [selectedCategory, setSelectedCategory] = useState('전체');

    const sortedInquiries = [...inquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const filteredInquiries = selectedCategory === '전체'
        ? sortedInquiries
        : sortedInquiries.filter(inq => translateCategory(inq.category) === selectedCategory);

    const handleInputChange = (e) => {
        setNewInquiry({ ...newInquiry, [e.target.name]: e.target.value });
    };

    const handleCancel = () => {
        setShowForm(false);
        setNewInquiry({ category: '상품문의', content: '' });
    };

    const handleSubmit = async () => {
        if (isSubmitting || !newInquiry.content.trim()) return;

        setIsSubmitting(true);
        const payload = {
            productId: productId,
            userId: user?.userId,
            category: categoryToEnum(newInquiry.category),
            content: newInquiry.content
        };

        try {
            const res = await axios.post('/api/inquiries', payload);
            setInquiries((prev) => [...prev, res.data]);
            setShowForm(false);
            setNewInquiry({ category: '상품문의', content: '' });
        }  catch (err) {
            console.error("문의 등록 실패:", err.response?.data || err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleReplyInput = (id) => {
        setReplyVisible((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleReplyChange = (e, id) => {
        setReplyInput((prev) => ({ ...prev, [id]: e.target.value }));
    };

    const submitReply = async (id) => {
        if (!replyInput[id]?.trim()) return;

        try {
            const res = await axios.patch(`/api/inquiries/${id}/answer`, replyInput[id], {
                params: { sellerId: user.userId },
                headers: { 'Content-Type': 'text/plain' }
            });

            setInquiries((prev) =>
                prev.map((inq) =>
                    inq.id === id ? res.data : inq
                )
            );
            setReplyVisible((prev) => ({ ...prev, [id]: false }));
            setReplyInput((prev) => ({ ...prev, [id]: '' }));
        } catch (err) {
            console.error("답변 등록 실패:", err);
        }
    };

    return (
        <div>
            <h2 className="inquiry-heading">상품 문의</h2>
            {/* 카테고리 필터 */}
            <div className="category-filter">
                <label>
                    카테고리 필터 :
                    <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                        <option value="전체">전체</option>
                        <option value="상품문의">상품문의</option>
                        <option value="배송문의">배송문의</option>
                        <option value="공동구매문의">공동구매문의</option>
                    </select>
                </label>
            </div>

            {user.role === 'CONSUMER' && user.isLoggedIn && (
                <>
                    {!showForm ? (
                        <button className="inquiry-write-button" onClick={() => setShowForm(true)}>문의 작성하기</button>
                    ) : (
                        <div className="inquiry-form">
                            <label>
                                문의 유형
                                <select name="category" value={newInquiry.category} onChange={handleInputChange}>
                                    <option value="상품문의">상품문의</option>
                                    <option value="배송문의">배송문의</option>
                                    <option value="공동구매문의">공동구매문의</option>
                                </select>
                            </label>
                            <label>
                                내용
                                <textarea
                                    name="content"
                                    rows="4"
                                    value={newInquiry.content}
                                    onChange={handleInputChange}
                                ></textarea>
                            </label>
                            <div className="form-actions">
                                <button className="cancel-button" onClick={handleCancel}>취소</button>
                                <button className="submit-button" onClick={handleSubmit} disabled={isSubmitting}>등록</button>

                            </div>
                        </div>
                    )}
                </>
            )}

            <ul className="inquiry-list">
                {filteredInquiries.map((inquiry) => (
                    <li key={inquiry.id} className="inquiry-item">
                        <div className="inquiry-meta">
                            <span className="inquiry-writer">
                                {inquiry.userId?.length > 3
                                    ? inquiry.userId.slice(0, 3) + '*'.repeat(inquiry.userId.length - 3)
                                    : inquiry.userId || '알 수 없음'}
                            </span>
                            <span className="inquiry-date">
                                {new Date(inquiry.createdAt).toLocaleString()}
                            </span>
                        </div>
                        <div className="inquiry-content">
                            <span className="inquiry-category">[{translateCategory(inquiry.category)}]</span> {inquiry.content}
                        </div>

                        {/* 판매자만 답변 가능 */}
                        {user.role === 'SELLER' && !inquiry.answer && (
                            replyVisible[inquiry.id] ? (
                                <div className="inquiry-form">
                                    <textarea
                                        rows="3"
                                        value={replyInput[inquiry.id] || ''}
                                        onChange={(e) => handleReplyChange(e, inquiry.id)}
                                    ></textarea>
                                    <div className="form-actions">
                                        <button className="cancel-button" onClick={() => toggleReplyInput(inquiry.id)}>취소</button>
                                        <button className="submit-button" onClick={() => submitReply(inquiry.id)}>등록</button>
                                    </div>
                                </div>
                            ) : (
                                <button className="inquiry-write-button" onClick={() => toggleReplyInput(inquiry.id)}>답변 작성</button>
                            )
                        )}

                        {inquiry.answer && (
                            <div className="inquiry-answer">
                                <strong>답변:</strong> {inquiry.answer}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TabInquiry;
