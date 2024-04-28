import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Button from '@mui/material/Button';

import axios from '../../lib/axios';
import { Link } from 'react-router-dom';
import { FormControlLabel, Switch, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/auth';
import Skelly from '../../components/Skelly';

const EditCategory = ({ handleLoadingChange }) => {

    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { id } = useParams();
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [status, setStatus] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Fetch category details when component mounts
        axios.get(`/api/categories/${id}`)
            .then(response => {
                const { data } = response;
                setName(data.data.name);
                setDesc(data.data.description);
                setStatus(data.data.status);
            })
            .catch(error => {
                console.error('Error fetching category details:', error);
            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedCategory = {
            name: name,
            desc: desc,
            status: status
        };

        handleLoadingChange(true);
        axios.put(`/api/categories/${id}`, updatedCategory)
            .then(response => {
                console.log(response);
                handleLoadingChange(false);
                toast(response.data.message);
                navigate("/categories");

            })
            .catch(error => {
                if (error.response.status !== 422) throw error;
                setErrors(error.response.data.errors);
                handleLoadingChange(false);
            });
    };


    const { load, isLoading, user } = useAuth({ middleware: 'auth' })

    // useEffect(() => {
    //     handleLoadingChange(isLoading);
    // }, [isLoading, handleLoadingChange]);




    return (
        <div className="flex h-screen overflow-hidden">



            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

                {/*  Site header */}

                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <Skelly loading={load()} />
                {
                    !load() &&
                    <main>
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
                                <form onSubmit={handleSubmit}>
                                    <div className='my-4 py-2'>

                                        <TextField
                                            value={name || ''}
                                            onChange={(e) => setName(e.target.value)}
                                            label="Name"
                                            className='w-3/12'
                                            variant="standard"
                                            error={!!errors.name}
                                            helperText={errors.name && errors.name[0]}
                                        />
                                    </div>
                                    <div className='my-4 py-2'>

                                        <TextField
                                            value={desc || ''}
                                            onChange={(e) => setDesc(e.target.value)}
                                            label="Description"
                                            variant="standard"
                                            className='w-3/12'
                                        />
                                    </div>
                                    <div>
                                        <FormControlLabel
                                            control={<Switch checked={status} onChange={(e) => setStatus(e.target.checked)} />}
                                            label="Active"
                                        />
                                    </div>
                                    <div className='mt-4'>
                                        <Button type='submit' variant='contained' className='mt-8' >Update Category</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main>
                }

            </div>
        </div>
    );
}

export default EditCategory