import React from 'react';

interface Tenant {
    id: number;
    namaTenant: string;
}

const Table: React.FC = () => {
    const data: Tenant[] = [
        { id: 1, namaTenant: 'Tenant A' },
        { id: 2, namaTenant: 'Tenant B' },
        { id: 3, namaTenant: 'Tenant C' }
    ];

    const handleAction = (id: number): void => {
        alert(`Action for tenant with ID: ${id}`);
    };

    return (
        <React.Fragment>
            <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">No</th>
                        <th className="border border-gray-300 px-4 py-2">Nama Tenant</th>
                        <th className="border border-gray-300 px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((tenant, index) => (
                        <tr key={tenant.id}>
                            <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                            <td className="border border-gray-300 px-4 py-2">{tenant.namaTenant}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    className="bg-blue-500 text-white px-4 py-1 rounded"
                                    onClick={() => handleAction(tenant.id)}
                                >
                                    Action
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </React.Fragment>
    );
};

export default Table;
