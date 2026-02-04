"use client";

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import Modal from '@/app/components/modal/Modal';
import permissions from '@/data/permissions.json';
import mockRoles from '@/data/mockRoles.json';
import { useStorage } from '@/app/hooks/useStorage';

interface Role {
    code: string;
    name: string;
    description: string;
    permissions: string[];
}

interface RoleFormData {
    code: string;
    name: string;
    description: string;
    permissions: string[];
}

export default function RolesPage() {
    const [roles, setRoles] = useStorage<Role[]>('app_roles', mockRoles);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<RoleFormData>({
        defaultValues: {
            code: '',
            name: '',
            description: '',
            permissions: []
        }
    });

    const watchedName = watch("name");
    const watchedCode = watch("code");

    // Autogenerar código en tiempo real con validación de unicidad
    React.useEffect(() => {
        if (watchedName) {
            const baseCode = watchedName
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '_')
                .replace(/[^A-Z0-9_]/g, '');

            let finalCode = baseCode;
            let counter = 1;

            // Verificar unicidad en tiempo real
            while (roles.some(r => r.code === finalCode)) {
                finalCode = `${baseCode}_${counter}`;
                counter++;
            }
            console.log(finalCode)

            setValue("code", finalCode);
        } else {
            setValue("code", "");
        }
    }, [watchedName, setValue, roles]);

    const onSubmit = (data: RoleFormData) => {

        let finalCode = data.code;
        let counter = 1;
        while (roles.some(r => r.code === finalCode)) {
            finalCode = `${data.code}_${counter}`;
            counter++;
        }

        const newRole: Role = {
            code: finalCode,
            name: data.name,
            description: '',
            permissions: data.permissions
        };

        setRoles([...roles, newRole]);
        setIsModalOpen(false);
        reset();
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver al Inicio
                        </Link>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Gestión de Roles</h1>
                        <p className="text-slate-500 mt-2 text-lg">Define y administra los perfiles de acceso.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Nuevo Rol
                    </button>
                </header>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        reset();
                    }}
                    title="Crear Nuevo Rol"
                    onSave={handleSubmit(onSubmit)}
                    onCancel={() => {
                        setIsModalOpen(false);
                        reset();
                    }}
                    saveLabel="Guardar Rol"
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Código */}
                        <div className="flex items-center gap-4">
                            <label className="w-24 text-sm font-bold text-slate-700 text-right">Código:</label>
                            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 bg-slate-100/80 select-none transition-colors border-dashed">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                <span className={`text-sm font-mono font-bold tracking-wider ${watchedCode ? 'text-indigo-600' : 'text-slate-400 italic'}`}>
                                    {watchedCode || "Autogenerado..."}
                                </span>
                                <input type="hidden" {...register("code")} />
                            </div>
                        </div>

                        {/* Nombre */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-4">
                                <label className="w-24 text-sm font-bold text-slate-700 text-right">Nombre:</label>
                                <input
                                    {...register("name", {
                                        required: "El nombre es obligatorio",
                                        maxLength: { value: 30, message: "El nombre no puede exceder los 30 caracteres" },
                                        pattern: {
                                            value: /^[a-zA-Z0-9 ]+$/,
                                            message: "Solo caracteres alfanuméricos, máx. 30"
                                        },
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                            e.target.value = e.target.value.toUpperCase();
                                        }
                                    })}
                                    type="text"
                                    className={`flex-1 px-3 py-2 rounded-md border ${errors.name ? 'border-red-400' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all uppercase text-sm`}
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-500 font-medium pl-28">{errors.name.message}</p>}
                        </div>

                        {/* Permisos */}
                        <div className="space-y-2">
                            <div className="flex items-start gap-4">
                                <label className="w-24 text-sm font-bold text-slate-700 text-right pt-2">Permisos:</label>
                                <div className="flex-1 border border-slate-200 rounded-md overflow-hidden bg-white">
                                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                                        {permissions.map((perm) => (
                                            <label key={perm.code} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 cursor-pointer transition-colors group">
                                                <input
                                                    type="checkbox"
                                                    value={perm.code}
                                                    {...register("permissions", {
                                                        validate: (val: string[]) => val.length > 0 || "Debe seleccionar al menos un permiso"
                                                    })}
                                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="text-xs font-mono font-bold text-slate-500 shrink-0 uppercase tracking-tighter">
                                                    {perm.code}
                                                </span>
                                                <span className="text-[11px] font-bold text-slate-700 uppercase">
                                                    {perm.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {errors.permissions && <p className="text-xs text-red-500 font-medium pl-28">{errors.permissions.message}</p>}
                        </div>
                    </form>
                </Modal>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-bottom border-slate-200">
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Código</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Nombre</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Descripción</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Permisos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {roles.map((role) => (
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
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {role.permissions?.map(p => (
                                                    <span key={p} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200">
                                                        {p}
                                                    </span>
                                                ))}
                                                {(!role.permissions || role.permissions.length === 0) && (
                                                    <span className="text-xs text-slate-400">Sin permisos</span>
                                                )}
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
