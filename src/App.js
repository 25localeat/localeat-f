import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import Home from "./pages/home/Home";
import CartGeneral from "./pages/cart/CartGeneral";
import CartSubscribe from "./pages/cart/CartSubscribe";
import CartGroupBuy from "./pages/cart/CartGroupBuy";
import ProductList from './pages/MypageSeller/ProductList';
import ProductRegister from './pages/MypageSeller/ProductRegister';
import OrderManagement from './pages/MypageSeller/OrderManagement';
import MemberEdit from './pages/MypageSeller/MemberEdit';
import BuyerOrderHistory from './pages/MypageBuyer/BuyerOrderHistory';
import BuyerReviewManage from './pages/MypageBuyer/BuyerReviewManage';
import SubscribeManage from './pages/MypageBuyer/SubscribeManage';
import WishlistManage from './pages/MypageBuyer/WishlistManage';
import GroupBuyStatus from './pages/MypageBuyer/GroupBuyStatus';
import BuyerMemberEdit from './pages/MypageBuyer/BuyerMemberEdit';
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Login from './pages/Login/Login'
import Agreement from './pages/SignUp/Agreement'
import FormConsumer from './pages/SignUp/FormConsumer'

function App() {
    return (
        <Router>
            <Navbar />
            <main style={{ paddingTop: '120px' }}>
                {/* 홈 화면 내용 들어가는 부분 */}
                <>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/cart" element={<CartGeneral />} />
                        <Route path="/cart-subscribe" element={<CartSubscribe />} />
                        <Route path="/cart-groupbuy" element={<CartGroupBuy />} />
                        <Route path="/SellerMypage" element={<ProductList />} />
                        <Route path="/mypage/register" element={<ProductRegister />} />
                        <Route path="/mypage/orders" element={<OrderManagement />} />
                        <Route path="/mypage/member-edit" element={<MemberEdit />} />
                        <Route path="/mypage/buyer/orders" element={<BuyerOrderHistory />} />
                        <Route path="/mypage/buyer/review" element={<BuyerReviewManage />} />
                        <Route path="/mypage/buyer/subscribe" element={<SubscribeManage />} />
                        <Route path="/mypage/buyer/wish" element={<WishlistManage />} />
                        <Route path="/mypage/buyer/groupBuy" element={<GroupBuyStatus />} />
                        <Route path="/mypage/buyer/member-edit" element={<BuyerMemberEdit />} />
                    </Routes>
                </>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
