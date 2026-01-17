import React from 'react';
import { useAuthStore } from '../stores/authStore';
import UserDashboard from '../components/dashboard/UserDashboard';
import AgentDashboard from '../components/dashboard/AgentDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import { LayoutDashboard } from 'lucide-react';

const DashboardPage: React.FC = () => {
    const { user } = useAuthStore();

    if (!user) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                <p className="text-slate-500">Ładowanie...</p>
            </div>
        );
    }

    const getDashboardTitle = () => {
        switch (user.role) {
            case 'ADMIN':
                return 'Panel Administratora';
            case 'AGENT':
                return 'Panel Agenta';
            default:
                return 'Mój Dashboard';
        }
    };

    const renderDashboard = () => {
        switch (user.role) {
            case 'ADMIN':
                return <AdminDashboard />;
            case 'AGENT':
                return <AgentDashboard />;
            default:
                return <UserDashboard />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <LayoutDashboard className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">{getDashboardTitle()}</h1>
                </div>
                <p className="text-slate-500">
                    Witaj, {user.firstName}! Oto przegląd Twojej aktywności.
                </p>
            </div>

            {renderDashboard()}
        </div>
    );
};

export default DashboardPage;
