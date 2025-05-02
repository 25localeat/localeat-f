import React from 'react';
import './TabReview.css';

const TabReview = ({ reviews, sortBy, setSortBy }) => {
    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortBy === 'latest') {
            return b.createdAt.localeCompare(a.createdAt);
        } else if (sortBy === 'rating') {
            return b.rating - a.rating;
        }
        return 0;
    });

    const averageRating = reviews.length
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div>
            <h2 className="review-heading">상품 리뷰</h2>

            <div className="review-top-container">
                <div className="review-left">
                    <div className="average-rating-large">{averageRating}</div>
                    <div className="stars-large">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={`star ${averageRating >= star ? 'filled' : ''}`}>★</span>
                        ))}
                    </div>
                </div>

                <div className="review-right">
                    {[5, 4, 3, 2, 1].map((score) => {
                        const count = reviews.filter((r) => r.rating === score).length;
                        const percentage = ((count / reviews.length) * 100).toFixed(1);
                        return (
                            <div className="dist-row" key={score}>
                                <div className="dist-label">{score}점</div>
                                <div className="dist-bar">
                                    <div className="dist-fill" style={{ width: `${percentage}%` }}></div>
                                </div>
                                <div className="dist-count">{count}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="review-header">
                <div className="total-count">총 {reviews.length}개 리뷰</div>
                <div className="sort-options">
                    <button
                        className={sortBy === 'latest' ? 'active' : ''}
                        onClick={() => setSortBy('latest')}
                    >최신순</button>
                    <span style={{ color: '#ccc' }}>|</span>
                    <button
                        className={sortBy === 'rating' ? 'active' : ''}
                        onClick={() => setSortBy('rating')}
                    >별점순</button>
                </div>
            </div>

            <ul className="review-list">
                {sortedReviews.map((review) => (
                    <li key={review.reviewId} className="review-item">
                        <div className="review-top">
                            <div className="author-info">
                                <div className="author-meta">
                                    <span className="author-id">
                                        {review.user.userId.slice(0, 3) + '*'.repeat(review.user.userId.length - 3)}
                                    </span>
                                    <span className="date">
                                        {new Date(review.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <span key={s} className={`star-small ${review.rating >= s ? 'filled' : ''}`}>★</span>
                            ))}
                        </div>
                        {review.images.length > 0 && (
                            <div className="review-images">
                                {review.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`review-${review.reviewId}-img-${idx}`}
                                    />
                                ))}
                            </div>
                        )}
                        <div className="review-text">{review.reviewContent}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TabReview;
