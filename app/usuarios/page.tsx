"use client";

import React from 'react';
import Link from 'next/link';

interface User {
    id: string;
    email: string;
    status: 'active' | 'inactive' | 'pending';
    roles: string[];
}

const mockUsers: User[] = [
    {
        id: '1',
        email: 'admin@sistema.com',
        status: 'active',
        roles: ['Administrador', 'Soporte'],
    },
    {
        id: '2',
        email: 'juan.perez@empresa.com',
        status: 'active',
        roles: ['Usuario'],
    },
    {
        id: '3',
        email: 'maria.garcia@ventas.com',
        status: 'inactive',
        roles: ['Vendedor'],
    },
    {
        id: '4',
        email: 'soporte.tecnico@it.com',
        status: 'pending',
        roles: ['Soporte'],
    },
];

export default function UsuariosPage() {
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Usuarios</h1>
                        <p className="text-slate-500 mt-2">Administra los usuarios del sistema y sus permisos asociados.</p>
                    </div>
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver al Inicio
                    </Link>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-bottom border-slate-200">
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Correo Electrónico</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Estado</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Roles</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {mockUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                                    {user.email[0].toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-slate-900">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                                user.status === 'inactive' ? 'bg-rose-100 text-rose-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                {user.status === 'active' ? 'Activo' :
                                                    user.status === 'inactive' ? 'Inactivo' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <div className="flex flex-wrap gap-2">
                                                {user.roles.map((role) => (
                                                    <span key={role} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 text-[11px] font-semibold uppercase tracking-wider">
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
