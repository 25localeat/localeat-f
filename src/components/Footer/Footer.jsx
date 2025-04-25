/*
파일명 : Footer.jsx
파일설명 : 프로젝트 정보와 링크(깃허브, 구글 드라이브)를 포함하는 하단 컴포넌트
작성자 : 정여진
기간 : 2025-04-10.
*/
import React from 'react';
import './Footer.css';
import driveIcon from '../Footer/footer-googledrive-img.png';
import githubIcon from '../Footer/footer-github-img.png';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-links">
                <img src={driveIcon} alt="Google Drive" />
                <a
                    href="https://drive.google.com/drive/folders/1gbBIXI3fsIDZ--uiht3Hbi9AXMsngtyk?usp=drive_link"
                    target="_blank"
                    className="footer-url"
                    >구글드라이브
                </a>
                <img src={githubIcon} alt="GitHub" />
                <a
                    href="https://github.com/25localeat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-url"
                >
                    GitHub 저장소
                </a>
            </div>

            <div className="footer-description">
                2025 software development system (01) team project
            </div>
        </footer>
    );
};

export default Footer;
