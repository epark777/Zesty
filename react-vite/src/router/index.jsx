import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import ProductList from '../components/Products/ProductList'; // Importing ProductList
import ProductDetail from '../components/Products/ProductDetail'; // Importing ProductDetail
import ProductCreate from '../components/Products/ProductCreate'
import ProductEdit from '../components/Products/ProductEdit';
import FavoritesList from '../components/FavoritesList/FavoritesList'; // Importing FavoritesList
import ReviewList from '../components/ReviewList/ReviewList'; // Importing ReviewList
import Cart from '../components/Cart/Cart';
import {ManageProducts} from '../components/Products/ProductManage';
import { CartPurchase } from '../components/Cart/CartPurchase';


export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <ProductList />, // Display ProductList as the home page
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "favorites",
        element: <FavoritesList />, // Route for favorites list
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "cart/purchased",
        element: <CartPurchase />,
      },
      {
        path: "user/products",
        element: <ManageProducts />
      },
      {
        path: "products/:productId",
        element: <ProductDetail />, // Route for product detail page
      },
      {
         path: "products/:productId/edit",
         element: <ProductEdit />, // Route for product detail page
      },
      {
        path: "products/new",
        element: <ProductCreate />, // Route for product detail page
      },
      {
        path: "products/:productId/reviews",
        element: <ReviewList />, // Route for reviews of a specific product
      },
    ],
  },
]);
