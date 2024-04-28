import React, { useState, useEffect } from 'react';

import Banner from '../../partials/Banner';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Button from '@mui/material/Button';
import axios from '../../lib/axios';
import { Link, useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/auth';
import Skelly from '../../components/Skelly';

const ShowCategory = ({ handleLoadingChange }) => {




    const [sidebarOpen, setSidebarOpen] = useState(false);


    // const category = useLoaderData();


    const { load, isLoading, user } = useAuth({ middleware: 'auth' })

    // useEffect(() => {
    //     handleLoadingChange(isLoading);
    // }, [isLoading, handleLoadingChange]);

    // if (isLoading || !user) return null;


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

                            <div className="sm:flex sm:justify-between sm:items-center mb-8">

                                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                                    <Link to={'/categories'}>
                                        <Button variant="contained">List Categories</Button>
                                    </Link>
                                </div>

                            </div>


                            {/* Cards */}
                            <div>

                                {category?.name}

                            </div>
                        </div>
                    }
                </main>

            </div>
        </div>
    );
}

const categoryLoader = async ({ params }) => {

    const { user } = useAuth({ middleware: 'auth' })

    return axios.get(`/api/categories/${params.id}`).then(response => response.data.data)

}



export { categoryLoader as CategoryLoader, ShowCategory as default }