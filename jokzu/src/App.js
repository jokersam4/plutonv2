import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage/ProductPage';
import product1Image1 from './assets/img/aaaa.png';
import product1Image2 from './assets/img/aaaa2.png';
import vegetaarmor from './assets/img/vegetaarmor.jpg';
import Navbar from './components/Navbar/Navbar';
import { AuthContext } from './context/AuthContext';
import './App.css'
import Login from '../src/components/login/Login2';
import AuthLayout from "./layouts/authLayout/AuthLayout";
import AffiliatePage from './components/AffiliatePage/AffiliatePage';
import ResetLayout from "./layouts/ResetLayout/ResetLayout";
import ActivateLayout from "./layouts/ActivateLayout/ActivateLayout";
import ScrollToTop from './components/ScrollToTop';
import { FcGoogle } from "react-icons/fc";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from '@react-oauth/google';
import ThankYou from './components/ThankYou/ThankYou';
import axios from "axios";
import WhatsAppButton from './components/Whatsapp/WhatsAppButton';
import Ourproducts from './components/Ourproducts/Ourproducts';

// Set the base URL for all requests
axios.defaults.baseURL = "http://localhost:5000";

// New Component for language selection
const LanguageSelectionScreen = ({ onSelectLanguage }) => {
  return (
    <div className="language-selection-screen">
      <h2>Select Your Language</h2>
      <button onClick={() => onSelectLanguage('en')}>English</button>
      <button onClick={() => onSelectLanguage('fr')}>Français</button>
      <button onClick={() => onSelectLanguage('ar')}>عربي</button>
    </div>
  );
};

const App = () => {

  const { user, dispatch, token, isLoggedIn, language } = useContext(AuthContext);
  const [clientSecret, setClientSecret] = useState("");
  const [currentRoute, setCurrentRoute] = useState(getCurrentRoute());

  // Handle language selection
  const handleLanguageSelection = (lang) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang }); // Dispatch action to update language in context
    localStorage.setItem('language', lang); // Persist the selected language in localStorage
  };
  useEffect(() => {
 

    const token = localStorage.getItem("_appToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("_appToken");
        } else {
          dispatch({ type: "SIGNING" });
          dispatch({ type: "GET_USER", payload: decodedToken });
        }
      } catch (error) {
        console.error("Invalid token");
        localStorage.removeItem("_appToken");
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const _appToken = localStorage.getItem("_appToken");
    if (_appToken) {
      const getToken = async () => {
        try {
          const res = await axios.post("/api/auth/access", {
            headers: { Authorization: token },
          }, { withCredentials: true });
          dispatch({ type: "GET_TOKEN", payload: res.data.ac_token });
        } catch (error) {
          console.error("Error fetching token:", error);
        }
      };
      getToken();
    }
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          dispatch({ type: "SIGNING" });
          const res = await axios.get("/api/auth/user", {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          dispatch({ type: "GET_USER", payload: res.data });
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      getUser();
    }
  }, [dispatch, token]);


  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(getCurrentRoute());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  function getCurrentRoute() {
    return window.location.hash.slice(1) || "/";
  }

  const dummyProducts = [
    {
      id: 1,
      name: {
        en: 'Goku T-shirt',
        fr: 'T-shirt Goku',
        ar: 'تيشيرت غوكو',
      },
      price: 249,
      sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      images: [product1Image1, product1Image2],
      description: {
        en: 'This is a cool 3D T-Shirt with a unique design. Made from high-quality materials to ensure comfort and style.',
        fr: 'Ceci est un t-shirt 3D cool avec un design unique. Fabriqué avec des matériaux de haute qualité pour assurer confort et style.',
        ar: 'هذا قميص ثلاثي الأبعاد بتصميم فريد. مصنوع من مواد عالية الجودة لضمان الراحة والأناقة.',
      },
      reviews: [
        {
          text: {
            en: 'Great quality!',
            fr: 'Excellente qualité!',
            ar: 'جودة رائعة!',
          },
          author: 'John Doe',
        },
        {
          text: {
            en: 'Love the design.',
            fr: "J'adore le design.",
            ar: 'أحب التصميم.',
          },
          author: 'Jane Smith',
        },
      ],
    },
     {
      id: 2,
      name: {
        en: 'vegeta armor',
        fr: 'armure de Vegeta',
        ar: 'درع فيجيتا',
      },
      price: 249,
      sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      images: [vegetaarmor],
      description: {
        en: 'This is a cool 3D T-Shirt with a unique design. Made from high-quality materials to ensure comfort and style.',
        fr: 'Ceci est un t-shirt 3D cool avec un design unique. Fabriqué avec des matériaux de haute qualité pour assurer confort et style.',
        ar: 'هذا قميص ثلاثي الأبعاد بتصميم فريد. مصنوع من مواد عالية الجودة لضمان الراحة والأناقة.',
      },
      reviews: [
        {
          text: {
            en: 'Great quality!',
            fr: 'Excellente qualité!',
            ar: 'جودة رائعة!',
          },
          author: 'John Doe',
        },
        {
          text: {
            en: 'Love the design.',
            fr: "J'adore le design.",
            ar: 'أحب التصميم.',
          },
          author: 'Jane Smith',
        },
      ],
    },
  ];

  // If language is not selected, show the language selection screen
  if (!language) {
    return <LanguageSelectionScreen onSelectLanguage={handleLanguageSelection} />;
  }

  return (
    <Router>
      <Navbar />
      <ScrollToTop />
      <WhatsAppButton />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              products={dummyProducts.map(product => ({
                ...product,
                name: language === 'ar' ? product.name.ar : language === 'fr' ? product.name.fr : product.name.en,
                description: language === 'ar' ? product.description.ar : language === 'fr' ? product.description.fr : product.description.en,
                reviews: product.reviews.map(review => ({
                  ...review,
                  text: language === 'ar' ? review.text.ar : language === 'fr' ? review.text.fr : review.text.en,
                })),
              }))}
              language={language}
            />
          }
        />
        <Route
          path="/product/:productId"
          element={
            <ProductPage
              products={dummyProducts.map(product => ({
                ...product,
                name: language === 'ar' ? product.name.ar : language === 'fr' ? product.name.fr : product.name.en,
                description: language === 'ar' ? product.description.ar : language === 'fr' ? product.description.fr : product.description.en,
                reviews: product.reviews.map(review => ({
                  ...review,
                  text: language === 'ar' ? review.text.ar : language === 'fr' ? review.text.fr : review.text.en,
                })),
              }))}
              language={language}
            />
          }
        />
        <Route path="/Ourproducts" element={<Ourproducts language={language} />} />
        <Route path="/Affiliate" element={<AffiliatePage language={language} />} />
        <Route path="/login" element={<AuthLayout />} />
        <Route path="/auth/reset-password/:token" element={<ResetLayout />} />
        <Route path="/api/auth/activate/:activation_token" element={<ActivateLayout />} />
        <Route path="/Affiliate" element={<AffiliatePage />} />
        <Route path="/thankyou" element={<ThankYou />} />
      </Routes>
    </Router>
  );
};

export default App;
