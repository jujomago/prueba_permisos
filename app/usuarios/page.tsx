"use client";

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import Modal from '@/app/components/modal/Modal';
import mockUsers from '@/data/mockUsers.json';
import mockRoles from '@/data/mockRoles.json';
import { useStorage } from '@/app/hooks/useStorage';

interface User {
    id: string;
    email: string;
    status: 'active' | 'inactive';
    roles: string[];
}

interface UserFormData {
    email: string;
    status: 'active' | 'inactive';
    roles: string[];
}

export default function UsuariosPage() {

    const [users, setUsers] = useStorage<User[]>('app_users', mockUsers as User[]);
    const [availableRoles] = useStorage<{ code: string, name: string }[]>('app_roles', mockRoles);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({
        defaultValues: {
            email: '',
            status: 'inactive',
            roles: []
        }
    });

    const onSubmit = (data: UserFormData) => {
        const emailList = data.email.split(',').map(e => e.trim()).filter(e => e !== '');

        const newUsers: User[] = emailList.map((email, index) => ({
            id: (Date.now() + index).toString(),
            email,
            status: data.status,
            roles: data.roles
        }));

        setUsers([...users, ...newUsers]);
        setIsModalOpen(false);
        reset();
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver al Inicio
                        </Link>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Gestión de Usuarios</h1>
                        <p className="text-slate-500 mt-2 text-lg">Administra los usuarios del sistema y sus permisos asociados.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Nuevo Usuario
                    </button>
                </header>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        reset();
                    }}
                    title="Crear Nuevo Usuario"
                    onSave={handleSubmit(onSubmit)}
                    onCancel={() => {
                        setIsModalOpen(false);
                        reset();
                    }}
                    saveLabel="Crear Usuario"
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Correo(s) Electrónico(s)</label>
                            <input
                                {...register("email", {
                                    required: "El correo es obligatorio",
                                    validate: (value) => {
                                        const emails = value.split(',').map(e => e.trim()).filter(e => e !== '');
                                        if (emails.length === 0) return "El correo es obligatorio";
                                        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                                        const invalidEmails = emails.filter(email => !emailRegex.test(email));
                                        return invalidEmails.length === 0 || `Correos inválidos: ${invalidEmails.join(', ')}`;
                                    }
                                })}
                                type="text"
                                placeholder="usuario1@ejemplo.com, usuario2@ejemplo.com"
                                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            />
                            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                            <p className="text-[10px] text-slate-400 italic">Puedes ingresar varios correos separados por comas.</p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 block">Asignar Roles <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {availableRoles.map((role) => (
                                    <label key={role.code} className="flex items-center gap-2 p-3 border border-slate-100 rounded-xl hover:bg-blue-50/50 cursor-pointer transition-colors group">
                                        <input
                                            type="checkbox"
                                            value={role.code}
                                            {...register("roles", {
                                                validate: (val) => val.length > 0 || "Debe asignar al menos un rol"
                                            })}
                                            className="w-5 h-5 mr-2 text-blue-600 rounded-lg border-slate-300 focus:ring-blue-500"
                                        />
                                        <div className="flex items-center flex-col gap-0">
                                            <span className="text-sm font-medium text-slate-600 group-hover:text-blue-700 transition-colors">{role.name}</span><span className="text-[10px] text-slate-400">({role.code})</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.roles && <p className="text-xs text-red-500 font-medium mt-1">{errors.roles.message}</p>}
                        </div>
                    </form>
                </Modal>

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
                                {users.map((user) => (
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
                                                'bg-rose-100 text-rose-700'
                                                }`}>
                                                {user.status === 'active' ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <div className="flex flex-wrap gap-2">
                                                {user.roles.map((role) => (
                                                    <span key={role} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 text-[10px] font-bold uppercase tracking-wider">
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-10 text-center text-slate-500 italic">
                                            No hay usuarios registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
