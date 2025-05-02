import React, { useState } from 'react';
import './TabInquiry.css';

const TabInquiry = ({ inquiries, user, setInquiries }) => {
    const sortedInquiries = [...inquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const [showForm, setShowForm] = useState(false);
    const [newInquiry, setNewInquiry] = useState({ category: '상품문의', content: '' });
    const [replyInput, setReplyInput] = useState({});

    const handleInputChange = (e) => {
        setNewInquiry({ ...newInquiry, [e.target.name]: e.target.value });
    };

    const handleCancel = () => {
        setShowForm(false);
        setNewInquiry({ category: '상품문의', content: '' });
    };

    const handleSubmit = () => {
        if (!newInquiry.content.trim()) return;
        const newItem = {
            inquiryId: Date.now(),
            user: { userId: user.userId },
            createdAt: new Date().toISOString(),
            category: newInquiry.category,
            content: newInquiry.content,
            answer: '',
        };
        setInquiries((prev) => [...prev, newItem]);
        setShowForm(false);
        setNewInquiry({ category: '상품문의', content: '' });
    };

    const toggleReplyInput = (id) => {
        setReplyInput((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleReplyChange = (e, id) => {
        setReplyInput((prev) => ({ ...prev, [id]: e.target.value }));
    };

    const submitReply = (id) => {
        if (!replyInput[id]?.trim()) return;
        setInquiries((prev) =>
            prev.map((inq) =>
                inq.inquiryId === id ? { ...inq, answer: replyInput[id] } : inq
            )
        );
        setReplyInput((prev) => ({ ...prev, [id]: false }));
    };

    return (
        <div>
            <h2 className="inquiry-heading">상품 문의</h2>

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
                                <button className="submit-button" onClick={handleSubmit}>등록</button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <ul className="inquiry-list">
                {sortedInquiries.map((inquiry) => (
                    <li key={inquiry.inquiryId} className="inquiry-item">
                        <div className="inquiry-meta">
              <span className="inquiry-writer">
                {inquiry.user.userId.slice(0, 3) + '*'.repeat(inquiry.user.userId.length - 3)}
              </span>
                            <span className="inquiry-date">
                {new Date(inquiry.createdAt).toLocaleString()}
              </span>
                        </div>
                        <div className="inquiry-content">
                            <span className="inquiry-category">[{inquiry.category}]</span> {inquiry.content}
                        </div>

                        {user.role === 'SELLER' && !inquiry.answer && (
                            replyInput[inquiry.inquiryId] !== false ? (
                                <div className="inquiry-form">
                  <textarea
                      rows="3"
                      value={replyInput[inquiry.inquiryId] || ''}
                      onChange={(e) => handleReplyChange(e, inquiry.inquiryId)}
                  ></textarea>
                                    <div className="form-actions">
                                        <button className="cancel-button" onClick={() => toggleReplyInput(inquiry.inquiryId)}>취소</button>
                                        <button className="submit-button" onClick={() => submitReply(inquiry.inquiryId)}>등록</button>
                                    </div>
                                </div>
                            ) : (
                                <button className="inquiry-write-button" onClick={() => toggleReplyInput(inquiry.inquiryId)}>답변 작성</button>
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
