import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Paper, Button, Checkbox, Toolbar, Typography, IconButton, Tooltip
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
    setChangePage,
    onClickButton,
    buttonName,
    withActions = true, // New prop to toggle actions
    onEdit, // New prop for edit handler
    onDelete // New prop for delete handler
}) => {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState([]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
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
        event.stopPropagation(); // Prevent row click when clicking checkbox
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

    const handleEdit = (event, row) => {
        event.stopPropagation(); // Prevent row click
        onEdit(row);
    };

    const handleDelete = (event, row) => {
        event.stopPropagation(); // Prevent row click
        onDelete(row);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatYearLevel = (value) => {
        switch(value) {
            case 1: return '1st Year';
            case 2: return '2nd Year';
            case 3: return '3rd Year';
            case 4: return '4th Year';
            case 11: return 'Grade 11';
            case 12: return 'Grade 12';
            default: return value;
        }
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
                    placeholder="Search..."
                    value={search}
                    onChange={handleSearchChange}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            onSearch(event.target.value);
                        }
                    }}
                    startAdornment={
                        <InputAdornment position="start">
                            <Iconify
                                onClick={() => onSearch(search)}
                                icon="eva:search-fill"
                                sx={{
                                    color: "text.disabled",
                                    width: 20,
                                    height: 20,
                                    cursor: "pointer"
                                }}
                            />
                        </InputAdornment>
                    }
                />
                <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={onClickButton}
                >
                    {buttonName}
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
                            {withActions && (
                                <TableCell align="right">Actions</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => {
                            const isItemSelected = selected.indexOf(row.id) !== -1;
                            return (
                                <TableRow
                                    hover
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
                                            onClick={(event) => handleCheckboxClick(event, row.id)}
                                        />
                                    </TableCell>
                                    {columns.map((column) => (
                                        <TableCell key={column.id}>
                                            {column.id === 'created_at' 
                                                ? formatDate(row[column.id])
                                                : column.id === 'year_level'
                                                ? formatYearLevel(row[column.id])
                                                : row[column.id]
                                            }
                                        </TableCell>
                                    ))}
                                    {withActions && (
                                        <TableCell align="right">
                                            <Tooltip title="Edit">
                                                <IconButton 
                                                    onClick={(event) => handleEdit(event, row)}
                                                    size="small"
                                                >
                                                    <Iconify icon="eva:edit-fill" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton 
                                                    onClick={(event) => handleDelete(event, row)}
                                                    size="small"
                                                    color="error"
                                                >
                                                    <Iconify icon="eva:trash-2-outline" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    )}
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