import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.scss';
import Register from './components/Register';
import Login from './components/Login';
import Main from './components/Main';

function App() {


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route index path='/login' element={ <Login /> } />
            <Route path='/register' element={ <Register /> } />
            <Route path='/main' element={ <Main /> } />
            <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
