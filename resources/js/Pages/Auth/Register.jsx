import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const [showModal, setShowModal] = useState(false);
    const [supplierAgreed, setSupplierAgreed] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        user_type: 'customer',
        terms: false,
    });

    const submit = (e) => {
        e.preventDefault();

        // If it's a supplier and they haven't agreed via modal yet
        if (data.user_type === 'supplier' && !supplierAgreed) {
            setShowModal(true);
            return;
        }

        executeRegister();
    };

    const executeRegister = () => {
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const handleSupplierAgree = () => {
        setSupplierAgreed(true);
        setData('terms', true);
        setShowModal(false);
        
        // Use setTimeout to ensure state update has processed before submitting
        setTimeout(() => {
            post(route('register'), {
                onFinish: () => reset('password', 'password_confirmation'),
            });
        }, 100);
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="user_type" value="Account Type" />
                    <select
                        id="user_type"
                        name="user_type"
                        value={data.user_type}
                        onChange={(e) => {
                            setData('user_type', e.target.value);
                            setSupplierAgreed(false);
                            if (e.target.value === 'supplier') {
                                setData('terms', false);
                            }
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    >
                        <option value="customer">Customer</option>
                        <option value="supplier">Supplier / Transporter</option>
                    </select>
                    <InputError message={errors.user_type} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                {data.user_type === 'customer' && (
                    <div className="mt-4 block">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="terms"
                                checked={data.terms}
                                onChange={(e) => setData('terms', e.target.checked)}
                                className="rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
                                required={data.user_type === 'customer'}
                            />
                            <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                                I agree to the{' '}
                                <a target="_blank" href="/terms-and-conditions" className="underline text-sm text-gray-600 hover:text-gray-900">Terms of Service</a>
                                {' '}and{' '}
                                <a target="_blank" href="/privacy-policy" className="underline text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a>
                            </span>
                        </label>
                        <InputError message={errors.terms} className="mt-2" />
                    </div>
                )}

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Create Account
                    </PrimaryButton>
                </div>
            </form>

            {/* Supplier Agreement Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Supplier Agreement</h2>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 text-sm text-gray-700 space-y-3 h-64 overflow-y-auto">
                            <p><strong>Welcome to Get It Moving!</strong></p>
                            <p>As a supplier/transporter on our platform, you agree to the following conditions:</p>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>You must provide accurate verification documents including valid ID and transport licenses.</li>
                                <li>You are responsible for the safe and timely delivery of goods assigned to you.</li>
                                <li>All payments are processed securely through the platform. Direct payments outside the platform are strictly prohibited.</li>
                                <li>You must maintain an active subscription plan to receive new job requests.</li>
                                <li>You have read and accepted our full <a target="_blank" href="/terms-and-conditions" className="text-indigo-600 underline">Terms and Conditions</a> and <a target="_blank" href="/privacy-policy" className="text-indigo-600 underline">Privacy Policy</a>.</li>
                            </ol>
                        </div>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSupplierAgree}
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                            >
                                I Agree & Register
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </GuestLayout>
    );
}
