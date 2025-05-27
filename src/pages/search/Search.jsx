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
                    const regionTag = getTagByCode(p.local); // ✅ 코드 기준 태그 가져오기

                    return {
                        id: p.id,
                        image: `/api/images/by-product/${p.id}`,
                        title: p.productName ?? '',
                        price: price,
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
                                {keyword && `“${keyword}” 검색 결과입니다.`}
                                {!keyword && tag === 'B' && 'B급 상품입니다.'}
                                {!keyword && tag === 'GROUP_BUY' && '공동구매 상품입니다.'}
                                {!keyword && tag && tag !== 'B' && tag !== 'GROUP_BUY' && `“${getRegionLabel(tag)}” 지역 상품 목록입니다.`}
                                {!keyword && !tag && '전체 상품 목록'}
                            </h2>

                            {/* 설명 텍스트 */}
                            {!loading && products.length === 0 ? (
                                <p>
                                    {keyword
                                        ? `“${keyword}”을(를) 찾을 수 없습니다. 다시 검색해주세요.`
                                        : '해당 조건에 맞는 상품이 없습니다.'}
                                </p>
                            ) : (
                                !keyword && tag === 'B' && (
                                    <p style={{ fontSize: '0.9rem', color: 'gray' }}>
                                        유통기한 임박 또는 외관상 품질이 다소 떨어질 수 있으나,<br />
                                        섭취 및 사용에는 전혀 문제가 없는 상품을 저렴한 가격에 제공합니다.
                                    </p>
                                )
                            )}
                            {!keyword && tag === 'GROUP_BUY' && (
                                <p style={{ fontSize: '0.9rem', color: 'gray' }}>
                                    공동구매는 다수의 소비자가 함께 참여하여<br />
                                    보다 저렴한 가격으로 상품을 구매할 수 있는 방식입니다.
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
