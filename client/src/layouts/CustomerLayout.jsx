import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const CustomerLayout = () => {
    return (
        <div className="min-h-screen bg-[#FAFAFA] overflow-x-hidden">
            <main>
                <Outlet />
            </main>
        </div>
    );
};
export default CustomerLayout;
