import './App.css';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid-pro';
import React from 'react';
import axios from 'axios';
import apiUrlMapping from '../src/resources/apiMapping.json';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { Dialog, DialogContent, DialogActions, DialogTitle} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';



const geRowsWithId = (rows) => {
  let id = 0
  let completeRowListArray = []
  for (let row of rows) {
    const rowsWithId = {
      id: id,
      ...row
    }
    id++
    completeRowListArray.push(rowsWithId)
  }
  return completeRowListArray
}


export default function App() {

  const employeeTable = 
  [
    {
      field : "actions",
      type: "actions",
      width : 100,
      getActions: (event) => [
        <GridActionsCellItem onClick={(e) => deleteRecord(event.id)} icon={<DeleteIcon />} label="Delete" />,
        <GridActionsCellItem onClick={(e) => onClickOfEditButton(event)} icon={<EditIcon />} label="Edit" />
      ]
    },
    {
      field: 'firstname',
      headerName: 'First Name',
      width : 190
    },
    {
      field: 'lastname',
      headerName: 'Last Name',
      width : 190
    },
    {
      field: 'emailid',
      headerName: 'Email Id',
      width : 190
    },
    {
      field: 'city',
      headerName: 'City',
      width : 190
    },
    {
      field: 'branch',
      headerName: 'Branch',
      width : 190
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width : 190
    }
  ]

const [rows, setRows] = useState([])
const [addOrEdit, setAddOrEdit] = useState("")
const [editId, setEditId] = useState("");
const [open, setOpen] = useState(false);
const [firstName, setFirstName] = useState("");
const [city, setCity] = useState("");
const [lastName, setLastName] 	= useState("");
const [email, setEmail] = useState("");
const [branch, setBranch] = useState("");
const [phone, setPhone] = useState("");
const handleClickOpen = () => {setOpen(true);};
const handleClose = () => {setOpen(false);};

// for Retrieving All the Records

const getAllRecords=()=>
  {
    axios.get(apiUrlMapping.employeeData.getAll).then(response =>
	{
    setRows(geRowsWithId(response.data))
    });
  }

// for Deleting the Record

const deleteRecord = (index) =>
  {
    let dataId = rows[index]._id
    axios.delete(apiUrlMapping.employeeData.delete + "/" + dataId).then(()=>{getAllRecords();});
  }


const onClickofSaveRecord = () => 
  {
    setAddOrEdit("Save")
    handleClickOpen()
  }

  useEffect(() => {getAllRecords()}, []);

const addOrEditRecordAndClose = (type) => 
  {
    if (type === "Edit") {editRecordAndClose()}
    if (type === "Save") {addRecordAndClose() }
  }

const addRecordAndClose = () => 
  {
    if (firstName !== undefined && city !== undefined && lastName !== undefined && email !== undefined && branch !== undefined && phone !== undefined)
	{
      let payload = 
	  {
        "firstname": firstName,
        "lastname": lastName,
        "emailid": email,
        "city": city,
        "branch": branch,
        "phone": phone
    }
      console.log("The Data to DB is " + payload)
      axios.post(apiUrlMapping.employeeData.post, payload).then(response => 
	  {
	  getAllRecords()
        handleClose()
        setFirstName("")
        setCity("")
        setLastName("")
        setEmail("")
        setBranch("")
        setPhone("")
    })
    }
  }
  const onClickOfEditButton = (e) =>{
    console.log(e)
    setAddOrEdit("Edit")
    let editRecord  = rows[e.id]
    console.log(editRecord)
    setFirstName(editRecord.firstname)
    setLastName(editRecord.lastname)
    setEmail(editRecord.emailid)
    setCity(editRecord.city)
    setBranch(editRecord.branch)
    setEditId(editRecord._id)
    setPhone(editRecord.phone)
    handleClickOpen()
  }

  const editRecordAndClose = () => 
  {
    if (firstName !== undefined && city !== undefined && lastName !== undefined && email !== undefined && branch !== undefined && phone !== undefined)
	{
      let payload = 
	  {
        "firstname": firstName,
        "lastname": lastName,
        "emailid": email,
        "city": city,
        "branch": branch,
        "phone": phone
    }
      console.log("The Data to DB is " + payload)
      axios.put(apiUrlMapping.employeeData.put + "/" + editId, payload).then(response => 
	  {
      getAllRecords()
      handleClose()
      setFirstName("")
      setCity("")
      setLastName("")
      setEmail("")
      setBranch("")
      setPhone("")
    })
    }
  }
  return (
    <div className="App">
      <div className="text-alligned">
        <h1>Employee Data</h1>
      </div>
      <div style={{ height: "50vh", width: "100%" }}>
      <DataGrid
          rows = {rows}
          columns = {employeeTable}
          components={{Toolbar: GridToolbar,}}
          componentsProps={{toolbar: { showQuickFilter: true }}}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
        />
  </div>
  <div className="center" >
          <Button variant="contained" onClick={onClickofSaveRecord} >Add Record</Button>
  </div>

  <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Student Data</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" id="firstname"  onChange={(e) => { setFirstName(e.target.value) }}value={firstName}label="First Name"type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="lastname" onChange={(e) => { setLastName(e.target.value) }}value={lastName} label="Last Name" type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="email" onChange={(e) => { setEmail(e.target.value) }} value={email} label="Email Id" type="email" fullWidth/>
          <TextField autoFocus margin="dense" id="city" onChange={(e) => { setCity(e.target.value) }} value={city} label="City" type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="branch" onChange={(e) => { setBranch(e.target.value) }} value={branch} label="Branch" type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="ph" onChange={(e) => { setPhone(e.target.value) }} value={phone} label="Phone" type="text" fullWidth/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => { addOrEditRecordAndClose(addOrEdit) }}>Save</Button>
        </DialogActions>
  </Dialog>

      
    </div>
  );
}
