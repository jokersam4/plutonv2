import React, { useContext } from 'react'
import Products from '../Products/Products'
import product1 from '../../assets/img/aaaa.png';
import vegetaarmor from '../../assets/img/vegetaarmor.jpg';
import Footer from '../../components/Footer/Footer';
import { AuthContext } from '../../context/AuthContext';
import './rra.css'

const Ourproducts = () => {
 const { language } = useContext(AuthContext); 

     const dummyProducts = [
        {
          name: {
            en: 'Goku T-shirt',
            fr: 'T-shirt Goku',
            ar: 'تيشيرت غوكو',
          },
          price: 249,
          images: product1,
          id: 1,
          sizes: 'M',
        },
         {
              name: {
               en: 'vegeta armor',
        fr: 'armure de Vegeta',
        ar: 'درع فيجيتا',
              },
              price: 249,
              images: vegetaarmor,
              id: 2,
              sizes: 'M',
            },
      ];
  return (
    <div>
          <div className="rra">
      
    
        <div className="home-content">
        <Products
          products={dummyProducts.map(product => ({
            ...product,
            name: product.name[language],
          }))}
        />
      </div>
  
         </div>
    </div>
  )
}

export default Ourproducts