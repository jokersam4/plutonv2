import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './ProductPage.css';
import Comments from '../../components/ReviewForm/ReviewForm';
import axios from 'axios';

import Footer from '../../components/Footer/Footer';
import { AuthContext } from '../../context/AuthContext';

const ProductPage = ({ products }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const product = products.find(prod => prod.id === parseInt(productId));
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState(product ? product.reviews : []);
  const [discount, setDiscount] = useState(0);
  const { language } = useContext(AuthContext);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phoneNumber: '' });
  const location = useLocation();
  const [userParam, setUserParam] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState(product.price);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const user = queryParams.get('user');
    if (user) setUserParam(user);
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const addPromoCode = async () => {
    try {
      const existingResponse = await axios.get(`/api/codepromo?code=${promoCode}`);
      const promoExists = existingResponse.data.some(promo => promo.codepromo2 === promoCode);

      if (promoExists) {
        setMessageType('success');
        setMessage('Promo code added successfully!');
        const newPrice = product.price - 50;
        setDiscountedPrice(newPrice > 0 ? newPrice : 0); // prevent negative prices
        return;
      }

      setMessageType('error');
      setMessage('Invalid code.');
    } catch (error) {
      console.error('Error adding promo code:', error);
      setMessageType('error');
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    let promoToSend = '';

    try {
      if (promoCode.trim() !== '') {
        try {
          const promoResponse = await axios.post('/api/codepromo2', { code: promoCode });
          if (promoResponse.data.valid) {
            promoToSend = promoCode;
            await axios.patch('/api/codepromo2', { code: promoCode });
          }
        } catch (promoError) {
          if (promoError.response?.status === 404) {
            setMessageType('error');
            setMessage(language === 'en' ? 'Invalid promo code.' : language === 'fr' ? 'Code promo invalide.' : 'رمز ترويجي غير صالح.');
            return;
          }
        }
      }

      const response = await axios.post('/api/commands', {
        size: selectedSize,
        quantity,
        name: `${formData.firstName} ${formData.lastName}`,
        phoneNumber: formData.phoneNumber,
        codepromo: promoCode,
      });

      navigate('/thankyou');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select a size.');
      return;
    }
    if (quantity < 1) {
      alert('Please select a valid quantity.');
      return;
    }
    setShowForm(true);
  };

  const addReview = (newReview) => {
    setReviews([...reviews, newReview]);
  };

  if (!product) {
    return <h2>Product not found</h2>;
  }



  return (
    <div>
      <div className="product-page">
        <div className="product-page-container">
          <div className="product-image-container">
            <Carousel showArrows={true} dynamicHeight={true} infiniteLoop={true}>
              {product.images.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </Carousel>
          </div>

          {showForm ? (
            <form className="payment-form" onSubmit={handleSubmit}>
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">
                MAD {discountedPrice !== product.price ? discountedPrice : product.price}
                {discountedPrice !== product.price && (
                  <span className="original-price">MAD {product.price}</span>
                )}
              </p>
              <h3>{language === 'en' ? "Enter your details" : language === 'fr' ? "Entrez vos détails" : "أدخل تفاصيلك"}</h3>
              <label>
                {language === 'en' ? "First Name:" : language === 'fr' ? "Prénom:" : "الاسم الشخصي:"}
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </label>
              <label>
                {language === 'en' ? "Last Name:" : language === 'fr' ? "Nom de famille:" : "الاسم العائلي:"}
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </label>
              <label>
                {language === 'en' ? "Phone Number:" : language === 'fr' ? "Numéro de téléphone:" : "رقم الهاتف:"}
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
              </label>

              <div className="max-w-md mx-auto p-4 border rounded shadow-lg">
                <h2 className="text-xl font-bold mb-2">
                  {language === 'en'
                    ? "Apply Promo Code"
                    : language === 'fr'
                      ? "Appliquer le code promo"
                      : language === 'ar'
                        ? "أدخل الرمز الترويجي"
                        : "Apply Promo Code"}
                </h2>

                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="w-full px-3 py-2 border rounded mb-2"
                />
                <button
                  type="button"
                  onClick={addPromoCode}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Apply
                </button>
                {message && (
                  <p className={`promo-message ${messageType === 'success' ? 'promo-success' : 'promo-error'}`}>
                    {message}
                  </p>
                )}
              </div>

              <button className="eee" type="submit">Submit</button>
            </form>
          ) : (
            <div className="product-details">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">
                MAD {discountedPrice !== product.price ? discountedPrice : product.price}
                {discountedPrice !== product.price && (
                  <span className="original-price">MAD {product.price}</span>
                )}
              </p>

              <p className="product-description">{product.description}</p>
              <div className="product-size">
                <label htmlFor="size">{language === 'en' ? "Size:" : language === 'fr' ? "Taille:" : "المقاس:"}</label>
                <select id="size" value={selectedSize} onChange={handleSizeChange} required>
                  <option value="">{language === 'en' ? "Select size" : language === 'fr' ? "Sélectionner la taille" : "اختيار المقاس"}</option>
                  {product.sizes.map((size, index) => (
                    <option key={index} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className="product-quantity">
                <label htmlFor="quantity">{language === 'en' ? "Quantity:" : language === 'fr' ? "Quantité:" : "الكمية:"}</label>
                <input type="number" id="quantity" value={quantity} onChange={handleQuantityChange} min={1} required />
              </div>
              <button className="buy-now-button" onClick={handleBuyNow}>
                {language === 'en' ? "Order Now" : language === 'fr' ? "Commandez maintenant" : "اطلب الآن"}
              </button>
            </div>
          )}
        </div>
        <Comments reviews={reviews} addReview={addReview} />
      </div>
     
    </div>
  );
};

export default ProductPage;
