import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-gray-500 text-sm mb-4 md:mb-0">
                        &copy; {currentYear} Restaurant Coupon Manager. All rights reserved.
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-500 hover:text-gray-700">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-700">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;