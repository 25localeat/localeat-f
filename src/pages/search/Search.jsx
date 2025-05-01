/*
파일명 : Search.jsx
파일설명 : 검색 list를 보여주는 view 파일입니다.
작성자 : 정여진
기간 : 2025-04-26.
*/

import React from 'react';
import './Search.css';
import TagBadge from '../../components/Tag/TagBadge';
import { getTagsByType } from '../../components/Tag/tags';
import carrotImg from '../home/carrot.png';
import ProductCard from '../../components/ProductCard/ProductCard';

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

const SearchResult = () => {
    const regionTags = getTagsByType('region');

        return (
            <div className="search-result-wrapper">
                <div className="search-banner-placeholder"></div>

                <div className="search-region-tags-wrapper">
                    <div className="search-region-tags">
                        {regionTags.map((tag, index) => (
                            <TagBadge key={index} label={tag.label} bg={tag.bg} color={tag.color} />
                        ))}
                    </div>
                </div>

                <div className="search-product-grid">
                    {products.map((product, i) => (
                        <ProductCard key={i} {...product} /> // ✅ 당근 이미지 그대로 출력
                    ))}
                </div>
            </div>
        );
    };


    export default SearchResult;
