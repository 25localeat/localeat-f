/*
파일명 : Home.jsx
파일설명 : 로컬잇 웹사이트의 메인(홈) 화면 UI
작성자 : 정여진
기간 : 2025-04-09.~2025.04.14.
*/

import React, { useEffect, useState } from 'react';
import './Home.css';
import TagBadge from '../../components/Tag/TagBadge';
import { getTagsByType, getTagByCode } from '../../components/Tag/tags';
import bannerImage from './home-banner-image.png';
import carrotImg from './carrot.png';
import ProductCard from "../../components/ProductCard/ProductCard";
import FloatingButton from "./FloatingButton";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../components/routes";
import axios from 'axios';

const Home = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const regionTags = getTagsByType('region');
    const itemsPerPage = 8;

    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`/api/products/latest?page=${currentPage - 1}&size=${itemsPerPage}`);
            const data = (response.data.content || []).map(p => {
                const regionTag = getTagByCode(p.local);
                return {
                    id: p.id,
                    image: `/api/images/by-product/${p.id}`,
                    title: p.productName ?? '',
                    price: p.price,
                    tags: [regionTag]
                };
            });
            setProducts(data);
            setTotalPages(Math.ceil((response.data.totalElements || 0) / itemsPerPage));
        } catch (err) {
            console.error('최신 상품 불러오기 실패', err);
        }
    };

    const handleTagClick = (tagCode) => {
        const code = typeof tagCode === 'string' ? tagCode : String(tagCode.code || tagCode.name || '');
        navigate(`${ROUTES.SEARCH}?tag=${encodeURIComponent(code)}`);
        window.scrollTo(0, 0);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    return (
        <div className="banner-container">
            <img
                className="banner-image"
                src={bannerImage}
                alt="배너"
            />

            <FloatingButton onClick={handleTagClick} />

            <div className="region-tags-wrapper">
                <div className="region-tags">
                    {regionTags.map((tag, index) => (
                        <div
                            key={index}
                            onClick={() => handleTagClick(String(tag.code))}
                            style={{ cursor: 'pointer' }}
                        >
                            <TagBadge label={tag.label} bg={tag.bg} color={tag.color} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="product-grid">
                {products.map((product, i) => (
                    <ProductCard key={i} {...product}/>
                ))}
            </div>

            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                        key={pageNum}
                        className={`page-button ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                    >
                        {pageNum}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Home;
