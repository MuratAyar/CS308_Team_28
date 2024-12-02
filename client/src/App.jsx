
import {Route, Routes} from "react-router-dom"
import AuthLayout from "./components/auth/layout"
import AuthLogin from "./pages/auth/login"
import AuthRegister from "./pages/auth/register"
import AdminLayout from "./components/admin-view/layout"
import AdminDashboard from "./pages/admin-view/dashboard"
import AdminProducts from "./pages/admin-view/products"
import AdminOrders from "./pages/admin-view/orders"
import AdminFeatures from "./pages/admin-view/features"
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
import DashboardPage from "./pages/product-manager-view/dashboard";


function App() {
  const {user, isAuthenticated} = useSelector((state)=> state.auth)

  return (
    <div className='flex flex-col overflow-hidden bg-white'>
      
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
        <Route path="orders" element={<AdminOrders/>}/>
        <Route path="features" element={<AdminFeatures/>}/>

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


        </Route>
        <Route path="unauth-page" element={<UnAuthPage/>}/>
        <Route path="*" element={<NotFound/>}/>

        <Route path="/pmanager" element={<ProductManagerLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>

      </Routes>
    </div>
  )
}

export default App;
