import React, { useEffect, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import DynamicTable from '@/Components/tables/DynamicTable';
import ClassroomModal from './ClassroomModal';


const Classroom = ({ auth }) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRow] = useState(10);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [total, setTotal] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    


    const columns = [
        { id: 'name', label: 'Name' },
        { id: 'room_code', label: 'Room code' },
        { id: 'created_at', label: 'Created At' },
    ];

    useEffect(() => {
        fetchClassrooms('');
    }, [page, rowsPerPage]);

    const fetchClassrooms = (search) => {
        setLoading(true);
        axios.get(route('get_classrooms'), {
            params: { search, page: page + 1, per_page: rowsPerPage },
            headers: { 'Accept': 'application/json' },
        })
        .then((response) => {
            setData(response.data);
            setTotal(response.data.total);
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

    const handleOpenModal = () => {
        setModalOpen(true);
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
                onClickButton={handleOpenModal}
                buttonName={'New Classroom'}
            />

            <ClassroomModal
              open={modalOpen}
              handleClose={() => setModalOpen(false)}
            />
        </AuthenticatedLayout>
    );
}

export default Classroom;
