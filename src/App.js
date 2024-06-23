import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import DynamicForm from './Form';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<DynamicForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
