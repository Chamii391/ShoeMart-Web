import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import Products from './pages/products';
import About from './pages/about';
import Contact from './pages/contact';

import Login from './auth/loging';
import { Toaster } from 'react-hot-toast';
import Register from './auth/rejister';
import AdminPage from './admin/adminpage';
import ProductOverview from './pages/productOverview';
import CartPage from './pages/cartPage';
import ClientPage from './clients/clientPage';
import Checkout from './pages/checkout';





function App() {

  return (
    <>
    
      <Router>

        <Toaster position='top-center'/>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login  />} />
          <Route path="/register" element={<Register  />} />
          <Route path="/admin-page/*" element={<AdminPage />} />
          <Route path="/overview/:id" element={<ProductOverview />} /> 
          <Route path="/cart" element={<CartPage/>} /> 
          <Route path="/checout" element={<Checkout/>} /> 



         <Route path="/client-page/*" element={<ClientPage />} />
          
        </Routes>
      </Router>


     
    </>
  )
}

export default App