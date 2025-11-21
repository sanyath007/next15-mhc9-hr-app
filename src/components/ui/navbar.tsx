"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { logout } from '@/actions/logout';

type MenuItem = {
    label: string;
    link?: string;
    submenu?: MenuItem[];
};

const Navbar = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        await logout();

        // router.push('/login');
    };

    const menuItems: MenuItem[] = [
        {
            label: 'หน้าหลัก',
            link: "/dashboard"
        },
        {
            label: 'ลงเวลา',
            submenu: [
                { label: 'ลงเวลาปฏิบัติงาน', link: '/check-in' },
                { label: 'การลงเวลาประจำวัน', link: '/attendance' },
                // {
                //     label: 'Services',
                //     submenu: [
                //         { label: 'Consulting', link: '#' },
                //         { label: 'Support', link: '#' },
                //         { label: 'Training', link: '#' }
                //     ]
                // }
            ]
        },
        {
            label: 'บุคลากร',
            submenu: [
                { label: 'รายการบุคลากร', link: '/employee/list' },
                { label: 'ลงทะเบียนใบหน้า', link: 'employee/register' },
                // { label: 'Individual', link: '#' }
            ]
        },
        // {
        //     label: 'Resources',
        //     submenu: [
        //         { label: 'Documentation', link: '#' },
        //         { label: 'Blog', link: '#' },
        //         {
            //         label: 'Support',
            //         submenu: [
            //             { label: 'Help Center', link: '#' },
            //             { label: 'Community', link: '#' },
            //             { label: 'Contact Us', link: '#' }
            //         ]
        //         }
        //     ]
        // }
    ];

    const handleDropdownToggle = (index: number) => {
        setOpenDropdown(openDropdown === index ? null : index);
        setOpenSubmenu(null);
    };

    const handleSubmenuToggle = (index: number) => {
        setOpenSubmenu(openSubmenu === index ? null : index);
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Organization Name */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">A</span>
                        </div>
                        <span className="text-xl font-semibold text-gray-800">Acme Corporation</span>
                    </div>

                    {/* Navigation Menu */}
                    <div className="flex items-center space-x-8">
                        <div className="flex space-x-1 relative">
                            {menuItems.map((item, index) => (
                                <div key={index} className="relative">
                                    {item.submenu ? (
                                        <button
                                            onClick={() => handleDropdownToggle(index)}
                                            className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200 flex items-center"
                                        >
                                            {item.label}
                                                <svg
                                                    className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                                                        openDropdown === index ? 'rotate-180' : ''
                                                    }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                        </button>
                                    ) : (
                                        <Link
                                            href={new URL(item.link || '#', 'http://localhost').pathname}
                                            className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200 flex items-center"
                                        >
                                            {item.label}
                                        </Link>
                                    )}

                                    {/* Dropdown Menu */}
                                    {item.submenu && openDropdown === index && (
                                        <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                                            <div className="py-1">
                                                {item.submenu && item.submenu.map((subitem, subIndex) => (
                                                    <div key={subIndex} className="relative">
                                                        {subitem.submenu ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleSubmenuToggle(subIndex)}
                                                                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between"
                                                                >
                                                                    {subitem.label}
                                                                    <svg
                                                                        className="w-4 h-4"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                    </svg>
                                                                </button>

                                                                {/* Submenu */}
                                                                {openSubmenu === subIndex && (
                                                                <div className="absolute left-full top-0 ml-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                                                                    <div className="py-1">
                                                                        {subitem.submenu.map((nestedItem, nestedIndex) => (
                                                                            <a
                                                                                key={nestedIndex}
                                                                                href={nestedItem.link}
                                                                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                                                            >
                                                                                {nestedItem.label}
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <a
                                                                href={subitem.link}
                                                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                                            >
                                                                {subitem.label}
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* User Avatar */}
                        <div className="relative">
                            <button
                                onMouseEnter={() => setShowUserMenu(true)}
                                onMouseLeave={() => setShowUserMenu(false)}
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold hover:shadow-lg transition-shadow duration-200"
                            >
                                {session?.user?.image}
                            </button>

                            {/* User Menu Popup */}
                            {showUserMenu && (
                                <div
                                    onMouseEnter={() => setShowUserMenu(true)}
                                    onMouseLeave={() => setShowUserMenu(false)}
                                    className="absolute right-0 mt-0 w-64 bg-white rounded-lg shadow-xl z-50 border border-gray-200"
                                >
                                    <div className="p-4 border-b border-gray-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                {session?.user?.image}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-800">{session?.user?.name}</div>
                                                <div className="text-sm text-gray-500">{session?.user?.email}</div>
                                            </div>
                                        </div>
                                        <div className="mt-2 inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            {session?.user?.role}
                                        </div>
                                    </div>
                                    <div className="py-1">
                                        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            My Profile
                                        </a>
                                        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Settings
                                        </a>
                                        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Help & Support
                                        </a>
                                    </div>
                                    <div className="border-t border-gray-200">
                                        <a
                                            href="#"
                                            onClick={handleLogout}
                                            className="block px-4 py-2 text-red-600 hover:bg-red-50 flex items-center"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;