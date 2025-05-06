import React from 'react';
import { Card } from "flowbite-react";
import { LuCircleUserRound, LuPhone, LuMail } from "react-icons/lu";

const ProfileInfoCard = ({ nama, no_telp, email }) => {
    return (
        <Card className="md:col-span-1">
            <div className="pb-1">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            </div>
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <LuCircleUserRound className='text-green-500' />
                    <div>
                        <span className="text-sm font-medium text-gray-500">Nama</span>
                        <p className="text-base text-gray-900 font-medium">{nama}</p>
                    </div>
                </div>
                <div className="border-t border-gray-200"></div>
                <div className="flex items-center space-x-3">
                    <LuPhone className='text-green-500' />
                    <div>
                        <span className="text-sm font-medium text-gray-500">Nomor Telepon</span>
                        <p className="text-base text-gray-900 font-medium">{no_telp}</p>
                    </div>
                </div>
                <div className="border-t border-gray-200"></div>
                <div className="flex items-center space-x-3">
                    <LuMail className='text-green-500' />
                    <div>
                        <span className="text-sm font-medium text-gray-500">Alamat Email</span>
                        <p className="text-base text-gray-900 font-medium">{email}</p>
                    </div>
                </div>
            </div>
            <div className='h-full'></div>
        </Card>
    );
};

export default ProfileInfoCard;