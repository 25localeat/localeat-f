/*
파일명: GroupBuyList.jsx
파일 설명: 로컬잇 공동구매 상품 모아보기 페이지
작성자: 김미현
기간: 2025-04-28 ~
*/

import React from 'react';
import { Link } from 'react-router-dom';
import './GroupBuyList.css'
import carrotImg from './carrot.png';
import TagBadge from '../../components/Tag/TagBadge';
import {getTagsByType} from '../../components/Tag/tags';
import ProductCard from "../../components/ProductCard/ProductCard";

const regionTags = getTagsByType('region');

/* 임시로. 나중에 데이터에서 가져올 것. */
const products = [
    {
        image: carrotImg,
        title: '국내산 세척당근',
        originalPrice: 2000,
        discountPrice: 1300,
        tags: ['강원', 'GOOD'],
    },
    {
        image: carrotImg,
        title: '국내산 세척당근',
        originalPrice: 2000,
        discountPrice: 1300,
        tags: ['강원', 'GOOD'],
    },
    {
        image: carrotImg,
        title: '국내산 세척당근',
        originalPrice: 2000,
        discountPrice: 1300,
        tags: ['강원', 'GOOD'],
    },
    {
        image: carrotImg,
        title: '국내산 세척당근',
        originalPrice: 2000,
        discountPrice: 1300,
        tags: ['강원', 'GOOD'],
    },
    {
        image: carrotImg,
        title: '국내산 세척당근',
        originalPrice: 2000,
        discountPrice: 1300,
        tags: ['강원', 'GOOD'],
    },
    {
        image: carrotImg,
        title: '국내산 세척당근',
        originalPrice: 2000,
        discountPrice: 1300,
        tags: ['강원', 'GOOD'],
    },
    {
        image: carrotImg,
        title: '국내산 세척당근',
        originalPrice: 2000,
        discountPrice: 1300,
        tags: ['강원', 'GOOD'],
    },
    {
        image: carrotImg,
        title: '국내산 세척당근',
        originalPrice: 2000,
        discountPrice: 1300,
        tags: ['강원', 'GOOD'],
    },
    // ... 총 8개 만들어줘야 함
];

const GroupBuyList = () => {
    return (
        <div className="container">
            <Link to="/groupBuy/view" style={{textDecoration: "none"}} >
            <p className="title">공동 구매</p>
            </Link>
            <div className="product-grid">
                {products.map((product, i) => (
                    <ProductCard key={i}{...product}/>
                ))}
            </div>
        </div>

        );
    };

export default GroupBuyList;