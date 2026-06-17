import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Page({ page }) {
    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <Head title={page.title} />

            {/* Simple Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-orange-500 tracking-tight">Get It Moving</span>
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <main className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-8 md:p-12">
                        <div className="prose prose-indigo max-w-none 
                            prose-h1:text-[32px] prose-h1:font-bold prose-h1:text-gray-900 prose-h1:mb-8 prose-h1:pb-6 prose-h1:border-b prose-h1:border-gray-100
                            prose-h2:text-[22px] prose-h2:font-semibold prose-h2:text-gray-800 prose-h2:mt-10 prose-h2:mb-4 
                            prose-p:text-[15px] prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-5
                            prose-ul:text-[15px] prose-ul:text-gray-600 prose-ul:mb-5 prose-ul:list-disc prose-ul:pl-6
                            prose-ol:text-[15px] prose-ol:text-gray-600 prose-ol:mb-5 prose-ol:list-decimal prose-ol:pl-6
                            prose-li:mb-2
                            prose-a:text-orange-500 hover:prose-a:text-orange-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                            prose-strong:font-semibold prose-strong:text-gray-800"
                        >
                            <div dangerouslySetInnerHTML={{ __html: page.content }} />
                        </div>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
                <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Get It Moving. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
