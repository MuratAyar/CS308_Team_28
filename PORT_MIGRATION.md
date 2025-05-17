# Port Migration Guide for TwoEight Application

## Changes Made

1. Backend port changed from 5000 to 8080 in `server/server.js`
2. Created a centralized API config at `client/src/config/api.js`
3. Updated the following key files to use the new API configuration:
   - Auth files:
     - `client/src/store/auth-slice/index.js`
   - Store slices:
     - `client/src/store/shop/cart-slice/index.js`
     - `client/src/store/user-slice/index.js`
     - `client/src/store/shop/order-slice/index.js`
     - `client/src/store/shop/address-slice/index.js`
     - `client/src/store/shop/wishlist-slice/index.js`
     - `client/src/store/shop/products-slice/index.jsx`
   - Admin View:
     - `client/src/pages/admin-view/orders-content.jsx`
     - `client/src/pages/admin-view/users.jsx`
     - `client/src/pages/admin-view/products.jsx`
   - Sales Manager View:
     - `client/src/pages/sales-manager-view/SalesManagerDiscount.jsx`
     - `client/src/pages/sales-manager-view/SetPrices.jsx`
     - `client/src/components/sales-manager-view/revenueloss.jsx`
     - `client/src/components/sales-manager-view/ViewInvoices.jsx`
     - `client/src/components/sales-manager-view/evaluateRefunds.jsx`

## Remaining Files To Update

Many files still need to be updated to use the new API configuration:

1. Product Manager View Components
2. Shopping View Components
3. Various other components with hardcoded URLs

## How to Update the Remaining Files

For each file that still contains hardcoded URLs, follow these steps:

1. Import the API URL helper:
   ```javascript
   import { apiUrl } from "../../config/api";  // Adjust the path as needed
   ```

2. Replace hardcoded URLs with the apiUrl function:
   ```javascript
   // Old
   const response = await axios.get("http://localhost:5000/api/products/all");
   
   // New
   const response = await axios.get(apiUrl("/api/products/all"));
   ```

3. For template literals with variables:
   ```javascript
   // Old
   const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
   
   // New
   const response = await axios.get(apiUrl(`/api/products/${productId}`));
   ```

## Helper Script

A helper script has been created at the root of the project (`update_api_urls.js`) that can automatically search for and update most hardcoded URLs. To use it:

```bash
node update_api_urls.js
```

## Testing

After updating all files:

1. Start the backend server:
   ```bash
   cd server
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```

3. Test the registration and login functionality
4. Test other critical paths in your application

## Important Note

The port has been changed from 5000 to 8080 because port 5000 was not working on your computer. If you need to use a different port in the future, you only need to change it in one place:

```javascript
// client/src/config/api.js
export const API_BASE_URL = 'http://localhost:8080';
```

This is the advantage of using a centralized API URL config - you only have to change it in one place instead of throughout your entire codebase. 