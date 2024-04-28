import axios from '../lib/axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { setLoggedIn, setUser } from '../stores/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import useSWR, { useSWRConfig } from 'swr';

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {

    // const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const authUser = useSelector((state) => state.user.user);
    
    let navigate = useNavigate();
    let params = useParams();
    // const [user, setUser] = useState(null);
    // const [error, setError] = useState(null);
    // const [isLoading, setIsLoading] = useState(true);
    // const [load, setLoad] = useState(true);

        const {data: user, error, isLoading, mutate} = useSWR('/api/user', () =>
            axios
            .get('/api/user')
            // .then(res => res.data)
            .then(res => {
                dispatch(setLoggedIn(true))
                dispatch(setUser(res.data));
         
            })
            .catch(error => {
                if (error.response.status == 401) {
                    dispatch(setLoggedIn(false))
                }
                if (error.response.status !== 409) throw error
                
                // dispatch(setLoggedIn(false))

                mutate('/verify-email')
            }),
            {
                revalidateIfStale: true,
                revalidateOnFocus: true,
                shouldRetryOnError: false
            }
            
        )
        
    // const fetchData = async () => {
    //     try {
    //         const response = await axios.get('/api/user');
    //         setIsLoading(false);
    //         dispatch(setUser(response.data));

    //     } catch (error) {
    //         if (error.response && error.response.status === 409) {
    //             navigate('/verify-email');
    //         } else {
    //             setError(error);
    //             setIsLoading(false);
    //         }
    //     }
    // };

  
    // const mutate = async () => {
    //     try {
    //         const response = await axios.get('/api/user');
    //         // setUser(response.data);
    //         dispatch(setUser(response.data));

    //     } catch (error) {
    //         setError(error);
    //     }
    // };

    const csrf = async () => {
        await axios.get('/sanctum/csrf-cookie');
    };

    const register = async ({ setErrors, ...props }) => {
        try {
            await csrf();
            setErrors([]);
            await axios.post('/register', props);
            await mutate();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(Object.values(error.response.data.errors).flat());
            } else {
                throw error;
            }
        }
    };

    // Similarly refactor other functions

    // useEffect(() => {
    //     fetchData();
    // }, []);

    // useEffect(() => {
    //     // console.log('USER='+user.name + '  --- loading --:'+ isLoading)
    //     if (middleware === 'guest' && redirectIfAuthenticated && user ) {
    //         navigate(redirectIfAuthenticated);
    //     }
    //     if (middleware === 'auth' && error) {
    //         logout();
    //     }
    // }, [user, error]);

    useEffect(() => {
 
        //if (middleware === 'guest' && redirectIfAuthenticated && isLoggedIn) {
        if (middleware === 'guest' && redirectIfAuthenticated && (isLoggedIn === true)) {
            navigate(redirectIfAuthenticated)
        }
        if (middleware === 'auth' && error){
            logout()
        } 
    }, [user, error])

    const logout = async () => {
        try {
            if (!error) {
                await axios.post('/logout');
                dispatch(setLoggedIn(false))
                await mutate();
            }
            window.location.href = '/#/login';
        } catch (error) {
            setError(error);
        }
    };
    const login = async ({ setErrors, setStatus, ...props }) => {
        try {
            await csrf();
            setErrors([]);
            setStatus(null);
            const response = await axios.post('/login', props);
            dispatch(setLoggedIn(true))
            await mutate();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(Object.values(error.response.data.errors).flat());
            } else {
                throw error;
            }
        }
    };
    
    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        try {
            await csrf();
            setErrors([]);
            setStatus(null);
            const response = await axios.post('/forgot-password', { email });
            setStatus(response.data.status);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(Object.values(error.response.data.errors).flat());
            } else {
                throw error;
            }
        }
    };

    const resendEmailVerification = async ({ setStatus }) => {
        try {
            const response = await axios.post('/email/verification-notification');
            setStatus(response.data.status);
        } catch (error) {
            // Handle error if needed
            throw error;
        }
    };

    
    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        try {
            await csrf();
            setErrors([]);
            setStatus(null);
            const response = await axios.post('/reset-password', { token: params.token, ...props });
            navigate(`/login?reset=${btoa(response.data.status)}`);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(Object.values(error.response.data.errors).flat());
            } else {
                throw error;
            }
        }
    };
        
    const load = () => {
        // console.log((!authUser))
        return (!authUser);
    }
    
    // const load = () => {

    //     return (isLoading || !user);
    // }
    return {
        user,
        register,
        login,
        load,
        isLoading,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout
    };
};
