import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  NavItem,
  NavLink,
  Row,
  FormFeedback,
  Button,
  Alert,
} from "reactstrap"
// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import { registerAttorney } from "rainComputing/helpers/backend_helper"
import { useHistory } from "react-router-dom"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
const AttorneyRegister = () => {
  const history = useHistory()
  const { currentUser, setCurrentUser } = useUser()
  const [profileUpdateError, setProfileUpateError] = useState("")
  const [profileUpdateSuccess, setProfileUpateSuccess] = useState("")
  const [updateError, setUpdateError] = useState("")
  const [updateSuccess, setUpdateSuccess] = useState("")
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      attorneybarnumber: "",
      phonenumber: "",
      firm: "",
      bio: "",
      address: "",
      country: "",
      state: "",
      city: "",
      postalCode: "",
      expertise: "",
      jurisdiction: "",
      fee: "",
      subdomain: "",
      email: currentUser.email,
    },
    validationSchema: Yup.object({
      phonenumber: Yup.string().max(20, 'Must be 20 characters or less'),
      firm: Yup.string().max(30, 'Must be 30 characters or less'),
      bio: Yup.string().required("Please Enter Your bio").max(30, 'Must be 30 characters or less'),
      address: Yup.string().max(60, 'Must be 60 characters or less'),
      city: Yup.string().max(30, 'Must be 30 characters or less'),
      postalCode: Yup.string().max(10, 'Must be 10 characters or less'),
      expertise: Yup.string().max(30, 'Must be 30 characters or less'),
      jurisdiction: Yup.string().max(30, 'Must be 30 characters or less'),
      fee: Yup.string().required("Please Enter Your fee").max(10, 'Must be 10 characters or less'),
      // subdomain: Yup.string().required("Please Enter Your subdomain"),
      attorneybarnumber: Yup.string().max(30, 'Must be 30 characters or less'),
    }),
    onSubmit: values => {
      handleAttorneyReg({
        registerNumber: values.attorneybarnumber,
        phoneNumber: values.phonenumber,
        firm: values.firm,
        bio: values.bio,
        address: values.address,
        country: values.country,
        state: values.state,
        city: values.city,
        postalCode: values.postalCode,
        jurisdiction: values.jurisdiction,
        expertise: values.expertise,
        fee: values.fee,
        subdomain: values.subdomain,
        userID: currentUser.userID,
        status: "approved",
      })
    },
  })
  const country = [
    { value: "india", text: "India" },
    // { value: "usa", text: "USA" },
    // { value: "england", text: "England" },
    // { value: "china", text: "China" },
  ]
  const state = [
    { value: "tamilnadu", text: "Tamilnadu" },
    // { value: "california", text: "California" },
    // { value: "zhejiang", text: "Zhejiang" },
    // { value: "london", text: "London" },
  ]
  const handleAttorneyReg = async payload => {
    const res = await registerAttorney(payload)
    if (res.success) {
      setUpdateError("")
      localStorage.setItem("authUser", JSON.stringify(res))
      setCurrentUser(res)
      toastr.success(`Registered us Attorney successfully `, "Success")
      setUpdateSuccess("Registering attorney Successfully")
      history.push("/")
    } else {
      setUpdateSuccess("")
      setUpdateError("Failed to Register an attroney!!")
    }
  }
  
  return (
    <React.Fragment>
      <div className="page-content">
        {updateError && <Alert color="danger">{updateError}</Alert>}
        {updateSuccess && <Alert color="success">{updateSuccess}</Alert>}
        {profileUpdateError && (
          <Alert color="danger">{profileUpdateError}</Alert>
        )}
        <Container fluid={true}>
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <Form
                    className="needs-validation"
                    onSubmit={e => {
                      e.preventDefault()
                      validation.handleSubmit()
                    }}
                  >
                    <div className="wizard clearfix">
                      <div className="steps clearfix">
                        <ul>
                          <NavItem>
                            <NavLink>
                              <h4 className="d-flex justify-content-center card-title mt-2">
                                {" "}
                                Attorney Registration Details
                              </h4>
                            </NavLink>
                          </NavItem>
                        </ul>
                      </div>
                      <div className="content clearfix mt-4">
                        <Form>
                          <Row>
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom01">
                                  Attorney BarNumber
                                </Label>
                                <Input
                                  name="attorneybarnumber"
                                  type="text"
                                  maxLength={31}
                                  className="form-control"
                                  id="validationCustom01"
                                  placeholder="Enter Your Attorney BarNumber"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={
                                    validation.values.attorneybarnumber || ""
                                  }
                                  invalid={
                                    validation.touched.attorneybarnumber &&
                                      validation.errors.attorneybarnumber
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.attorneybarnumber &&
                                  validation.errors.attorneybarnumber ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.attorneybarnumber}
                                  </FormFeedback>
                                ) : null}
                              </FormGroup>
                            </Col>

                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom05">Firm</Label>
                                <Input
                                  name="firm"
                                  maxLength={31}
                                  id="validationCustom05"
                                  className={`form-control ${validation.touched.firm && validation.errors.firm ? "is-invalid" : ""
                                    }`}
                                  rows="2"
                                  placeholder="Enter Your firm"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.firm || ""}
                                />
                                {validation.touched.firm && validation.errors.firm && (
                                  <div className="invalid-feedback">
                                    {validation.errors.firm}
                                  </div>
                                )}
                              </FormGroup>
                            </Col>

                          </Row>
                          <Row>


                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom03">
                                  Phone Number
                                </Label>
                                <Input
                                  type="text"
                                  maxLength={21}
                                  name="phonenumber"
                                  className="form-control"
                                  id="validationCustom03"
                                  placeholder="Enter Your Phone No."
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.phonenumber || ""}
                                  invalid={
                                    validation.touched.phonenumber &&
                                      validation.errors.phonenumber
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.phonenumber &&
                                  validation.errors.phonenumber ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.phonenumber}
                                  </FormFeedback>
                                ) : null}
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom04">
                                  Address
                                </Label>
                                <Input
                                  type="text"
                                  name="address"
                                  maxLength={61}
                                  className="form-control"
                                  id="validationCustom04"
                                  placeholder="Enter Your Address"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.address || ""}
                                  invalid={
                                    validation.touched.address &&
                                      validation.errors.address
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.address &&
                                  validation.errors.address ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.address}
                                  </FormFeedback>
                                ) : null}
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            {" "}
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom05">
                                  Country
                                </Label>
                                <select
                                  name="country"
                                  id="validationCustom05"
                                  className="form-control"
                                  rows="2"
                                  placeholder="Enter Your Country"
                                  onChange={validation.handleChange}
                                  value={validation.values.country || ""}
                                >
                                  <option value="">Select Country</option>
                                  {country.map((option, i) => (
                                    <option value={option?.value} key={i}>
                                      {option?.text}
                                    </option>
                                  ))}
                                </select>
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom05">
                                  State
                                </Label>
                                <select
                                  name="state"
                                  id="validationCustom05"
                                  className="form-control"
                                  rows="2"
                                  placeholder="Enter Your State"
                                  onChange={validation.handleChange}
                                  value={validation.values.state || ""}
                                >
                                  <option value="">Select State</option>
                                  {state.map((option, i) => (
                                    <option value={option?.value} key={i}>
                                      {option?.text}
                                    </option>
                                  ))}
                                </select>
                              </FormGroup>
                            </Col>
                          </Row>



                          <Row>
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom05">City</Label>
                                <Input
                                  name="city"
                                  id="validationCustom05"
                                  maxLength={31}
                                  className={`form-control ${validation.touched.city && validation.errors.city ? "is-invalid" : ""
                                    }`}
                                  rows="2"
                                  placeholder="Enter Your City"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.city || ""}
                                />
                                {validation.touched.city && validation.errors.city && (
                                  <div className="invalid-feedback">
                                    {validation.errors.city}
                                  </div>
                                )}
                              </FormGroup>
                            </Col>

                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom05">PostalCode</Label>
                                <Input
                                  name="postalCode"
                                  maxLength={11}
                                  id="validationCustom05"
                                  className={`form-control ${validation.touched.postalCode && validation.errors.postalCode
                                    ? "is-invalid"
                                    : ""
                                    }`}
                                  rows="2"
                                  placeholder="Enter Your PostalCode"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.postalCode || ""}
                                />
                                {validation.touched.postalCode && validation.errors.postalCode && (
                                  <div className="invalid-feedback">
                                    {validation.errors.postalCode}
                                  </div>
                                )}
                              </FormGroup>
                            </Col>

                          </Row>

                          <Row>
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom05">Expertise</Label>
                                <Input
                                  name="expertise"
                                  maxLength={31}
                                  id="validationCustom05"
                                  className={`form-control ${validation.touched.expertise && validation.errors.expertise
                                      ? "is-invalid"
                                      : ""
                                    }`}
                                  rows="2"
                                  placeholder="Enter Your Expertise"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.expertise || ""}
                                />
                                {validation.touched.expertise && validation.errors.expertise && (
                                  <div className="invalid-feedback">
                                    {validation.errors.expertise}
                                  </div>
                                )}
                              </FormGroup>
                            </Col>

                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom05">Jurisdiction</Label>
                                <Input
                                  name="jurisdiction"
                                  maxLength={31}
                                  id="validationCustom05"
                                  className={`form-control ${validation.touched.jurisdiction && validation.errors.jurisdiction
                                      ? "is-invalid"
                                      : ""
                                    }`}
                                  rows="2"
                                  placeholder="Enter Your Jurisdiction"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.jurisdiction || ""}
                                />
                                {validation.touched.jurisdiction && validation.errors.jurisdiction && (
                                  <div className="invalid-feedback">
                                    {validation.errors.jurisdiction}
                                  </div>
                                )}
                              </FormGroup>
                            </Col>

                          </Row>

                          <Row>
                            <Col lg="4">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom05">Fee</Label>
                                <textarea
                                  name="fee"
                                  maxLength={11}
                                  id="validationCustom05"
                                  className={`form-control ${validation.touched.fee && validation.errors.fee ? "is-invalid" : ""
                                    }`}
                                  rows="2"
                                  placeholder="Enter Your fee"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.fee || ""}
                                />
                                {validation.touched.fee && validation.errors.fee && (
                                  <div className="invalid-feedback">
                                    {validation.errors.fee}
                                  </div>
                                )}
                              </FormGroup>
                            </Col>

                            {/* <Col lg="4">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom05">SubDomain</Label>
                                <textarea
                                  name="subdomain"
                                  id="validationCustom05"
                                  className="form-control"
                                  rows="2"
                                  placeholder="Enter Your subdomain"
                                  onChange={validation.handleChange}
                                  value={validation.values.subdomain || ""}
                                />
                              </FormGroup>
                            </Col> */}
                            <Col lg="4">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom05">Bio</Label>
                                <textarea
                                  name="bio"
                                  maxLength={31}
                                  id="validationCustom05"
                                  className={`form-control ${validation.touched.bio && validation.errors.bio ? "is-invalid" : ""
                                    }`}
                                  rows="2"
                                  placeholder="Enter Your bio"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.bio || ""}
                                />
                                {validation.touched.bio && validation.errors.bio && (
                                  <div className="invalid-feedback">
                                    {validation.errors.bio}
                                  </div>
                                )}
                              </FormGroup>
                            </Col>

                          </Row>
                        </Form>
                        <div className="d-flex justify-content-end ">
                          <Button color="primary" type="submit">
                            SUBMIT
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default AttorneyRegister
