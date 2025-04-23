import './App.css'
import Register from './Home/Register';
import Home from '/src/Home/Home.jsx';
import Login from '/src/Home/Login.jsx';
import ProductHome from '/src/Products/ProductHome.jsx';

import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductHome />} />
      </Routes>   
    </Router>
  );
}

export default App;