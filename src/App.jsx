import React, { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  useLocation,
  createHashRouter,
  RouterProvider
} from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import CategoryList from './pages/categories/CategoryList';

import ShowCategoryPage, { CategoryLoader } from './pages/categories/ShowCategory';
import EditCategory from './pages/categories/EditCategory'; // Import EditCategory
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Chat from './pages/Chat';
import CreateCategory from './pages/categories/CreateCategory'
import { Backdrop, CircularProgress, LinearProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

function App() {

  const location = useLocation();
  const isLoading = useSelector((state) => state.loading.isLoading);

  
  // const [isLoading, setIsLoading] = useState(false);
  const [freezeScreen, setFreezeScreen] = useState(false);
  
  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change



  return (
    <>

      <Routes>
        {/* <Route exact path="/dashboard" element={<Dashboard  />}  />
        <Route exact path="/categories" element={<CategoryList handleLoadingChange={(loadingChange) => setIsLoading(loadingChange)} />} />
        <Route exact path="/categories/create" element={<CreateCategory handleLoadingChange={(loadingChange) => setIsLoading(loadingChange)} />} />
        <Route exact path="/categories/edit/:id" element={<EditCategory handleLoadingChange={(loadingChange) => setIsLoading(loadingChange)} />} /> {/* Pass handleLoadingChange */}
        {/* <Route exact path="/categories/show/:id" element={<ShowCategoryPage handleLoadingChange={(loadingChange) => setIsLoading(loadingChange)} />}  /> Pass handleLoadingChange */} 

        <Route exact path="/" element={<Chat />} />
        <Route exact path="/login" element={<Login />} />
        
      </Routes>

      <ToastContainer /> {/* Add this line */}
      
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading} >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default App;
