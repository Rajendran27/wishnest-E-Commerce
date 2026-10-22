import "./App.css";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import RootRouter from "./Components/Navigation/RootRouter";
import Login from "./Components/LoginAuthentication/Login";
import Register from "./Components/LoginAuthentication/Register";
import ForgetPassword from "./Components/LoginAuthentication/ForgetPassword";
import User from "./Components/User/User";
import Home from "./Components/Pages/Home";
import AddProdcuts from "./Components/Administration/AddProdcuts";
import Mobile from "./Components/ProductsDisplayPages/Mobile";
import Cart from "./Components/Cart & favorite/Cart";
import Favorite from "./Components/Cart & favorite/Favorite";
import Fashion from "./Components/ProductsDisplayPages/Fashion";
import Electronics from "./Components/ProductsDisplayPages/Electronics";
import Beauty from "./Components/ProductsDisplayPages/Beauty";
import Kitchen from "./Components/ProductsDisplayPages/Kitchen";
import SportsAndGames from "./Components/ProductsDisplayPages/SportsAndGames";
import Update from "./Components/Administration/Update";
import BuyNow from "./Components/BuyNow/BuyNow";
import Error from "./Components/404-Error/Error";
import Search from "./Components/Navigation/Search";
import ProductView from "./Components/ViewPage/ProductView";
import PaymentSuccess from "./Components/BuyNow/PaymentSuccess";
import ViewOrder from "./Components/MyOrder/ViewOrder";
import Furniture from "./Components/ProductsDisplayPages/Furniture";
import Toys from "./Components/ProductsDisplayPages/Toys";
import AdminSellerRegister from "./Components/LoginAuthentication/AdminSellerRegister";
import MyOrders from "./Components/MyOrder/MyOrders";
import AddressForm from "./Components/BuyNow/Address";
import MyProfile from "./Components/Profile/MyProfile";


function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootRouter />}>
        <Route path="/search" element={<Search />} />
        <Route index element={<Home />} />
        <Route path="Login" element={<Login />} />
        <Route path="Register" element={<Register />} />
        <Route path="seller-register" element={<AdminSellerRegister />} />
        <Route path="ForgetPassword" element={<ForgetPassword />} />
        <Route path="Dashboard" element={<User />} />
        <Route path="Add-Products" element={<AddProdcuts />} />
        <Route path="/update/:id" element={<Update />} />

        <Route path="Fashion" element={<Fashion />} />
        <Route path="mobiles" element={<Mobile />} />
        <Route path="Electronics-Appliances" element={<Electronics />} />
        <Route path="Beauty" element={<Beauty />} />
        <Route path="Home-Kitchen" element={<Kitchen />} />
        <Route path="Sports-Games" element={<SportsAndGames />} />
        <Route path="Furniture" element={<Furniture />} />
        <Route path="Toys" element={<Toys />} />


        <Route path="Cart" element={<Cart />} />
        <Route path="Favorite" element={<Favorite />} />
        <Route path="BuyNow" element={<BuyNow />} />
        <Route path="Address" element={<AddressForm />} />
        <Route path="payment-success" element={<PaymentSuccess />} />
        <Route path="OrderDetails" element={<ViewOrder />} />
        <Route path="MyOrders" element={<MyOrders />} />
        <Route path="product/:id" element={<ProductView />} />
        <Route path="MyProfile" element={<MyProfile />} />
        <Route path="*" element={<Error />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
