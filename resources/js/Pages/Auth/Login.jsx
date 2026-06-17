import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Log in</h1>
                <p className="text-gray-600 dark:text-gray-400">Enter your credentials to access your account</p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            {/* Demo Credentials Section */}
            <div className="mb-6 flex justify-center">
                <button
                    type="button"
                    onClick={() => setData({ ...data, email: 'admin@getitmoving.com', password: 'admin123' })}
                    className="flex flex-col items-center justify-center p-3 px-8 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 hover:bg-[#673de6] hover:text-white dark:bg-gray-800 dark:hover:bg-[#673de6] transition-all group shadow-sm"
                >
                    <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-white">Admin Credentials</span>
                    <span className="text-[11px] text-gray-500 group-hover:text-purple-200 mt-1">Click to auto-fill</span>
                </button>
            </div>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">OR</span>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email Address" className="mb-1" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-gray-300 focus:border-[#673de6] focus:ring-[#673de6] shadow-none"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="name@email.com"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                   
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-gray-300 focus:border-[#673de6] focus:ring-[#673de6] shadow-none"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

               

                <div className="pt-2">
                    <PrimaryButton
                        className="w-full justify-center py-3 bg-[#673de6] hover:bg-[#5231b8] active:bg-[#4529a3] text-white font-bold text-base rounded-lg transition-all shadow-lg shadow-purple-200 dark:shadow-none uppercase tracking-normal"
                        disabled={processing}
                    >
                        Log in
                    </PrimaryButton>
                </div>
            </form>

           
        </GuestLayout>
    );
}

