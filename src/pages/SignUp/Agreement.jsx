import React from 'react';
import './Agreement.css'

const Agreement = () => {
    return (
            <div className="container">
                <div className="box">
                    <div className="overlay">
                        <p className="signUp-title">회원가입</p>

                        <div className="agreement-wrapper">
                            <p className="agreement-ment">약관동의</p>
                        </div>

                        <div className="description-content">
                            <p>
                                약관동의 글씨 크기는 이 정도 어떠신가요?<br />
                                약관 내용은 한 번 찾아보거나 아니면 이렇게 제 뻘소리로 채워 보겠습니다^^...<br />
                                어느 정도 이런 방식이다 라고만 이해해주세요~ <br />
                                더이상 할 말 없음 이슈 <br />
                                일단 텍스트를 채워 보겠습니다.<br />
                                ab~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~cd~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                            </p>
                        </div>
                        <div className="checkbox-container">
                            <input type="checkbox" id="terms" />
                            <label htmlFor="terms">이용약관에 동의하시겠습니까?</label>
                        </div>
                        <button className="agree-button">동의하고 가입하기</button>
                    </div>
                </div>
            </div>

    );
};

export default Agreement