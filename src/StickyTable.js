import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Select, TextField, MenuItem } from '@mui/material';
import { datePickerValueManager } from '@mui/x-date-pickers/DatePicker/shared';

const columns = [
    { id: 'name', label: 'Current Column Name', minWidth: 100, align: 'right' },
    { id: 'rename', label: 'Rename Column', minWidth: 200 },
    {
        id: 'datatype',
        label: 'Select Datatype', minWidth: 200
    }
];

function createData(name, rename, datatype, size) {
    return { name, rename, datatype };
}

// const rows = [
//     createData('India', 'IN', 1324171354, 3287263),
//     createData('China', 'CN', 1403500365, 9596961),
//     createData('Italy', 'IT', 60483973, 301340),
//     createData('United States', 'US', 327167434, 9833520),
//     createData('Canada', 'CA', 37602103, 9984670),
//     createData('Australia', 'AU', 25475400, 7692024),
//     createData('Germany', 'DE', 83019200, 357578),
//     createData('Ireland', 'IE', 4857000, 70273),
//     createData('Mexico', 'MX', 126577691, 1972550),
//     createData('Japan', 'JP', 126317000, 377973),
//     createData('France', 'FR', 67022000, 640679),
//     createData('United Kingdom', 'GB', 67545757, 242495),
//     createData('Russia', 'RU', 146793744, 17098246),
//     createData('Nigeria', 'NG', 200962417, 923768),
//     createData('Brazil', 'BR', 210147125, 8515767),
// ];

export default function StickyHeadTable({ rows, onDataChange }) {

    console.log("Data Change Function : ", onDataChange)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 700 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead style={{ backgroundColor: 'primary', fontWeight: 'bold' }}>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, fontWeight: 800, backgroundColor: 'darkgray' }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, rindex) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.id == 'rename' ?
                                                        <TextField
                                                            value={value}

                                                            onChange={(event) => { let newdata = { ...row, rename: event.target.value }; console.log(newdata); onDataChange(newdata, rindex) }}


                                                            variant="filled"
                                                            size='small'
                                                        />
                                                        // value
                                                        :
                                                        column.id == 'datatype' ?
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={value}
                                                                label="Datatype"
                                                                style={{ height: 40, minWidth: 100 }}
                                                                onChange={(event) => { onDataChange({ ...row, datatype: event.target.value }, rindex) }}
                                                            >
                                                                <MenuItem value={'str'}>String</MenuItem>
                                                                <MenuItem value={'float'}>Float</MenuItem>

                                                            </Select>

                                                            :
                                                            value
                                                    }
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
