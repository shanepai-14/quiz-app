<Paper sx={{ width: "100%", overflow: "hidden", padding: 2 , boxShadow:1 }}>
<form
    onSubmit={handleSearchSubmit}
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
        style={{ marginRight: "10px" }}
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
</form>

<>
    <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Created At</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell>
                            {" "}
                            <CircularProgress />
                        </TableCell>
                    </TableRow>
                ) : (
                    data.data.map((classroom) => (
                        <TableRow key={classroom.id}>
                            <TableCell>
                                {classroom.id}
                            </TableCell>
                            <TableCell>
                                {classroom.name}
                            </TableCell>
                            <TableCell>
                                {classroom.created_at}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    </TableContainer>
    <TablePagination
        component="div"
        count={data.total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
    />
</>
</Paper>