import './App.css';
import { Routes, Route, redirect, Navigate } from 'react-router-dom';
import { DASHBOARD, HOLDINGS, HOME, INSTRUMENT, LOGIN, REGISTER, TRANSACTIONS } from './routes/routes';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Holdings from './pages/Holdings';
import SidebarNavbarWrapper from './components/SidebarNavbarWrapper';
import Transactions from './pages/Transactions';
import Instrument from './pages/Instrument';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setUser } from './helper/UserSlice';

function App() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch(setUser(user));
    }
  }, [])
  return (
    <Routes>
      <Route path={LOGIN} element={user ? <Navigate to={HOME} /> : <Login />} />
      <Route path={REGISTER} element={user ? <Navigate to={HOME} /> : <Register />} />
      <Route path={HOME} element={user ? <SidebarNavbarWrapper /> : <Navigate to={LOGIN} />}>
        <Route path={HOME} element={<Navigate to={DASHBOARD} replace />} />
        <Route path={DASHBOARD} element={<Dashboard />}>
          <Route path={INSTRUMENT} element={<Instrument />} />
        </Route>
        <Route path={HOLDINGS} element={<Holdings />} />
        <Route path={TRANSACTIONS} element={<Transactions />} />
      </Route>
    </Routes>
  );
}

export default App;
