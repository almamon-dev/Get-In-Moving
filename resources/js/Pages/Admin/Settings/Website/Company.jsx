import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Building2, Mail, Phone, Globe, MapPin, Hash, Briefcase, Clock, Home, Save, CheckCircle2, ChevronDown, Calendar, Trash2 } from 'lucide-react';

export default function CompanySettings() {
    const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const TIMES = [
        '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
        '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
        '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM'
    ];

    const [formData, setFormData] = useState({
        company_name: 'Almamon Softwares Ltd.',
        legal_name: 'Almamon Tech Solutions Inc.',
        established_since: '2020-01-01',
        company_email: 'hello@almamon.dev',
        company_phone: '+880 1234 567 890',
        registration_no: 'REG-2026-X990',
        tax_id: 'TAX-8822-001',
        website: 'https://almamon.dev',
        address: '123 Tech Square, Digital City, Dhaka, Bangladesh',
        is_operating_active: true,
        business_hours: [
            { from_day: 'Saturday', to_day: 'Thursday', start_time: '09:00 AM', end_time: '06:00 PM', status: 'Open' },
            { from_day: 'Friday', to_day: 'Friday', start_time: '-', end_time: '-', status: 'Closed' }
        ]
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBusinessHourChange = (index, field, value) => {
        const newHours = [...formData.business_hours];
        newHours[index][field] = value;
        setFormData(prev => ({ ...prev, business_hours: newHours }));
    };

    const toggleOperatingStatus = () => {
        setFormData(prev => ({ ...prev, is_operating_active: !prev.is_operating_active }));
    };

    const addBusinessHourRange = () => {
        setFormData(prev => ({
            ...prev,
            business_hours: [...prev.business_hours, { from_day: 'Saturday', to_day: 'Thursday', start_time: '09:00 AM', end_time: '06:00 PM', status: 'Open' }]
        }));
    };

    const removeBusinessHourRange = (index) => {
        setFormData(prev => ({
            ...prev,
            business_hours: prev.business_hours.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Company Data Saved:', formData);
        alert('Company information updated successfully!');
    };

    return (
        <AdminLayout>
            <Head title="Company Settings" />
            
            <form onSubmit={handleSubmit} className="space-y-6 pb-20">
                {/* Header & Breadcrumb */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[22px] font-bold text-[#2f3344]">Company Settings</h1>
                        <div className="flex items-center gap-2 text-[13px] text-[#727586] mt-1">
                            <Home size={14} />
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Settings</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Website</span>
                            <span className="text-[#c3c4ca]">-</span>
                            <span>Company</span>
                        </div>
                    </div>
                    <button 
                        type="submit"
                        className="bg-[#673ab7] text-white px-8 py-[10px] rounded-[6px] font-bold text-[14px] hover:bg-[#5e35b1] transition-all shadow-sm flex items-center gap-2"
                    >
                        <Save size={18} />
                        Save Company Info
                    </button>
                </div>

                {/* Basic Legal Information */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8]">
                        <div className="flex items-center gap-2">
                            <Building2 size={20} className="text-[#673ab7]" />
                            <h2 className="text-[18px] font-bold text-[#2f3344]">Legal Identity</h2>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#2f3344]">Display Name</label>
                                <input 
                                    name="company_name"
                                    type="text" 
                                    value={formData.company_name}
                                    onChange={handleInputChange}
                                    className="w-full h-[45px] px-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#2f3344]">Legal / Registered Name</label>
                                <input 
                                    name="legal_name"
                                    type="text" 
                                    value={formData.legal_name}
                                    onChange={handleInputChange}
                                    className="w-full h-[45px] px-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#2f3344]">Established Date (Start Date)</label>
                                <div className="relative">
                                    <input 
                                        name="established_since"
                                        type="date" 
                                        value={formData.established_since}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                    />
                                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#2f3344]">Registration Number</label>
                                <div className="relative">
                                    <input 
                                        name="registration_no"
                                        type="text" 
                                        value={formData.registration_no}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                    />
                                    <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#2f3344]">Tax / VAT ID</label>
                                <div className="relative">
                                    <input 
                                        name="tax_id"
                                        type="text" 
                                        value={formData.tax_id}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                    />
                                    <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#2f3344]">Website</label>
                                <div className="relative">
                                    <input 
                                        name="website"
                                        type="text" 
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                    />
                                    <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Communication & Location */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8]">
                        <div className="flex items-center gap-2">
                            <Mail size={20} className="text-[#673ab7]" />
                            <h2 className="text-[18px] font-bold text-[#2f3344]">Contact & Location</h2>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#2f3344]">Official Business Email</label>
                                <div className="relative">
                                    <input 
                                        name="company_email"
                                        type="email" 
                                        value={formData.company_email}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                    />
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#2f3344]">Business Phone</label>
                                <div className="relative">
                                    <input 
                                        name="company_phone"
                                        type="text" 
                                        value={formData.company_phone}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] pl-11 pr-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all"
                                    />
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[14px] font-bold text-[#2f3344]">Main Office Address</label>
                                <div className="relative">
                                    <textarea 
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full pl-11 pr-4 py-4 bg-white border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all resize-none min-h-[100px]"
                                    ></textarea>
                                    <MapPin size={18} className="absolute left-4 top-4 text-[#a0a3af]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Hours Section (Professional Scheduler) */}
                <div className="bg-white rounded-[10px] border border-[#e3e4e8] shadow-sm overflow-hidden">
                    <div className="px-7 py-5 border-b border-[#e3e4e8] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock size={20} className="text-[#673ab7]" />
                            <h2 className="text-[18px] font-bold text-[#2f3344]">Business Hours Schedule</h2>
                        </div>
                        <button 
                            type="button"
                            onClick={addBusinessHourRange}
                            className="text-[13px] font-bold text-[#673ab7] bg-[#f4f0ff] px-4 py-2 rounded-[6px] hover:bg-[#673ab7] hover:text-white transition-all shadow-sm flex items-center gap-2 border border-[#673ab7]/10"
                        >
                            + Add New Schedule
                        </button>
                    </div>

                    <div className="p-8">
                        {/* Live Status Toggle */}
                        <div className="flex items-center justify-between p-5 bg-[#fafbfc] rounded-[10px] border border-[#e3e4e8] mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-lg border border-[#e3e4e8] flex items-center justify-center text-[#673ab7]">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-bold text-[#2f3344]">Live Storefront Status</h4>
                                    <p className="text-[13px] text-[#727586] mt-0.5">Toggle real-time "Open/Closed" indicator for users.</p>
                                </div>
                            </div>
                            <div 
                                onClick={toggleOperatingStatus}
                                className={`w-12 h-6 rounded-full relative cursor-pointer group transition-all duration-300 ${formData.is_operating_active ? 'bg-[#673ab7]' : 'bg-[#e3e4e8]'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${formData.is_operating_active ? 'right-1' : 'left-1'}`}></div>
                            </div>
                        </div>

                        {/* Schedule List */}
                        <div className="space-y-4">
                            {formData.business_hours.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-end p-5 bg-white border border-[#e3e4e8] rounded-[10px] relative group hover:border-[#673ab7]/30 transition-all">
                                    <div className="flex-1 min-w-[180px] space-y-2">
                                        <label className="text-[11px] font-bold text-[#a0a3af] uppercase tracking-wider">From Day</label>
                                        <div className="relative">
                                            <select 
                                                value={item.from_day}
                                                onChange={(e) => handleBusinessHourChange(idx, 'from_day', e.target.value)}
                                                className="w-full h-[45px] pl-4 pr-10 bg-[#fafbfc] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all appearance-none cursor-pointer"
                                            >
                                                {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                                            </select>
                                           
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-[180px] space-y-2">
                                        <label className="text-[11px] font-bold text-[#a0a3af] uppercase tracking-wider">To Day</label>
                                        <div className="relative">
                                            <select 
                                                value={item.to_day}
                                                onChange={(e) => handleBusinessHourChange(idx, 'to_day', e.target.value)}
                                                className="w-full h-[45px] pl-4 pr-10 bg-[#fafbfc] border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all appearance-none cursor-pointer"
                                            >
                                                {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                                            </select>
                                           
                                        </div>
                                    </div>

                                    <div className="w-[140px] space-y-2">
                                        <label className="text-[11px] font-bold text-[#a0a3af] uppercase tracking-wider">Start Time</label>
                                        <div className="relative">
                                            <select 
                                                value={item.start_time}
                                                disabled={item.status === 'Closed'}
                                                onChange={(e) => handleBusinessHourChange(idx, 'start_time', e.target.value)}
                                                className={`w-full h-[45px] pl-4 pr-10 border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all appearance-none cursor-pointer ${item.status === 'Closed' ? 'bg-[#f4f7f9] text-[#a0a3af]' : 'bg-white'}`}
                                            >
                                                <option value="-">-</option>
                                                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                           
                                        </div>
                                    </div>

                                    <div className="w-[140px] space-y-2">
                                        <label className="text-[11px] font-bold text-[#a0a3af] uppercase tracking-wider">End Time</label>
                                        <div className="relative">
                                            <select 
                                                value={item.end_time}
                                                disabled={item.status === 'Closed'}
                                                onChange={(e) => handleBusinessHourChange(idx, 'end_time', e.target.value)}
                                                className={`w-full h-[45px] pl-4 pr-10 border border-[#e3e4e8] rounded-[6px] text-[14px] text-[#2f3344] focus:outline-none focus:border-[#673ab7] transition-all appearance-none cursor-pointer ${item.status === 'Closed' ? 'bg-[#f4f7f9] text-[#a0a3af]' : 'bg-white'}`}
                                            >
                                                <option value="-">-</option>
                                                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                           
                                        </div>
                                    </div>

                                    <div className="w-[120px] space-y-2">
                                        <label className="text-[11px] font-bold text-[#a0a3af] uppercase tracking-wider">Status</label>
                                        <div className="relative">
                                            <select 
                                                value={item.status}
                                                onChange={(e) => handleBusinessHourChange(idx, 'status', e.target.value)}
                                                className={`w-full h-[45px] pl-4 pr-10 border rounded-[6px] text-[13px] font-bold focus:outline-none transition-all appearance-none cursor-pointer ${item.status === 'Open' ? 'text-[#00b090] bg-[#00b090]/5 border-[#00b090]/10' : 'text-[#f43f5e] bg-[#f43f5e]/5 border-[#f43f5e]/10'}`}
                                            >
                                                <option value="Open">Open</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a3af] pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="mb-[2px]">
                                        <button 
                                            type="button"
                                            onClick={() => removeBusinessHourRange(idx)}
                                            className={`w-[42px] h-[42px] flex items-center justify-center rounded-[6px] bg-[#f43f5e]/5 text-[#f43f5e] hover:bg-[#f43f5e] hover:text-white transition-all ${formData.business_hours.length === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                                            disabled={formData.business_hours.length === 1}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
