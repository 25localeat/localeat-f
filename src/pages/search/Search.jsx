/*
파일명 : Search.jsx
파일설명 : 검색 list를 보여주는 view 파일입니다.
작성자 : 정여진
기간 : 2025-04-26.
*/

import React, { useEffect, useState } from 'react';
import './Search.css';
import TagBadge from '../../components/Tag/TagBadge';
import { getTagsByType, getTagByCode } from '../../components/Tag/tags';
import ProductCard from '../../components/ProductCard/ProductCard';
import axios from '../../components/api/axios';
import { useSearchParams } from 'react-router-dom';
import {ROUTES} from "../../components/routes";

import { useNavigate } from "react-router-dom";

const Search = () => {
    const regionTags = getTagsByType('region');
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword');
    const tag = searchParams.get('tag');
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    const getRegionLabel = (code) => {
        const tagObj = regionTags.find(t => t.code === code);
        return tagObj ? tagObj.label : code;
    };

    const handleTagClick = (tagCode) => {
        navigate(`${ROUTES.SEARCH}?tag=${tagCode}`);
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`/api/products/search/filter`, {
                    params: { keyword, tag }
                });

                console.log("✅ 받아온 상품 리스트:", res.data);

                const mapped = res.data.map(p => {
                    const price = typeof p.price === 'number' ? p.price : 0;
                    const rate = typeof p.gradeDiscountRate === 'number' ? p.gradeDiscountRate : 0;

                    const regionTag = getTagByCode(p.local); // ✅ 코드 기준 태그 가져오기

                    return {
                        id: p.id,
                        image: `/api/images/by-product/${p.id}`,
                        title: p.productName ?? '',
                        originalPrice: price,
                        discountPrice: Math.floor(price * (1 - rate)),
                        tags: [regionTag] // ✅ TagBadge와 100% 호환
                    };
                });

                setProducts(mapped);
            } catch (error) {
                console.error('❌ 상품 검색 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword, tag]);

    return (
        <div className="search-result-wrapper">
            {loading ? (
                <p style={{ textAlign: 'center', padding: '20px' }}>검색 중입니다...</p>
            ) : (
                <>
                    <div className="search-banner-placeholder">
                        <div className="search-message">
                            <h2>
                                {keyword
                                    ? `“${keyword}” 검색 결과입니다.`
                                    : tag
                                        ? `“${getRegionLabel(tag)}” 지역 상품 목록입니다.`
                                        : '전체 상품 목록'}
                            </h2>
                            {!loading && products.length === 0 && (
                                <p>
                                    {keyword
                                        ? `“${keyword}”을(를) 찾을 수 없습니다. 다시 검색해주세요.`
                                        : '해당 지역의 상품이 없습니다.'}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="region-tags-wrapper">
                        <div className="region-tags">
                            {regionTags.map((tag, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleTagClick(tag.code)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <TagBadge label={tag.label} bg={tag.bg} color={tag.color} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {products.length > 0 ? (
                        <div className="search-product-grid">
                            {products.map((product, i) => (
                                <ProductCard key={i} {...product} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ minHeight: '300px' }} />
                    )}
                </>
            )}
        </div>
    );
};

export default Search;
