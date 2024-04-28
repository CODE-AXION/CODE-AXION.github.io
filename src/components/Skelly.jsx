import { Skeleton } from '@mui/material';
import React from 'react';

const Skelly = ({ loading }) => {

    if (loading) return (
        <main>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                <div className='flex items-center gap-4'>
                    <div>
                        <Skeleton variant="rectangular" width={510} height={60} />
                        <Skeleton variant="rectangular" width={510} height={60} />
                    </div>
                    <div>
                        <Skeleton variant="rectangular" width={510} height={60} />
                        <Skeleton variant="rectangular" width={510} height={60} />
                    </div>
                    <div>
                        <Skeleton variant="rectangular" width={150} height={60} />
                        <Skeleton variant="rectangular" width={150} height={60} />
                    </div>
                </div>
                <div className='mt-5 flex items-center'>
                    <div>
                        <Skeleton variant="rectangular" width={510} height={60} />
                        <Skeleton variant="rectangular" width={510} height={60} />
                    </div>
                    <div>
                        <Skeleton variant="rectangular" width={510} height={60} />
                        <Skeleton variant="rectangular" width={510} height={60} />
                    </div>
                    <div>
                        <Skeleton variant="rectangular" width={180} height={60} />
                        <Skeleton variant="rectangular" width={180} height={60} />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Skelly;
