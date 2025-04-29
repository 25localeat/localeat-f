import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import Home from "./pages/home/Home";
import Search from "./pages/search/Search";
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
import SelectType from './pages/SignUp/SelectType'
import FormConsumer from './pages/SignUp/FormConsumer'
import FormSeller from './pages/SignUp/FormSeller'
import Complete from './pages/SignUp/Complete'
import ViewGroupBuy from './pages/GroupBuy/ViewGroupBuy'
import CreateGroupBuy from './pages/GroupBuy/CreateGroupBuy'
import JoinGroupBuy from './pages/GroupBuy/JoinGroupBuy'
import GroupBuyDetail from './pages/GroupBuy/GroupBuyDetail'
import GroupBuyList from './pages/GroupBuy/GroupBuyList'

function App() {
    return (
        <Router>
            <Navbar />
            <main style={{ paddingTop: '120px' }}>
                {/* 홈 화면 내용 들어가는 부분 */}
                <>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<Search/>} />

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
                        <Route path="/login" element={<Login />} />
                        <Route path="/signUp" element={<Agreement />} />
                        <Route path="/signUp/selectType" element={<SelectType />} />
                        <Route path="/signUp/consumer/form" element={<FormConsumer />} />
                        <Route path="/signUp/seller/form" element={<FormSeller />} />
                        <Route path="/signUp/complete" element={<Complete />} />
                        <Route path="/groupBuy" element={<GroupBuyList />} />
                        <Route path="/groupBuy/view" element={<ViewGroupBuy />} />
                        <Route path="/groupBuy/create" element={<CreateGroupBuy />} />
                        <Route path="/groupBuy/join" element={<JoinGroupBuy />} />
                        <Route path="/groupBuy/detail" element={<GroupBuyDetail />} />
                    </Routes>
                </>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
