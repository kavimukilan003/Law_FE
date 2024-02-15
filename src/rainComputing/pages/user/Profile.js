import MetaTags from "react-meta-tags"
import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  FormGroup,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"

import { withRouter } from "react-router-dom"

//Import Breadcrumb
import Breadcrumb from "components/Common/Breadcrumb"

import avatar from "assets/images/avatar-defult.jpg"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import {
  userUpdate,
  profilePicUpdate,
  updatePassword,
  profilePicRemove,
} from "rainComputing/helpers/backend_helper"
import profile from "store/auth/profile/reducer"
import { values } from "lodash"

import DeleteModal from "rainComputing/components/modals/DeleteModal"
import { useToggle } from "rainComputing/helpers/hooks/useToggle"
import NotificationSounds from "components/CommonForBoth/TopbarDropdown/NotificationSettings"
const UserProfile = props => {
  const user = localStorage.getItem("authUser")
  const [updateSuccess, setUpdateSuccess] = useState("")
  const [updateError, setUpdateError] = useState("")
  const [loading, setLoading] = useState(false)
  const [proloading, setProLoading] = useState(false)
  const { currentUser, setCurrentUser } = useUser(user)
  const [profilePic, setProfilePic] = useState("")
  const [profileUpdateSuccess, setProfileUpateSuccess] = useState("")
  const [profileUpdateError, setProfileUpateError] = useState("")
  const [passwordUpdateSuccess, setPasswordUpateSuccess] = useState("")
  const [passwordUpdateError, setPasswordUpateError] = useState("")
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      firstname: currentUser?.firstname,
      lastname: currentUser?.lastname,
      password: "",
    confirmPassword: "",
    },
    // validationSchema: Yup.object({
    //   firstname: Yup.string().required("Please Enter Your First Name"),
    //   // .matches(/^[^\d]+$/, "First Name cannot contain numbers"),
    //   lastname: Yup.string().required("Please Enter Your Last Name"),
    //   .matches(/^[^\d]+$/, "Last Name cannot contain numbers"),
    //   password: Yup.string().required("Please Enter New Password")
    //   .min(16, "Password must be at least 16 characters"),
    // confirmPassword: Yup.string().required("Please Confirm Password")
    //   .oneOf([Yup.ref('password'), null], 'Passwords must match')
    //   .min(16, "Password must be at least 16 characters"),

    // }),
    onSubmit: async (values, onSubmitProps) => {
      setLoading(true)
      const res = await userUpdate({ ...values, email: currentUser?.email })
      if (res.success) {
        setUpdateError("")
        localStorage.setItem("authUser", JSON.stringify(res))
        setCurrentUser(res)
        setUpdateSuccess("User Details updated Successfully")
        // onSubmitProps.resetForm()
      } else {
        setUpdateSuccess("")
        setCurrentUser(res)
        setUpdateError("Failed to update user details!!")
      }
      setLoading(false)
    },
  })
  const handleUpdatePassword = async () => {
    const newPassword = validation.values.password;
  
    if (newPassword.length >= 5 && newPassword === validation.values.confirmPassword) {
      const res = await updatePassword({
        userID: currentUser.userID,
        password: newPassword,
      });
  
      if (res.success) {
        setPasswordUpateError("");
        localStorage.setItem("authUser", JSON.stringify(res));
        setCurrentUser(res);
        validation.values.password = "";
        validation.values.confirmPassword = "";
        setPasswordUpateSuccess(res.msg);
      } else {
        setPasswordUpateSuccess("");
        setPasswordUpateError("Failed to update password!!");
      }
    } else {
      setPasswordUpateSuccess("");
      setPasswordUpateError("Password must be at least 5 characters and match the confirmation.");
    }
  };
  

  const profilePicUpload = async e => {
    setProLoading(true)
    const file = e.target.files[0]

    const res = await convertBase64(file)
    const updateRes = await profilePicUpdate({
      profilePic: res,
      email: currentUser?.email,
    })

    if (updateRes.success) {
      setProfileUpateError("")
      localStorage.setItem("authUser", JSON.stringify(updateRes))
      setCurrentUser(updateRes)
      toastr.success(
        "Profile Picture has been updated successfully",
        "Success!!!"
      )
    } else {
      setProfileUpateSuccess("")
      toastr.error("Failed to update the Profile Picture", "Failed!!!")
    }

    setProLoading(false)
  }

  // Profile Pic Delete

  const {
    toggleOpen: profileDeleteModalOpen,
    setToggleOpen: setProfileDeleteModalOpen,
    toggleIt: toggleProfileDeleteModalOpen,
  } = useToggle(false)

  const onDeleteProfile = async () => {
    const payload = {
      email: currentUser?.email,
    }
    const res = await profilePicRemove(payload)

    if (res.success) {
      toastr.success(
        "Profile Picture has been Deleted successfully",
        "Success!!!"
      )
      localStorage.setItem("authUser", JSON.stringify(res))
      setCurrentUser(res)
    } else {
      toastr.error("Failed to delete the Profile Picture", "Failed!!!")
    }
    setProfileDeleteModalOpen(false)
  }
  const handleProfilePicDelete = () => {
    setProfileDeleteModalOpen(true)
  }

  const convertBase64 = file => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = error => {
        reject(error)
      }
    })
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Profile | RainComputing</title>
        </MetaTags>
        <Container fluid>
          {/* Render Breadcrumb */}
          {/* <Breadcrumb title="Rain" breadcrumbItem="Profile" /> */}

          <Row>
            <Col lg="12">
              {updateError && <Alert color="danger">{updateError}</Alert>}
              {updateSuccess && <Alert color="success">{updateSuccess}</Alert>}
              {profileUpdateError && (
                <Alert color="danger">{profileUpdateError}</Alert>
              )}
              {profileUpdateSuccess && (
                <Alert color="success">{profileUpdateSuccess}</Alert>
              )}
              {passwordUpdateError && (
                <Alert color="danger">{passwordUpdateError}</Alert>
              )}
              {passwordUpdateSuccess && (
                <Alert color="success">{passwordUpdateSuccess}</Alert>
              )}
              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-3">
                      <Label htmlFor="hidden-file">
                        {proloading ? (
                          <div>
                            <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>
                          </div>
                        ) : (
                          <div>
                            <img
                              src={
                                currentUser?.profilePic
                                  ? currentUser.profilePic
                                  : avatar
                              }
                              alt="profile"
                              className="avatar-lg rounded-circle img-thumbnail"
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        )}
                        {/* <img
                          src={
                            currentUser.profilePic
                              ? currentUser.profilePic
                              : avatar
                          }
                          alt="profile"
                          className="avatar-md rounded-circle img-thumbnail"
                        /> */}
                      </Label>

                      <Input
                        type="file"
                        multiple={false}
                        id="hidden-file"
                        className="d-none"
                        accept=".png, .jpg, .jpeg"
                        onChange={e => {
                          profilePicUpload(e)
                        }}
                      />
                    </div>
                    <DeleteModal
                      show={profileDeleteModalOpen}
                      onDeleteClick={() => onDeleteProfile()}
                      confirmText="Yes,Remove"
                      cancelText="Cancel"
                      onCloseClick={toggleProfileDeleteModalOpen}
                    />
                    {currentUser.profilePic && (
                      <div>
                        <i
                          className="bi bi-pencil-square text-danger"
                          title="Remove Profile pic"
                          style={{ fontSize: "12px", cursor: "pointer" }}
                          onClick={() => handleProfilePicDelete()}
                        ></i>
                      </div>
                    )}

                    <div className="flex-grow-1 align-self-center ms-3">
                      <div className="text-muted">
                        <h5>
                          {currentUser.firstname + " " + currentUser.lastname}
                        </h5>
                        <p className="mb-1">{currentUser.email}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Update User Details</h4>

          <Card>
            <CardBody>
              <Form
                className="needs-validation"
                onSubmit={e => {
                  e.preventDefault()
                  validation.handleSubmit()
                  return false
                }}
              >
                <Row>
                  <Col md="6">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom01">First name</Label>
                      <Input
                        name="firstname"
                        placeholder="First name"
                        type="text"
                        className="form-control"
                        id="validationCustom01"
                        onChange={validation.handleChange}
                        // onBlur={validation.handleBlur}
                        value={validation.values.firstname || ""}
                        // invalid={
                        //   validation.touched.firstname &&
                        //   validation.errors.firstname
                        //     ? true
                        //     : false
                        // }
                      />
                      {/* {validation.touched.firstname &&
                      validation.errors.firstname ? (
                        <FormFeedback type="invalid">
                          {validation.errors.firstname}
                        </FormFeedback>
                      ) : null} */}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom02">Last name</Label>
                      <Input
                        name="lastname"
                        placeholder="Last name"
                        type="text"
                        className="form-control"
                        id="validationCustom02"
                        onChange={validation.handleChange}
                        // onBlur={validation.handleBlur}
                        value={validation.values.lastname || ""}
                        // invalid={
                        //   validation.touched.lastname &&
                        //   validation.errors.lastname
                        //     ? true
                        //     : false
                        // }
                      />
                      {/* {validation.touched.lastname &&
                      validation.errors.lastname ? (
                        <FormFeedback type="invalid">
                          {validation.errors.lastname}
                        </FormFeedback>
                      ) : null} */}
                    </FormGroup>
                  </Col>
                </Row>

                {loading ? (
                  <button
                    type="button"
                    className="btn btn-dark"
                    style={{ cursor: "not-allowed" }}
                  >
                    <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>
                    Registering...
                  </button>
                ) : (
                  <Button color="primary" type="submit">
                    Update
                  </Button>
                )}
              </Form>
            </CardBody>
          </Card>

          <h4 className="card-title mb-4">Password Update</h4>

          <Card>
            <CardBody>
              <Row>
                <Col md="6">
                  <FormGroup className="mb-3">
                    <Label htmlFor="validationCustom02">New Password</Label>
                    <Input
                      name="password"
                      placeholder="New Password"
                      type="password"
                      className="form-control"
                      id="  "
                      onChange={validation.handleChange}
                      // onBlur={validation.handleBlur}
                      value={validation.values.password || ""}
                      // invalid={
                      //   validation.touched.lastname &&
                      //   validation.errors.lastname
                      //     ? true
                      //     : false
                      // }
                    />
                    {/* {validation.touched.lastname &&
                      validation.errors.lastname ? (
                        <FormFeedback type="invalid">
                          {validation.errors.lastname}
                        </FormFeedback>
                      ) : null} */}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup className="mb-3">
                    <Label htmlFor="validationCustom02">Confirm Password</Label>
                    <Input
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      type="password"
                      className="form-control"
                      id="validationCustom02"
                      onChange={validation.handleChange}
                      // onBlur={validation.handleBlur}
                      value={validation.values.confirmPassword || ""}
                      // invalid={
                      //   validation.touched.lastname &&
                      //   validation.errors.lastname
                      //     ? true
                      //     : false
                      // }
                    />
                    {/* {validation.touched.lastname &&
                      validation.errors.lastname ? (
                        <FormFeedback type="invalid">
                          {validation.errors.lastname}
                        </FormFeedback>
                      ) : null} */}
                  </FormGroup>
                </Col>
              </Row>
              {loading ? (
                <button
                  type="button"
                  className="btn btn-dark"
                  style={{ cursor: "not-allowed" }}
                >
                  <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>
                  Registering...
                </button>
              ) : (
                <Button
                  color="primary"
                  type="submit"
                  onClick={() => {
                    handleUpdatePassword()
                  }}
                >
                  Update
                </Button>
              )}
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(UserProfile)
