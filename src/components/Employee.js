import React, { useState, useEffect } from 'react';
import Data from './Data.json';
import { COLUMNS } from './columns';
import ReactTable from './ReactTable';
import { Button, Modal, OverlayTrigger, Popover, PopoverBody, PopoverHeader, ListGroup } from 'react-bootstrap';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineInfoCircle } from 'react-icons/ai';
import { IoIosAddCircleOutline } from "react-icons/io";
import './Employee.css';
import { countries } from './Utility';
import * as Yup from 'yup';

const Employee = () => {

    const [reactTableColumn, setReactTableColumn] = useState([]);
    const [reactTableData, setReactTableData] = useState([]);

    const initialAddress = {
        addressLine1: '',
        addressLine2: ''
    }
    const [showFormModal, setShowFormModal] = useState(false);
    const [rowIndex, setRowIndex] = useState(-1);
    const [selectedData, setSelectedData] = useState({});
    const [addressIndex, setAddressIndex] = useState(-1);

    const [showAddressDeleteConfirm, setShowAddressDeleteConfirm] = useState(false);

    const cancelDeleteAddress = () => {
        setSelectedData({});
        setAddressIndex(-1);
        setShowAddressDeleteConfirm(false);
    }

    const deleteAddress = () => {
        if (selectedData.id) {
            const selectedEmployeeIndex = reactTableData.findIndex(e => e.id === selectedData.id);
            if (selectedEmployeeIndex >= 0) {
                reactTableData[selectedEmployeeIndex].addresses.splice(addressIndex, 1);
                setReactTableData(reactTableData.slice());
            }
        }
        cancelDeleteAddress();
    }

    const editCell = (originalRow, rowIndex) => {
        return (<div>
            <AiOutlineEdit onClick={() => { setSelectedData(originalRow); setRowIndex(rowIndex); setShowFormModal(true); }} />

            {/* <OverlayTrigger trigger="click" placement="left"
                overlay={
                    <Popover id={originalRow.id}>
                        <Popover.Body>
                            <strong>Holy guacamole!</strong> Check this info.
                        </Popover.Body>
                    </Popover>
                }>
                <AiOutlineInfoCircle />
                
            </OverlayTrigger> */}
        </div>)
    }

    const prepareAddressToDelete = (employee, addressIndex) => {
        setSelectedData(employee);
        setAddressIndex(addressIndex);
        setShowAddressDeleteConfirm(true);
    }

    const addressCell = (originalRow, rowIndex) => {
        return (
            <>
                {
                    originalRow.addresses.length === 0 && <div>No address added so far.</div>
                }
                {
                    originalRow.addresses.length > 0 &&
                    <ul>
                        {
                            originalRow.addresses.map((address, index) => {
                                return (<li key={index}>
                                    <AiOutlineDelete title="Delete"
                                        onClick={() => { prepareAddressToDelete(originalRow, index) }} />
                                    -{address.addressLine1}, {address.addressLine2}
                                </li>)
                            })
                        }
                    </ul>
                }
            </>
        );
    }


    // const data = useMemo(() => Data, []);
    const [uniqueCountries, setUniqueCountries] = useState([]);

    const populateUniqueCountry = () => {
        let countries = [];
        Data.forEach(element => {
            const condition = (e) => e === element.country;
            if (countries.findIndex(condition) === -1) {
                countries.push(element.country);
            }
        })
        setUniqueCountries(countries.sort());
    }

    const populateReactTableColumn = () => {
        const columns = COLUMNS;
        const editColumnIndex = columns.findIndex(e => e.Header === 'Edit');
        if (editColumnIndex >= -1) {
            columns[editColumnIndex].accessor = (originalRow, rowIndex) => (editCell(originalRow, rowIndex));
        }


        //Update Address column 
        const headerColumnIndex = columns.findIndex(e => e.Header === 'Address');
        if (headerColumnIndex >= -1) {
            columns[headerColumnIndex].accessor = (originalRow, rowIndex) => (addressCell(originalRow, rowIndex));
        }
        setReactTableColumn(columns);
    }

    useEffect(() => {
        populateUniqueCountry();
        setReactTableData(Data);
        populateReactTableColumn();
    }, []);

    const validationSchema = Yup.object().shape({
        first_name: Yup.string().min(2, 'Too Short!').max(55, 'Too Long!').required('Required'),
        last_name: Yup.string().min(2, 'Too Short!').max(55, 'Too Long!').required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        country: Yup.string().required('Required'),
        phone: Yup.string().min(10, 'Invalid').max(10, 'Invalid').required('Required'),
        addresses: Yup.array().of(
            Yup.object().shape({
                addressLine1: Yup.string().min(2, 'Too Short!').required('Required'),
                addressLine2: Yup.string().min(2, 'Too Short!').required('Required')
            })
        )
    });

    const onSubmit = (formValues) => {
        let data = Data.slice();
        const rowIndex = data.findIndex(e => e.id === formValues.id);
        if (rowIndex > -1) {
            data[rowIndex] = formValues;
        }
        setReactTableData(data);
        setShowFormModal(false);
    }

    const getClassName = (errors, touched, rowIndex, fieldName) => {
        let className = 'form-control';

        if (errors.addresses && errors.addresses[rowIndex] != undefined
            && errors.addresses[rowIndex] != null
            && touched.addresses && touched.addresses[rowIndex] != undefined
            && touched.addresses[rowIndex] != null) {
            if (errors.addresses[rowIndex][fieldName] && touched.addresses[rowIndex][fieldName]) {
                className = `${className} error`
            }
        }

        return className;
    }

    return (
        <>
            <div>
                <ReactTable data={reactTableData} columns={reactTableColumn} />
            </div>
            <Modal show={showFormModal} size="xl">
                <Modal.Header>
                    <Modal.Title>Updating Data</Modal.Title>
                </Modal.Header>
                <Formik enableReinitialize initialValues={selectedData}
                    onSubmit={onSubmit} validationSchema={validationSchema} >
                    {
                        ({ values, errors, touched, dirty, resetForm, setFieldValue }) => {
                            // console.log('errors', errors);
                            // console.log('touched', JSON.stringify(touched));
                            // console.log('dirty', dirty);
                            return (
                                <>
                                    <Form>
                                        <>
                                            <Modal.Body>
                                                <div className="form-group row">
                                                    <label htmlFor="first_name" className="col-sm-1 col-form-label">First Name</label>
                                                    <div className="col-sm-5">
                                                        <Field name="first_name" id="first_name"
                                                            className={`form-control ${touched.first_name && errors.first_name ? "error" : ""}`}
                                                            max-length="55"></Field>
                                                        <ErrorMessage name="first_name">{(msg) => <div className="alert-error">{msg}</div>}</ErrorMessage>
                                                    </div>
                                                    <label htmlFor="last_name" className="col-sm-1 col-form-label">Last Name</label>
                                                    <div className="col-sm-5">
                                                        <Field name="last_name" id="last_name"
                                                            className={`form-control ${touched.last_name && errors.last_name ? "error" : ""}`}
                                                            max-length="55" />
                                                        <ErrorMessage name="last_name">{(msg) => <div className="alert-error">{msg}</div>}</ErrorMessage>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="email" className="col-sm-1 col-form-label">Email</label>
                                                    <div className="col-sm-5">
                                                        <Field name="email" id="email"
                                                            className={`form-control ${touched.email && errors.email ? "error" : ""}`}
                                                            max-length="255" />
                                                        <ErrorMessage name="email">{(msg) => <div className="alert-error">{msg}</div>}</ErrorMessage>
                                                    </div>
                                                    <label htmlFor="phone" className="col-sm-1 col-form-label">Phone</label>
                                                    <div className="col-sm-5">
                                                        <Field name="phone" id="phone"
                                                            className={`form-control ${touched.phone && errors.phone ? "error" : ""}`}
                                                            max-length="255"></Field>
                                                        <ErrorMessage name="phone">{(msg) => <div className="alert-error">{msg}</div>}</ErrorMessage>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="country" className="col-sm-1 col-form-label">Country</label>
                                                    <div className="col-sm-5">
                                                        <Field name="country" id="country"
                                                            className={`form-select ${touched.country && errors.country ? "error" : ""}`}
                                                            component="select">
                                                            <option value=""></option>
                                                            {
                                                                countries().map((country, index) => {
                                                                    return (<option key={index} value={country}>{country}</option>)
                                                                })
                                                            }
                                                        </Field>
                                                        <ErrorMessage name="country">{(msg) => <div className="alert-error">{msg}</div>}</ErrorMessage>
                                                    </div>
                                                </div>
                                                <FieldArray name="addresses"
                                                    render={
                                                        arrayHelpers => (
                                                            <>
                                                                <div className="form-group row">
                                                                    <div className="col-sm-1">Addresses</div>
                                                                    <div className="col-sm-1">
                                                                        <IoIosAddCircleOutline className="add"
                                                                            title="Add Address"
                                                                            onClick={() => {
                                                                                arrayHelpers.push(initialAddress);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {values.addresses.map((address, index) => {
                                                                    return (
                                                                        <div className="form-group row" key={index}>
                                                                            <div className="col-sm-5">
                                                                                <Field name={`addresses[${index}].addressLine1`}
                                                                                    className={getClassName(errors, touched, index, 'addressLine1')}
                                                                                    max-length="255" placeholder="Address Line 1"></Field>
                                                                                <ErrorMessage name={`addresses[${index}].addressLine1`}>{(msg) => <div className="alert-error">{msg}</div>}</ErrorMessage>
                                                                            </div>
                                                                            <div className="col-sm-5">
                                                                                <Field name={`addresses[${index}].addressLine2`}
                                                                                    className={getClassName(errors, touched, index, 'addressLine2')}
                                                                                    max-length="255" placeholder="Address Line 2"></Field>
                                                                                <ErrorMessage name={`addresses[${index}].addressLine2`}>{(msg) => <div className="alert-error">{msg}</div>}</ErrorMessage>
                                                                            </div>
                                                                            <label className="col-sm-1 col-form-label">
                                                                                <AiOutlineDelete className="add" onClick={
                                                                                    () => arrayHelpers.remove(index)
                                                                                } />
                                                                            </label>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </>
                                                        )
                                                    }
                                                />
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={() => { setShowFormModal(false); }}>
                                                    Close
                                                </Button>
                                                <Button type="submit" variant="primary">
                                                    Save Changes
                                                </Button>
                                            </Modal.Footer>
                                        </>
                                    </Form>
                                </>
                            )
                        }
                    }
                </Formik>
            </Modal>
            <Modal show={showAddressDeleteConfirm}>
                <Modal.Header>
                    <Modal.Title>Delete Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure to delete the address?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelDeleteAddress}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={deleteAddress}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Employee;