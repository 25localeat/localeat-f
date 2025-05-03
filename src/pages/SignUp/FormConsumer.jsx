/*
파일명: FormConsumer.jsx
파일 설명: 로컬잇 구매자 회원 가입 정보 입력 페이지
작성자: 김미현
기간: 2025-04-12 ~
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FormConsumer.css';

const FormConsumer = () => {
  const navigate = useNavigate();
  const [idCheckResult, setIdCheckResult] = useState(null);

  const [form, setForm] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
    name: '',
    birth: '',
    phone: '',
    email: '',
    address: '',
    local: '지역 선택',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleIdCheck = async () => {
    if (!form.userId.trim()) {
      alert("아이디를 입력하세요.");
      return;
    }

    try {
      const res = await axios.get(`/api/users/check-id?userId=${form.userId}`);
      if (res.data === true) {
        setIdCheckResult(false);
        alert("이미 사용 중인 아이디입니다.");
      } else {
        setIdCheckResult(true);
        alert("사용 가능한 아이디입니다.");
      }
    } catch (error) {
      console.error(error);
      alert("중복 확인 중 오류 발생");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (form.local === '지역 선택') {
      alert("지역을 선택해주세요.");
      return;
    }

    const requestBody = {
      ...form,
      role: 'CONSUMER',
    };

    try {
      await axios.post('/signUp/consumer/form', requestBody);
      navigate('/signUp/complete');
    } catch (error) {
      console.error(error);
      alert("회원가입 실패");
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
              <th>이름</th>
              <td>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="이름을 입력하세요." />
              </td>
            </tr>
            <tr>
              <th>생년월일</th>
              <td>
                <input type="text" name="birth" value={form.birth} onChange={handleChange} placeholder="YYYY-MM-DD" />
              </td>
            </tr>
            <tr>
              <th>연락처</th>
              <td>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="연락처를 입력하세요." />
              </td>
            </tr>
            <tr>
              <th>배송지 입력</th>
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
                <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="배송지를 입력하세요." />
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
    </div>
  );
};

export default FormConsumer;
