/*
파일명: FormSeller.jsx
파일 설명: 로컬잇 판매자 회원 가입 정보 입력 페이지
작성자: 김미현
기간: 2025-04-27 ~
*/

import React from 'react';
import { Link } from 'react-router-dom';
import './FormSeller.css';

const FormSeller = () => {
  return (
    <div className="container">
      <p className="title">회원가입</p>
      <form>
        <table>
          <tbody>
            <tr>
              <th>아이디</th>
              <td>
                <input type="text" placeholder="아이디를 입력하세요." />
                <button className="id-check-button">중복 확인</button>
              </td>
            </tr>
            <tr>
              <th>비밀번호</th>
              <td>
                <input type="password" placeholder="비밀번호를 입력하세요." />
              </td>
            </tr>
            <tr>
              <th>비밀번호 확인</th>
              <td>
                <input type="password" placeholder="비밀번호를 다시 입력하세요." />
              </td>
            </tr>
            <tr>
              <th>사업자 명</th>
              <td>
                <input type="text" placeholder="사업자 명을 입력하세요." />
              </td>
            </tr>
            <tr>
              <th>사업자 번호</th>
              <td>
                <input type="text" placeholder="사업자 번호를 입력하세요." />
              </td>
            </tr>
            <tr>
              <th>연락처</th>
              <td>
                <input type="text" placeholder="연락처를 입력하세요." />
              </td>
            </tr>
            <tr>
              <th>사업자 주소</th>
              <td>
                <select>
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
                <input type="text" placeholder="사업장 주소를 입력하세요." />
              </td>
            </tr>
            <tr>
              <th>이메일 주소</th>
              <td>
                <input type="email" placeholder="이메일을 입력하세요." />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="submit-row">
            <Link to="/signUp/complete">
                <button className="signUpButton" type="submit">가입하기</button>
            </Link>
        </div>
      </form>
    </div>
  );
};

export default FormSeller;
