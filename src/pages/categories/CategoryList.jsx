import React, { useState, useEffect } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid, GridPagination, GridToolbar, gridPageCountSelector, GridToolbarQuickFilter, useGridApiContext, useGridSelector } from '@mui/x-data-grid';
import { useAuth } from '../../hooks/auth'
import axios from '../../lib/axios';
import MuiPagination from '@mui/material/Pagination';
import { Link, NavLink } from 'react-router-dom';
import Skelly from '../../components/Skelly';
import { useSelector } from 'react-redux';

const CategoryList = ({ handleLoadingChange }) => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesCount, setCategoriesCount] = useState(0);
    const [sortModel, setSortModel] = useState();

    const [query, setQuery] = useState([]);

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        isLoading: false,
        pageSize: 10
    });


    const paginationHandler = (model) => {
        setPaginationModel({
            ...paginationModel,
            page: model.page + 1
        });
    };
    const onFilterChange = (quickSearchFilter) => {
        setQuery(quickSearchFilter.quickFilterValues)
    }





    useEffect(() => {

        const fetchCategories = async () => {


            try {
                setPaginationModel(old => ({ ...old, isLoading: true }))
                const response = await axios.get('api/categories', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    params: {
                        page: paginationModel?.page + 1,
                        perPage: paginationModel?.pageSize,
                        sort: sortModel,
                        q: query
                    },
                });

                if (response.status === 200) {

                    setCategories(response.data.data.data);
                    setCategoriesCount(response.data.data.total)

                    setPaginationModel(old => ({ ...old, isLoading: false }))
                } else {
                    console.error('Failed to fetch categories');
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();


    }, [query, sortModel, paginationModel.page, paginationModel.pageSize]);


    const { load, isLoading, user } = useAuth({ middleware: 'auth' })

    // useEffect(() => {
    //     handleLoadingChange(isLoading);
    // }, [isLoading, handleLoadingChange]);

    // if (isLoading || !user) return null;

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'name',
            headerName: 'Category name',
            width: 150,
            editable: true,
        },
        {
            field: 'description',
            headerName: 'Description name',
            width: 150,
            editable: true,
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            width: 150,
            editable: true,
        },
        {
            field: 'updated_at',
            headerName: 'Updated at',
            width: 110,
            editable: true,
        }
    ];


    function Pagination({ page, onPageChange, className }) {
        const apiRef = useGridApiContext();
        const pageCount = useGridSelector(apiRef, gridPageCountSelector);

        return (
            <MuiPagination
                color="primary"
                className={className}
                count={pageCount}
                page={page + 1}
                onChange={(event, newPage) => {
                    onPageChange(event, newPage - 1);
                }}
            />
        );
    }

    function CustomPagination(props) {
        return <GridPagination ActionsComponent={Pagination} {...props} />;
    }

    const QuickSearchBar = () => {
        return (
            <Box
                sx={{
                    p: 1,
                    pt: 2,
                    px: 2,
                }}
            >
                <GridToolbar />
                <GridToolbarQuickFilter
                    quickFilterParser={(searchInput) =>
                        searchInput
                            .split(',')
                            .map((value) => value.trim())
                            .filter((value) => value !== '')
                    }
                    debounceMs={1000}
                />
            </Box>
        );
    }
    const AuthUser = useSelector((state) => state.user.user);






    return (
        <div className="flex h-screen overflow-hidden">

            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

                {/*  Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div>
                    Logged In As { AuthUser?.name }
                </div>
                <Skelly loading={load()} />

                <main>

                    {
                        !load() &&
                        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

                            <div className="sm:flex sm:justify-between sm:items-center mb-8">

                                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">

                                    <Link to={'/categories/create'}>
                                        <Button variant="contained">Add View</Button>
                                    </Link>
                                </div>

                            </div>

                         

                            {/* Cards */}
                            <div>

                                {(
                                    <Box sx={{ height: 500, width: '100%' }}>
                                        <DataGrid
                                            rows={categories}
                                            columns={columns}
                                            rowCount={categoriesCount} // Manually set the row count for pagination
                                            paginationMode="server"
                                            sortingMode='server'

                                            sortModel={sortModel}
                                            onSortModelChange={(oldSortModel) => setSortModel([...oldSortModel])}
                                            loading={paginationModel.isLoading}

                                            slots={{
                                                toolbar: QuickSearchBar,
                                                pagination: CustomPagination
                                            }}

                                            slotProps={{
                                                toolbar: {
                                                    showQuickFilter: true,
                                                },
                                            }}

                                            filterMode="server"
                                            onFilterModelChange={onFilterChange}


                                            // console.log(searchInput)
                                            // onPageChange={(newPage) => {
                                            //     setPaginationModel(old => ({...old, page: newPage + 1}))
                                            // }}

                                            // onPageSizeChange={(newPageSize => setPaginationModel(old => ({...old,pageSize: newPageSize})))}

                                            // page={paginationModel.page + 1}
                                            // page={paginationModel.page - 1}
                                            // onPageChange={(newPage) => {
                                            //     console.log(newPage)
                                            //     // setPaginationModel(old => ({ ...old, page: newPage.page + 1 }))
                                            // }}
                                            // pageSize={paginationModel.pageSize}
                                            page={paginationModel.page - 1}
                                            pageSizeOptions={[3, 10, 25, 100]}
                                            paginationModel={paginationModel}
                                            // setPage={paginationModel.page + 1}

                                            onPaginationModelChange={setPaginationModel}

                                            // rowsPerPage={paginationModel.rowsPerPage}
                                            // onRowsPerPageChange={handleChangeRowsPerPage}

                                            // paginationModel={paginationModel}
                                            // onPaginationModelChange={setPaginationModel}

                                            checkboxSelection
                                            disableRowSelectionOnClick
                                        />
                                    </Box>
                                )}
                            </div>
                        </div>
                    }

                </main>

            </div>
        </div>
    );
}

export default CategoryList