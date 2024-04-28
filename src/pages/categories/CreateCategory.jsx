import React, { useState, useEffect } from 'react';

import WelcomeBanner from '../../partials/dashboard/WelcomeBanner';
import Banner from '../../partials/Banner';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { useAuth } from '../../hooks/auth'
import axios from '../../lib/axios';
import { Link } from 'react-router-dom';
import { FormControlLabel, Switch, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import Skelly from '../../components/Skelly';

const CreateCategory = ({ handleLoadingChange }) => {



    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [status, setStatus] = useState(true);

    const [open, setOpen] = useState(true);
    const [errors, setErrors] = useState({});



    const { load,isLoading, user } = useAuth({ middleware: 'auth' })

    // useEffect(() => {
    //     handleLoadingChange(isLoading);
    // }, [isLoading, handleLoadingChange]);


    const submitForm = (e) => {
        e.preventDefault();
        const createCategory = {
            name: name,
            description: desc,
            status: status
        }

        handleLoadingChange(true);
        axios.post('/api/categories', createCategory)
            .then(response => {
                console.log(response);
                handleLoadingChange(false);
                toast(response.data.message)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors);
            })
            .finally(() => {
                // Set loading to false after API call (whether success or error)
                handleLoadingChange(false);
            });

        console.log(createCategory)
    }




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

                                <form onSubmit={submitForm}>

                                    <div className='my-4 py-2'>
                                        <TextField
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className='w-3/12'
                                            id="name"
                                            label="Name"
                                            variant="standard"
                                            error={!!errors.name}
                                            helperText={errors.name && errors.name[0]}
                                        />

                                    </div>

                                    <div className='my-4 py-2'>
                                        <TextField value={desc} onChange={(e) => setDesc(e.target.value)} className='w-3/12' id="standard-basic" label="Description" variant="standard" />
                                    </div>
                                    <div>
                                        <FormControlLabel
                                            className='!ml-0'
                                            checked={status}
                                            value={status} onChange={(e) => setStatus(e.target.checked)}
                                            control={<Switch color="primary" />}
                                            label="Active"
                                            labelPlacement="start"
                                        />
                                    </div>

                                    <div className='mt-4'>
                                        <Button type='submit' variant='contained' className='mt-8' >Create Category</Button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    }
                </main>

            </div>
        </div>
    );
}

export default CreateCategory