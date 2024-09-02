import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import DynamicTable from '@/Components/tables/DynamicTable';

const Classroom = ({ auth }) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRow] = useState(10);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [total, setTotal] = useState(0);

    const columns = [
        { id: 'name', label: 'Name' },
        { id: 'created_at', label: 'Created At' },
    ];

    useEffect(() => {
        fetchClassrooms('');
    }, [page, rowsPerPage]);

    const fetchClassrooms = (search) => {
        setLoading(true);
        axios.get(route('get_classrooms'), {
            params: {search: search, page: page + 1, per_page: rowsPerPage },
            headers: {
                'Accept': 'application/json',
            },
        })
        .then((response) =>  {
            console.log(response.data)
            setData(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            setLoading(false);
        });
    };
    const handleSearch = (search) => {
        fetchClassrooms(search);
    };

    const handleSelect = (selected) => {
        setSelectedIds(selected);
        console.log('Selected IDs:', selected);
    };



    return (
        <AuthenticatedLayout>
            <Head title="Classroom" />
            <DynamicTable
                columns={columns}
                data={data.data ?? []}
                onSearch={handleSearch}
                onSelect={handleSelect}
                rowsPerPage={rowsPerPage}
                rowPageCount={total}
                currentPage={page}
                setRowsPerPage={setRow}
                setChangePage={setPage}
            />
        </AuthenticatedLayout>
    );
}

export default Classroom