/*
파일명: FormSeller.jsx
파일 설명: 로컬잇 판매자 회원 가입 정보 입력 페이지
작성자: 김미현
기간: 2025-04-27 ~
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Popup from '../../components/Ui/Popup/Popup';
import './FormSeller.css';

const FormSeller = () => {
  const navigate = useNavigate();
  const [idCheckResult, setIdCheckResult] = useState(null);
  const [popupType, setPopupType] = useState(null);

  const [form, setForm] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    business_id: '',
    local: '지역 선택',
    address: '',
    email: ''
  });

  const closePopup = () => {
    setPopupType(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleIdCheck = async () => {
    if (!form.userId.trim()) {
      setPopupType('id-error')
      return;
    }

    try {
      const res = await axios.get(`/signUp/seller/check-id?userId=${form.userId}`);
      if (res.data === true) {
        setIdCheckResult(false);
        setPopupType('signUp-id-fail')
        return;
      } else {
        setIdCheckResult(true);
        setPopupType('signUp-id-success')
        return;
      }
    } catch (error) {
      console.error(error);
      setPopupType('signUp-id-error')
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setPopupType('signUp-password-error')
      return;
    }

    if (form.local === '지역 선택') {
      setPopupType('signUp-local-error')
      return;
    }

    const requestBody = {
      ...form,
      role: 'SELLER',
    };

    try {
      await axios.post('/signUp/seller/form', requestBody);
      navigate('/signUp/complete');
    } catch (error) {
      console.error(error);
      setPopupType('signUp-error')
    }
  };

  return (
    <div className="container">
      <p className="title">회원가입</p>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <th>아이디</th>
              <td>
                <input type="text" name="userId" value={form.userId} onChange={handleChange} placeholder="아이디를 입력하세요." />
                <button className="id-check-button" type="button" onClick={handleIdCheck}>중복 확인</button>
              </td>
            </tr>
            <tr>
              <th>비밀번호</th>
              <td>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="비밀번호를 입력하세요." />
              </td>
            </tr>
            <tr>
              <th>비밀번호 확인</th>
              <td>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="비밀번호를 다시 입력하세요." />
              </td>
            </tr>
            <tr>
              <th>사업자 명</th>
              <td>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="사업자 명을 입력하세요." />
              </td>
            </tr>
            <tr>
              <th>사업자 번호</th>
              <td>
                <input type="text" name="business_id" value={form.business_id} onChange={handleChange} placeholder="사업자 번호를 입력하세요." />
              </td>
            </tr>
            <tr>
              <th>연락처</th>
              <td>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="연락처를 입력하세요." />
              </td>
            </tr>
            <tr>
              <th>사업자 주소</th>
              <td>
                <select name="local" value={form.local} onChange={handleChange}>
                  <option>지역 선택</option>
                  <option>서울/경기/인천</option>
                  <option>강원</option>
                  <option>충청</option>
                  <option>전북</option>
                  <option>전남/광주</option>
                  <option>대구/경북</option>
                  <option>경남/부산/울산</option>
                  <option>제주</option>
                </select>
                <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="사업장 주소를 입력하세요." />
              </td>
            </tr>
            <tr>
              <th>이메일 주소</th>
              <td>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="이메일을 입력하세요." />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="submit-row">
                <button className="signUpButton" type="submit">가입하기</button>
        </div>
      </form>

      {popupType && (
        <Popup
          type={popupType}
            onConfirm={closePopup}
            onCancel={closePopup}
        />
      )}
    </div>
  );
};

export default FormSeller;
