import React, { useState, useEffect, useCallback } from 'react';

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
import { Alert, Snackbar, Stack, TextField } from '@mui/material';
import QuickSearchBar from '../../components/Datagrid/QuickSearchBar';
import Pagination from '../../components/Datagrid/Pagination';
import CustomPagination from '../../components/Datagrid/Pagination';

const CategoryList = ({ handleLoadingChange }) => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesCount, setCategoriesCount] = useState(0);
    const [sortModel, setSortModel] = useState();
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [query, setQuery] = useState([]);
    const [queryOptions, setQueryOptions] = useState({});
    const [snackbar, setSnackbar] = useState(null);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        isLoading: false,
        pageSize: 10
    });

    const onFilterChange = useCallback((quickSearchFilter) => {

        setQueryOptions({ filterModel: { ...quickSearchFilter.items } });
        setQuery(quickSearchFilter.quickFilterValues)
    }, []);


    const processRowUpdate = async (newRow) => {

        setSnackbar({ children: 'User successfully saved', severity: 'success' });
        return newRow;
    }


    const handleProcessRowUpdateError = useCallback((error) => {
        console.log(error)
        setSnackbar({ children: error.message, severity: 'error' });
    }, []);


    useEffect(() => {
        // delete multiple rows
    }, [rowSelectionModel])



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
                        q: query,
                        ...queryOptions,

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


    }, [query, sortModel, paginationModel.page, paginationModel.pageSize, onFilterChange, queryOptions]);


    const { load, isLoading, user } = useAuth({ middleware: 'auth' })

    // useEffect(() => {
    //     handleLoadingChange(isLoading);
    // }, [isLoading, handleLoadingChange]);

    // if (isLoading || !user) return null;

    const columns = [
        { field: 'id', headerName: 'ID', width: 5 },
        {
            field: 'name',
            headerName: 'Category name',
            editable: true,
            minWidth: 150, flex: 1
        },
        {
            field: 'description',
            headerName: 'Description name',
            editable: true,
            minWidth: 150, flex: 1
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            editable: true,
            minWidth: 150, flex: 1
        },
        {
            field: 'updated_at',
            headerName: 'Updated at',
            editable: true,
            minWidth: 110, flex: 1
        },
        {
            field: 'actions',
            headerName: 'actions',
            minWidth: 250, flex: 1,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                const onClick = (e) => {
                    const currentRow = params.row;
                    return alert(JSON.stringify(currentRow, null, 4));
                };

                return (
                    <>
                        <Button sx={{ marginInline: 1 }} variant="outlined" color="warning" size="small" onClick={onClick}>Edit</Button>
                        <Button sx={{ marginInline: 1 }} variant="outlined" color="error" size="small" onClick={onClick}>Delete</Button>
                    </>
                );
            },
        }

    ];


    // function Pagination({ page, onPageChange, className }) {
    //     const apiRef = useGridApiContext();
    //     const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    //     return (
    //         <MuiPagination
    //             color="primary"
    //             className={className}
    //             count={pageCount}
    //             page={page + 1}
    //             onChange={(event, newPage) => {
    //                 onPageChange(event, newPage - 1);
    //             }}
    //         />
    //     );
    // }

    // function CustomPagination(props) {
    //     return <GridPagination ActionsComponent={Pagination} {...props} />;
    // }

    // const QuickSearchBar = () => {
    //     return (
    //         <Box
    //             sx={{
    //                 p: 1,
    //                 pt: 2,
    //                 px: 2,
    //             }}
    //         >
    //             <GridToolbar />
    //             <GridToolbarQuickFilter
    //                 quickFilterParser={(searchInput) =>
    //                     searchInput
    //                         .split(',')
    //                         .map((value) => value.trim())
    //                         .filter((value) => value !== '')
    //                 }
    //                 debounceMs={1000}
    //             />
    //         </Box>
    //     );
    // }

    const AuthUser = useSelector((state) => state.user.user);

    const fieldsToRemove = ["id", "actions","updated_at","created_at"];


    return (
        <div className="flex h-screen overflow-hidden">

            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

                {/*  Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div>
                    Logged In As {AuthUser?.name}
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

                            <div className='my-4'>
                                { 
                                    columns
                                    ?.filter(item => !fieldsToRemove.includes(item.field))
                                    ?.map((item, index) => (
                                        
                                        <TextField key={index} id="filled-basic" sx={{margin: 1}}  size="small" label={item.headerName} variant="filled" />
                                    ))
                                }
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


                                            // for sorting
                                            sortModel={sortModel}
                                            onSortModelChange={(oldSortModel) => setSortModel([...oldSortModel])}
                                            loading={paginationModel.isLoading}
                                            keepNonExistentRowsSelected

                                            // for deleting rows with multiple checkboxes
                                            onRowSelectionModelChange={(newRowSelectionModel) => {
                                                setRowSelectionModel(newRowSelectionModel);
                                            }}
                                            rowSelectionModel={rowSelectionModel}

                                            slots={{
                                                toolbar: QuickSearchBar,
                                                pagination: CustomPagination
                                            }}

                                            slotProps={{
                                                toolbar: {
                                                    showQuickFilter: true,
                                                },
                                            }}


                                            processRowUpdate={processRowUpdate}
                                            onProcessRowUpdateError={handleProcessRowUpdateError}

                                            // for filtering 
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


                                        {!!snackbar && (
                                            <Snackbar
                                                open
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                                onClose={() => setSnackbar(null)}
                                                autoHideDuration={6000}
                                            >
                                                <Alert {...snackbar} onClose={() => setSnackbar(null)} />
                                            </Snackbar>
                                        )}
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