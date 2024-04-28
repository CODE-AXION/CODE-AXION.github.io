import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import DashboardAvatars from '../partials/dashboard/DashboardAvatars';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import TextField from '@mui/material/TextField';
import Banner from '../partials/Banner';
import axios from 'axios';
import { useAuth } from '../hooks/auth'
import Skelly from '../components/Skelly';
import { useSelector } from 'react-redux';

function Dashboard({ handleLoadingChange }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { load, isLoading, user } = useAuth({ middleware: 'auth' })

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  if (!isLoggedIn) return null;
  
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <Skelly loading={load()} />
        <main>
          {
            !load() &&
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

              {/* Welcome banner */}
              <WelcomeBanner />

              {/* Dashboard actions */}
              <div className="sm:flex sm:justify-between sm:items-center mb-8">

                {/* Left: Avatars */}
                <DashboardAvatars />

                {/* Right: Actions */}
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  {/* Filter button */}
                  <FilterButton />
                  {/* Datepicker built with flatpickr */}
                  <Datepicker />
                  {/* Add view button */}
                  <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                    <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="hidden xs:block ml-2">Add view</span>
                  </button>
                </div>

              </div>

              {/* Cards */}
              <div className="grid grid-cols-12 gap-6">


                <TextField key="Confirmation Code" id="outlined-basic" label="Outlined" variant="outlined" />
                {/* Line chart (Acme Plus) */}
                <DashboardCard01 />

              </div>

            </div>
          }
        </main>

        <Banner />

      </div>
    </div>
  );
}

export default Dashboard;