import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Select as OSelect, TextField, MenuItem, Alert } from '@mui/material';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { datePickerValueManager } from '@mui/x-date-pickers/DatePicker/shared';
import { Button, Container } from '@material-ui/core';

const columns = [
    { id: 'sn', label: '#SN', minWidth: 20 },
    { id: 'type', label: 'Column Type', minWidth: 200 },
    { id: 'name', label: 'Current Column Name', minWidth: 100, align: 'right' },
    { id: 'rename', label: 'Rename Column', minWidth: 200 },
    {
        id: 'datatype',
        label: 'Select Datatype', minWidth: 100
    },
    { id: 'remove', label: '', minWidth: 100, align: 'right' },

];

function createData(type, name, rename, datatype, size) {
    return { type, name, rename, datatype };
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

export default function StickyHeadTable({ onDataChange, setRows, firstoptions, rows }) {

    // console.log("Data Change Function : ", onDataChange)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const animatedComponents = makeAnimated();
    const [options, setOptions] = React.useState(firstoptions)

    // const [rows, setRows] = React.useState(defaultRows)

    function searchArray(array, key, value) {
        let obj = array.findIndex(o => o[key] === value);
        console.log(obj);
        return obj
    }
    const ColumnTypes = [
        { value: "Resource Column", label: "Resource Column" },
        { value: "Activity Type Column", label: "Activity Type Column" },
        { value: "Objective Function Column", label: "Objective Function Column" },
    ]


    const handleAddRow = () => {
        const item = { sn: "", type: "", name: "", rename: '', datatype: '', remove: '' };
        const newRows = [...rows, item];

        console.log("New Rows : ", newRows)
        setRows(newRows);
    };

    const handleRemoveRow = () => {
        setRows(rows.slice(0, -1));
    };

    const handleRemoveSpecificRow = (id) => {
        const newRows = [...rows]
        newRows.splice(id, 1)
        console.log("New Rows Delete: ", newRows)

        setRows(newRows)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChange = (id, value, name) => {
        const newRows = [...rows];
        newRows[id] = {
            ...newRows[id], [name]: value
        };

        if (name == 'name') {

            let newOptions = [...options]

            let op = searchArray(options, 'value', value.value)

            if (op != -1) {
                newOptions.splice(op, 1)
                setOptions(newOptions)
            }
        }

        console.log("row", newRows[id])

        setRows(newRows);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Alert style={{ margin: 20 }} severity="warning">Make sure to scroll across table pages and set appropriate names and datatypes to ALL EMPTY columns</Alert>
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
                                const rowindex = page * rowsPerPage + rindex;
                                if (row.type == "Default Column") {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={rowindex}>
                                            {columns.map((column) => {
                                                const value = row[column.id];

                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {
                                                            column.id == 'sn' ?
                                                                rowindex + 1
                                                                :
                                                                value
                                                        }
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                }
                                else {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={rowindex}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                const name = column.id

                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {

                                                            column.id == 'rename' ?
                                                                <TextField
                                                                    value={value}
                                                                    onChange={(event) => handleChange(rowindex, event.target.value, name)}
                                                                    variant="filled"
                                                                    size='small'
                                                                />
                                                                // value
                                                                :
                                                                column.id == 'datatype' ?
                                                                    <OSelect
                                                                        labelId="demo-simple-select-label"
                                                                        id="demo-simple-select"
                                                                        value={value}
                                                                        style={{ height: 40, minWidth: 100 }}
                                                                        onChange={(event) => handleChange(rowindex, event.target.value, name)}

                                                                    >
                                                                        <MenuItem value={''}>--Select--</MenuItem>
                                                                        <MenuItem value={'str'}>String</MenuItem>
                                                                        <MenuItem value={'float'}>Float</MenuItem>

                                                                    </OSelect>

                                                                    :
                                                                    column.id == 'name' ?
                                                                        <Select
                                                                            key={rowindex}
                                                                            closeMenuOnSelect={true}
                                                                            components={animatedComponents}
                                                                            options={options}
                                                                            value={value}

                                                                            onChange={(value) => handleChange(rowindex, value, name)}

                                                                        />
                                                                        :
                                                                        column.id == 'remove' ?
                                                                            <Button
                                                                                variant='outlined'
                                                                                color='secondary'
                                                                                size='sm'
                                                                                onClick={() => handleRemoveSpecificRow(rowindex)}
                                                                            >
                                                                                Remove
                                                                            </Button>

                                                                            :
                                                                            column.id == 'type' ?
                                                                                <Select
                                                                                    key={rowindex}
                                                                                    closeMenuOnSelect={true}
                                                                                    components={animatedComponents}
                                                                                    options={ColumnTypes}
                                                                                    value={value}
                                                                                    onChange={(value) => handleChange(rowindex, value, name)}

                                                                                />
                                                                                :
                                                                                rowindex + 1
                                                        }
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                }
                            })}
                    </TableBody>
                </Table>
                <Container style={{ marginTop: 30 }}>
                    <Button
                        variant='contained'
                        style={{ backgroundColor: 'green', color: 'white' }}
                        onClick={() => handleAddRow()}>
                        Add Entry
                    </Button>
                    <Button
                        variant='contained'
                        color='secondary'
                        style={{ float: 'right' }}
                        onClick={() => handleRemoveRow()}
                        className="float-right"
                    >
                        Delete Last Entry
                    </Button>
                </Container>

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
