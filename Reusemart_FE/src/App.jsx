import './App.css'
import Home from '/src/Home/Home.jsx';

import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>   
    </Router>
  );
}

export default App;