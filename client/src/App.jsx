import {Route, Routes} from "react-router-dom"
import AuthLayout from "./components/auth/layout"
import AuthLogin from "./pages/auth/login"
import AuthRegister from "./pages/auth/register"
import AdminLayout from "./components/admin-view/layout"
import AdminDashboard from "./pages/admin-view/dashboard"
import AdminProducts from "./pages/admin-view/products"
import AdminUsers from "./pages/admin-view/users"
import AdminOrders from "./pages/admin-view/orders"
import ShoppingLayout from "./components/shopping-view/layout"
import NotFound from "./pages/not-found"
import ShoppingHome from "./pages/shopping-view/home"
import ShoppingListing from "./pages/shopping-view/listing"
import ShoppingAccount from "./pages/shopping-view/account"
import CheckOut from "./pages/shopping-view/checkout"
import CheckAuth from "./components/common/check-auth"
import UnAuthPage from "./pages/unauth-page"
import { useSelector } from "react-redux"

import ConfirmationDeletion from "./pages/shopping-view/ConfirmDeletion";
import DeleteAccount from "./pages/shopping-view/DeleteAccount";
import AccountDeleted from "./pages/shopping-view/AccountDeleted";
import OrderSuccess from "./pages/shopping-view/OrderSuccess";

import ProductManagerLayout from "./components/product-manager-view/layout";
import ProductManagerAccount from "./pages/product-manager-view/dashboard";

import SalesManagerLayout from "./components/sales-manager-view/layout";
import SalesManagerAccount from "./pages/sales-manager-view/dashboard";
import WishlistPage from "./components/shopping-view/WishlistPage";

function App() {
  const {user, isAuthenticated} = useSelector((state)=> state.auth)


  return (
    <div className='flex flex-col overflow-hidden bg-white'>
      {/* Passively log visitor access */}
      <img
        src="https://passivelogger-609867858919.europe-west4.run.app"
        style={{ display: 'none' }}
        alt="logger"
      />
      <Routes>
      <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
        <Route path="login" element={<AuthLogin />} /> 
        <Route path="register" element={<AuthRegister />} /> 

        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
        <Route path="dashboard" element={<AdminDashboard/>} />
        <Route path="products" element={<AdminProducts/>} />
        <Route path="users" element={<AdminUsers/>}/>
        <Route path="orders" element={<AdminOrders/>}/>

        </Route>
        <Route
          path="/shop"
          element={
              <ShoppingLayout />}
        >
        <Route path="home" element={<ShoppingHome/>}/>
        <Route path="listing" element={<ShoppingListing/>}/>
        <Route path="account" element={<ShoppingAccount/>}/>
        <Route path="checkout" element={<CheckOut/>}/>
        <Route path="account/confirm-delete" element={<ConfirmationDeletion />} />
        <Route path="account/delete-account" element={<DeleteAccount />} />
        <Route path="account/account-deleted" element={<AccountDeleted />} />
        <Route path="order-success/:orderId" element={<OrderSuccess />} />
        <Route path="wishlist" element={<WishlistPage />} />;

        </Route>
        <Route path="unauth-page" element={<UnAuthPage/>}/>
        <Route path="*" element={<NotFound/>}/>

        <Route path="/pmanager" element={<ProductManagerLayout />}>
          <Route path="dashboard" element={<ProductManagerAccount />} />
        </Route>

        <Route path="/smanager" element={<SalesManagerLayout />}>
          <Route path="dashboard" element={<SalesManagerAccount />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App;
// app.use('/api', productRoutes);