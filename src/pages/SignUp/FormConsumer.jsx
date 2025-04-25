import React from 'react'
import './FormConsumer.css'

const FormConsumer = () => {
  return (
    <div className="container">
      <div className="sideBar"></div>
      <div className="mainForm">
        <form className="form">
          <label>
            아이디
            <input type="text" name="username" />
          </label>
          <label>
            비밀번호
            <input type="password" name="password" />
          </label>
          <label>
            비밀번호 확인
            <input type="password" name="confirmPassword" />
          </label>
          <label>
            이름
            <input type="text" name="name" />
          </label>
          <label>
            생년월일
            <input type="date" name="birthdate" />
          </label>
          <label>
            연락처
            <input type="tel" name="phone" />
          </label>
          <label>
            배송지 입력
            <select name="region">
              <option value="">지역 선택</option>
              <option>서울/경기/인천</option>
              <option>강원</option>
              <option>충청</option>
              <option>전북</option>
              <option>전남/광주</option>
              <option>대구/경북</option>
              <option>경남/부산/울산</option>
              <option>제주</option>
            </select>
          </label>
          <label>
            이메일 주소
            <input type="email" name="email" />
          </label>

          <div className="buttons">
            <button type="button" className="duplicateBtn">중복 확인</button>
            <button type="submit" className="submitBtn">회원가입</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormConsumer;