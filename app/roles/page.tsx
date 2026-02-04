"use client";

import React from 'react';
import Link from 'next/link';

interface Role {
    code: string;
    name: string;
    description: string;
}

const mockRoles: Role[] = [
    {
        code: "ADMIN_ROOT",
        name: "Administrador Root",
        description: "Acceso total a todas las funciones del sistema, incluyendo gestión de usuarios y roles."
    },
    {
        code: "PERM_VIEW_USERS",
        name: "VER_USUARIOS",
        description: "Permiso para visualizar la lista de usuarios en la plataforma."
    },
    {
        code: "PERM_CREATE_ROLE",
        name: "CREAR_ROL",
        description: "Permiso para crear y configurar nuevos roles en la plataforma."
    },
    {
        code: "USER_STANDARD",
        name: "Usuario Estándar",
        description: "Acceso básico a las funcionalidades de la aplicación como usuario final."
    }
];

export default function RolesPage() {
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Roles</h1>
                        <p className="text-slate-500 mt-2">Define y administra los perfiles de acceso y sus descripciones.</p>
                    </div>
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center transition-colors">
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
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Código</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Nombre</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Descripción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {mockRoles.map((role) => (
                                    <tr key={role.code} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <code className="text-[12px] font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100">
                                                {role.code}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-slate-900">{role.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 max-w-md">
                                            {role.description}
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
