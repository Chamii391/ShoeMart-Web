import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import Products from './pages/products';
import About from './pages/about';
import Contact from './pages/contact';

import Login from './auth/loging';
import { Toaster } from 'react-hot-toast';
import Register from './auth/rejister';




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
        </Routes>
      </Router>


     
    </>
  )
}

export default App