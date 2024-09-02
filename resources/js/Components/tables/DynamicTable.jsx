// resources/js/Components/DynamicTable.jsx

import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Paper, Button, Checkbox, Toolbar, Typography
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Iconify from '@/Components/iconify';
const DynamicTable = ({ 
    columns, 
    data, 
    onSearch, 
    onSelect, 
    rowsPerPage, 
    rowPageCount, 
    currentPage, 
    setRowsPerPage, 
    setChangePage 
}) => {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState([]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        onSearch(event.target.value);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = data.map((n) => n.id);
            setSelected(newSelected);
            onSelect(newSelected);
            return;
        }
        setSelected([]);
        onSelect([]);
    };

    const handleCheckboxClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
        onSelect(newSelected);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
            <Toolbar
             style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
          }}
            >

                    <OutlinedInput
                placeholder="Search user..."
                value={search}
                onChange={handleSearchChange}
                startAdornment={
                    <InputAdornment position="start">
                        <Iconify
                            icon="eva:search-fill"
                            sx={{
                                color: "text.disabled",
                                width: 20,
                                height: 20,
                            }}
                        />
                    </InputAdornment>
                }
            />
            <Button
                variant="contained"
                color="inherit"
                startIcon={<Iconify icon="eva:plus-fill" />}
            >
                New Classroom
            </Button>
            </Toolbar>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={selected.length > 0 && selected.length < data.length}
                                    checked={data.length > 0 && selected.length === data.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
                            {columns.map((column) => (
                                <TableCell key={column.id}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage).map((row) => {
                            const isItemSelected = selected.indexOf(row.id) !== -1;
                            return (
                                <TableRow
                                    hover
                                    onClick={(event) => handleCheckboxClick(event, row.id)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.id}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                        />
                                    </TableCell>
                                    {columns.map((column) => (
                                        <TableCell key={column.id}>
                                            {row[column.id]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={rowPageCount}
                page={currentPage}
                onPageChange={(event, newPage) => setChangePage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
            />
        </Paper>
    );
};

export default DynamicTable;
