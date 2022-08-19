import React, { useState, useEffect } from 'react';
import {
  CssBaseline,
  AppBar,
  Box,
  Container,
  Toolbar,
  Paper,
  Link,
  Typography,
  TextField,
  Alert
} from '@mui/material';
import { Button, Grid } from '@material-ui/core';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { width } from '@mui/system';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import moment from 'moment';
import { Controller, useForm } from "react-hook-form";
import FileUpload from "react-material-file-upload";
import LoadingButton from '@mui/lab/LoadingButton';

import Papa from "papaparse";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import StickyHeadTable from './StickyTable';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}



const theme = createTheme();

export default function App() {


  const [date, setDate] = useState(new Date());
  const [dateString, setDateSring] = useState("");
  const [days, setDays] = useState(0)
  const [endDate, setEndDate] = useState('')

  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [sending, setSending] = useState(false)
  const [alert, setAlert] = useState(null)
  const [fileDestination, setfileDestination] = useState("")
  const [file, setFile] = useState(null)

  // This state will store the parsed data
  const [coldata, setData] = useState([]);
  const [error, setError] = useState("");

  const [options, setOptions] = useState([])
  const [defaultoptions, setDefaultOptions] = useState([])
  const [selectedoptions, setSelectedOptions] = useState([])
  const [saved, setSaved] = useState(false)
  const { control, handleSubmit } = useForm();

  const [stickyTableData, setStickyTableData] = useState([])
  const [columns, setColumns] = useState([])

  const handleDateChange = (newValue) => {
    setDate(newValue);
    const dateS = moment(newValue).format("MM-DD-YYYY")
    setDateSring(dateS)
  };

  const handleDaysChange = (event) => {
    if (event == "") event = 0
    setDays(event)
  }

  const defaultColumns = [
    'ID',
    'Duration hours',
    'GANANCIA TOTAL ($)',
    'Start',
    'DESARROLLO (m) BASAL',
    'DESARROLLO (m) ESTERIL',
    'DESARROLLO (m) RAMPA',
    'LVL_BACKFILL',
    'LVL_DEVELOPMENT (m)',
    'LVL_EXTRACCION_MINERAL (Tn)',
    'DE METROS PERFORADOS (m)',
    'Predecessor details',
    'Finish',
    'Rate',
    'NIVEL',
    'SOT_ACT_TYPE',
    'ID_LABOR',
    'Driving property',
    'RESBIN',
    'Resources'

  ]

  const defaultRenames = {
    'Duration hours': "duration",
    'GANANCIA TOTAL ($)': "profit",
    'DESARROLLO (m) BASAL': "prim_dev",
    'DESARROLLO (m) ESTERIL': "waste_dev",
    'DESARROLLO (m) RAMPA': "ramp_dev",
    'LVL_BACKFILL': "lvl_backfill",
    'LVL_DEVELOPMENT (m)': "lvl_dev",
    'LVL_EXTRACCION_MINERAL (Tn)': "lvl_ore_t",
    'DE METROS PERFORADOS (m)': "production_drill",
    'Predecessor details': "preds",
    'SOT_ACT_TYPE': "act_type_brd",
    'ID_LABOR': "act_type",
    'Start': "start",
    'Finish': "finish",
    'NIVEL': "Level",
    'Rate': "rate",
    'Driving property': "d_prop",
    'RESBIN': "min_reserve",
    'Resources': "resources"
  }

  const defaultDatatypes = {
    'ID': 'str',
    'Duration hours': 'float',
    'GANANCIA TOTAL ($)': 'float',
    'Start': 'str',
    'DESARROLLO (m) ESTERIL': 'float',
    'DESARROLLO (m) RAMPA': 'float',
    'DESARROLLO (m) BASAL': 'float',
    'LVL_BACKFILL': 'float',
    'LVL_DEVELOPMENT (m)': 'float',
    'LVL_EXTRACCION_MINERAL (Tn)': 'float',
    'DE METROS PERFORADOS (m)': 'float',
    'Predecessor details': 'str',
    'Finish': 'str',
    'Rate': 'str',
    'NIVEL': 'str',
    'SOT_ACT_TYPE': 'str',
    'ID_LABOR': 'str',
    'Driving property': 'str',
    'RESBIN': 'str',
    'Resources': 'str'
  }

  const getScheduleEnd = () => {
    const end = moment(moment(date).add(days, 'days')).format("LL")
    setEndDate(end)
  }

  const onSubmit = ({ file }) => {

    console.log("File ", file)

    if (file == null || file == undefined || typeof (file) == 'undefined') {
      window.alert("Please Select a CSV first")

      return;
    }

    setLoading(true)

    console.log('file', file[0]);
    setFile(file[0])


    const data = new FormData();
    data.append('file', file[0]);


    fetch(
      '/upload_csv',
      {
        method: "POST",

        body: data
      }
    )
      .then(res => res.json())
      .then(response => {

        console.log("Response : ", response)
        setLoading(false)

        if (response.status == "success") {
          setfileDestination(response.destination)
          setAlert(true)
        } else {
          setAlert(false)
        }

      })
      .catch(error => { console.log(error); setLoading(false); setAlert(false) });
  };

  const processData = () => {

    // If user clicks the parse button without
    // a file we show a error
    if (!file) return setError("Enter a valid file");

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      const columns = Object.keys(parsedData[0]);
      setData(columns);
    };
    reader.readAsText(file);

  };

  const setTableValues = () => {

    console.log("Here")
    const tableData = []
    const cols = []
    if (selectedoptions.length == 0) {
      window.alert("Please make selections first")
    }
    selectedoptions.forEach((col, index) => {

      tableData.push({ name: col.value, rename: defaultRenames[col.value] || col.value, datatype: defaultDatatypes[col.value] || '' })
      cols.push(col.value)
    })

    setStickyTableData(tableData)
    setColumns(cols)
    setSaved(true)
  }

  const sendData = () => {
    const colToDatatype = {}
    const colToRename = {}
    if (dateString == '' || days < 1) {
      window.alert("Please set a schedule first")
      return;
    }

    setSending(true)

    stickyTableData.forEach((data, index) => {
      colToDatatype[data.name] = data.datatype
      colToRename[data.name] = data.rename
    })

    window.alert("Coming Soon")
    return

    fetch(
      '/send_data',
      {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          rename: colToRename,
          datatype: colToDatatype,
          columns: columns,
          date: dateString,
          days: days,
          destination: fileDestination

        })
      }
    )
      .then(res => res.json())
      .then(response => {

        console.log("Response : ", response)
        setSending(false)


      })
      .catch(error => { console.log(error); setSending(false); });

  }

  // useEffect(() => {
  //   if (stickyTableData.length > 0)
  //     setSaved(true)
  // }, [stickyTableData])

  const handleTableDataChange = (data, index) => {
    let newTableData = [...stickyTableData]
    newTableData[index] = data
    setStickyTableData(newTableData)
  }

  useEffect(() => {
    if (dateString != "" && days != 0) getScheduleEnd()
  }, [days, dateString])

  useEffect(() => {
    const dateS = moment(date).format("MM-DD-YYYY")
    setDateSring(dateS)
  }, [])

  useEffect(() => {
    if (fileDestination != '')
      processData()
  }, [fileDestination])

  useEffect(() => {

    console.log("Col data :", coldata)
    if (coldata.length > 0) {
      setProcessing(true)

      const obj = [];
      const defaults = [];
      coldata.forEach((element, index) => {
        obj.push({ value: element, label: element })

        if (defaultColumns.includes(element)) {
          defaults.push({ value: element, label: element })
        }
      })
      console.log("Object : ", obj)
      setDefaultOptions(defaults)

      setTimeout(() => {
        setOptions(obj)
        setProcessing(false)
        setAlert(null)

      }, 2000);

    }

  }, [coldata])

  useEffect(() => {
    console.log("Selected: ", selectedoptions)
  }, [selectedoptions])

  useEffect(() => {
    console.log("Defaults", defaultoptions)
  }, [defaultoptions])

  const animatedComponents = makeAnimated();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Colorado School of Mines
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xl" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 5 } }}>
          <Typography component="h1" variant="h4" align="center">
            Deswik-to-OMP Converter
          </Typography>
          <Container >
            <Paper variant="outlined" sx={{ my: { xs: 6, md: 10 }, p: { xs: 1, md: 2 } }}>
              <Typography component="h4" variant="h5" align="left" marginBottom={6}>
                Schedule and Horizon Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <LocalizationProvider dateAdapter={AdapterMoment}>

                    <DesktopDatePicker
                      label="Schedule Start Date"
                      inputFormat="MM-DD-YYYY"
                      value={date}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} />}
                    />


                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Horizon (in days)"
                    type="number"
                    onChange={event => handleDaysChange(event.target.value)}

                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Schedule End"
                    type="text"
                    // disabled
                    value={endDate}
                  // aria-selected
                  // fullWidth

                  />
                </Grid>

              </Grid>

              <Box
                component="form"
                sx={{ paddingTop: 1, marginTop: 10 }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  render={({ field: { value, onChange } }) => (
                    <FileUpload
                      value={value}
                      onChange={onChange}
                      multiple={false}
                      accept={[".csv"]}
                      title="Click to select or drag and drop a CSV. (Max size: 50MB)"
                      buttonText="Select a CSV"
                      maxSize={60340032}
                      buttonProps={{
                        variant: "text",
                        translate: 'no'

                      }}
                      typographyProps={{
                        variant: "body2",
                        color: "textSecondary"
                      }}
                    />
                  )}
                  control={control}
                  name="file"
                />
                <Box sx={{ mt: 2, mb: 3, textAlign: "center" }}>

                  <LoadingButton loading={loading} type="submit" variant="contained">
                    Submit
                  </LoadingButton>
                </Box>
                {
                  (alert == false) ?
                    <Alert severity="error">There was an error, please try again</Alert>
                    :
                    alert == true ?
                      <Alert severity="success">Your upload was successful!</Alert>
                      :
                      ""
                }



              </Box>

              <Box style={{ marginTop: "3rem" }}>
                {
                  processing ?
                    <Typography>Processing Data...</Typography>
                    :
                    <div >
                      <hr color='primary' />
                      <Typography variant="h5" align='center' fontWeight={800} style={{ marginTop: 50, marginBottom: 50 }}>
                        Data Filtering
                      </Typography>

                      {error ? error :
                        options.length < 1 ?
                          ""
                          : <Box style={{ margin: 30 }}>
                            <Typography fontSize={12} color="gray" style={{ marginBottom: 5 }}>Default Columns are pre-selected already.</Typography>
                            <Select
                              closeMenuOnSelect={false}
                              components={animatedComponents}
                              defaultValue={defaultoptions}
                              isMulti
                              isDisabled={coldata.length < 1}
                              options={options}
                              onChange={(value) => { setSelectedOptions(value) }}

                            />
                            <Button onClick={() => setTableValues()} color="primary" variant='outlined' style={{ marginTop: 30 }}>Save Selection</Button>
                          </Box>
                      }

                      {
                        saved ?
                          <Box style={{ margin: 30 }}>
                            <Typography variant='h5' align='center' fontWeight={800} style={{ marginTop: 50, marginBottom: 50 }}> Data Specification</Typography>
                            <StickyHeadTable rows={stickyTableData} onDataChange={handleTableDataChange} />
                            <LoadingButton loading={sending} onClick={() => sendData()} variant='contained' color='primary' style={{ marginTop: 30 }} >Send Data</LoadingButton>

                          </Box>
                          :
                          ""}
                    </div>
                }
              </Box>


            </Paper>
          </Container>
        </Paper>
        <Copyright />
      </Container>
    </ThemeProvider>
  );
}