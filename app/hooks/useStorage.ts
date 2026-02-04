import { useState, useEffect } from 'react';

/**
 * Custom hook to manage data persistence in localStorage.
 * @param key The key under which the data is stored in localStorage.
 * @param initialData The initial data to use if no data is found in localStorage.
 * @returns An array containing the current data and a function to update it.
 */
export function useStorage<T>(key: string, initialData: T) {
    const [data, setData] = useState<T>(initialData);


    useEffect(() => {
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                setData(JSON.parse(saved));
            } catch (e) {
                console.error(`Error parsing localStorage key "${key}":`, e);
                setData(initialData);
            }
        } else {
            setData(initialData);
            localStorage.setItem(key, JSON.stringify(initialData));
        }
    }, [key, initialData]);

    const updateData = (newData: T) => {
        setData(newData);
        localStorage.setItem(key, JSON.stringify(newData));
    };

    return [data, updateData] as const;
}
