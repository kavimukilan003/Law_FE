import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
// import PropTypes from "prop-types"
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
  DropdownToggle,
  Dropdown,
} from "reactstrap"
// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import {
  attorneyDetailsUpdate,
  regAttorneyDetails,
} from "rainComputing/helpers/backend_helper"
import { useToggle } from "rainComputing/helpers/hooks/useToggle"
import DynamicModel from "rainComputing/components/modals/DynamicModal"
import DynamicSuspense from "rainComputing/components/loader/DynamicSuspense"
import AttorneyCalendar from "rainComputing/pages/Calendar/AttorneyCalendar"
import toastr from "toastr"

const AttorneyDetailsCard = () => {
  const { currentUser, setCurrentUser } = useUser()
  const [attorneyDetail, setAttorneyDetail] = useState({})
  const { currentAttorney } = useUser()
  const [loading, setLoading] = useState(false)
  const {
    toggleOpen: CalendarModelOpen,
    setToggleOpen: setCalendarModelOpen,
    toggleIt: toggleCalendarModelOpen,
  } = useToggle(false)
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      attorneybarnumber: attorneyDetail?.registerNumber,
      phonenumber: attorneyDetail?.phoneNumber,
      email: currentUser.email,
      firm: attorneyDetail?.firm,
      bio: attorneyDetail?.bio,
      address: attorneyDetail?.address,
      country: attorneyDetail?.country,
      state: attorneyDetail?.state,
      city: attorneyDetail?.city,
      postalCode: attorneyDetail?.postalCode,
      expertise: attorneyDetail?.expertise,
      jurisdiction: attorneyDetail?.jurisdiction,
      fee: attorneyDetail?.fee,
      subdomain: attorneyDetail?.subdomain,
    },
    validationSchema: Yup.object({
      phonenumber: Yup.string().max(20, 'Must be 20 characters or less'),
      firm: Yup.string().max(30, 'Must be 30 characters or less'),
      bio: Yup.string().required("Please Enter Your bio"),
      address: Yup.string().max(60, 'Must be 60 characters or less'),
      city: Yup.string().max(30, 'Must be 30 characters or less'),
      postalCode: Yup.string().max(10, 'Must be 10 characters or less'),
      expertise: Yup.string().max(30, 'Must be 30 characters or less'),
      jurisdiction: Yup.string().max(30, 'Must be 30 characters or less'),
      fee: Yup.string().required("Please Enter Your fee"),
      // subdomain: Yup.string().required("Please Enter Your subdomain"),
      attorneybarnumber: Yup.string().max(30, 'Must be 30 characters or less'),
    }),
    onSubmit: async values => {
      const res = await attorneyDetailsUpdate({
        ...values,
        userID: attorneyDetail?._id,
      })
      if (res.success) {
        toastr.success("Profile updated successfully")
      }
    },
  })

  useEffect(() => {
    if (currentAttorney) {
      const payload = { id: currentAttorney._id }
      const getAttorneyinfo = async () => {
        const res = await regAttorneyDetails(payload)
        const { attorney } = res
        if (attorney) {
          setAttorneyDetail(attorney)
        }
      }
      getAttorneyinfo()
    }
  }, [currentAttorney])
  const country = [
    { value: "india", text: "India" },
    { value: "usa", text: "USA" },
    { value: "england", text: "England" },
    { value: "china", text: "China" },
  ]
  const state = [
    { value: "tamilnadu", text: "Tamilnadu" },
    { value: "california", text: "California" },
    { value: "zhejiang", text: "Zhejiang" },
    { value: "london", text: "London" },
  ]
  return (
    <React.Fragment>
      <div>
        <MetaTags>
          <title>RainComputing </title>
        </MetaTags>

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
                              <h4 className="d-flex font-size-18 text-primary card-title mt-2">
                                {" "}
                                Personal Info
                              </h4>{" "}
                            </NavLink>
                          </NavItem>
                        </ul>
                      </div>

                      <DynamicModel
                        open={CalendarModelOpen}
                        toggle={toggleCalendarModelOpen}
                        size="lg"
                        footer={false}
                      >
                        <DynamicSuspense>
                          <AttorneyCalendar
                            setcalendarModalOpen={setCalendarModelOpen}
                          />
                        </DynamicSuspense>
                      </DynamicModel>
                      {/* <div className="d-flex justify-content-end">
                        <Dropdown toggle={() => toggleCalendarModelOpen(true)}>
                          <DropdownToggle className="btn nav-btn" tag="i">
                            <button type="button" className="btn btn-primary">
                              <span className="fas fa-plus"></span> ScheduleDates
                            </button>
                          </DropdownToggle>
                        </Dropdown>
                      </div> */}
                      <div className="content clearfix mt-4">
                        <Row>
                          <Col lg="6">
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom01">
                                Attorney BarNumber
                              </Label>

                              <Input
                                name="attorneybarnumber"
                                maxLength={31}
                                type="text"
                                readOnly
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
                              <Label htmlFor="validationCustom03">
                                Phone Number
                              </Label>
                              <Input
                                type="text"
                                maxLength={21}
                                name="phonenumber"
                                className="form-control"
                                id="validationCustom03"
                                placeholder="Enter Your Phone Number"
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
                        </Row>
                        <Row>
                          <Col lg="6">
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom04">Firm</Label>
                              <Input
                                type="text"
                                name="firm"
                                maxLength={31}
                                className="form-control"
                                id="validationCustom04"
                                placeholder="Enter Your Email ID"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.firm || ""}
                                invalid={
                                  validation.touched.firm &&
                                  validation.errors.firm
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.firm &&
                              validation.errors.firm ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.firm}
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
                                maxLength={61}
                                name="address"
                                className="form-control"
                                id="validationCustom04"
                                placeholder="Enter Your address"
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
                          <Col lg="6">
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom04">
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
                              <Label htmlFor="validationCustom04">State</Label>
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
                              <Label htmlFor="validationCustom04">City</Label>
                              <Input
                                type="text"
                                name="city"
                                maxLength={31}
                                className="form-control"
                                id="validationCustom04"
                                placeholder="Enter Your City"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.city || ""}
                                invalid={
                                  validation.touched.city &&
                                  validation.errors.city
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.city &&
                              validation.errors.city ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.city}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom04">
                                PostalCode
                              </Label>
                              <Input
                                type="text"
                                name="postalCode"
                                maxLength={11}
                                className="form-control"
                                id="validationCustom04"
                                placeholder="Enter Your PostalCode"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.postalCode || ""}
                                invalid={
                                  validation.touched.postalCode &&
                                  validation.errors.postalCode
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.postalCode &&
                              validation.errors.postalCode ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.postalCode}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row>
                          <Col lg="6">
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom04">Expertise</Label>
                              <Input
                                type="text"
                                maxLength={31}
                                name="expertise"
                                className="form-control"
                                id="validationCustom04"
                                placeholder="Enter Your Expertise"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.expertise || ""}
                                invalid={
                                  validation.touched.expertise &&
                                  validation.errors.expertise
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.expertise &&
                              validation.errors.expertise ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.expertise}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom04">
                                Jurisdiction
                              </Label>
                              <Input
                                type="text"
                                maxLength={31}
                                name="jurisdiction"
                                className="form-control"
                                id="validationCustom04"
                                placeholder="Enter Your Jurisdiction"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.jurisdiction || ""}
                                invalid={
                                  validation.touched.jurisdiction &&
                                  validation.errors.jurisdiction
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.jurisdiction &&
                              validation.errors.jurisdiction ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.jurisdiction}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row>
                        <Col lg="4">
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom04">Fee</Label>
                              <textarea
                                type="text"
                                name="fee"
                                maxLength={11}
                                className="form-control"
                                id="validationCustom04"
                                placeholder="Enter Your Fee"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.fee || ""}
                                invalid={
                                  validation.touched.fee &&
                                  validation.errors.fee
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.fee &&
                              validation.errors.fee ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.fee}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                          {/* <Col lg="4">
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom04">SubDomain</Label>
                              <textarea
                                type="text"
                                name="subdomain"
                                className="form-control"
                                id="validationCustom04"
                                placeholder="Enter Your subdomain"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.subdomain || ""}
                                invalid={
                                  validation.touched.subdomain &&
                                  validation.errors.subdomain
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.subdomain &&
                              validation.errors.subdomain ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.subdomain}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col> */}
                          <Col lg="4">
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom04">Bio</Label>
                              <textarea
                                type="text"
                                name="bio"
                                maxLength={31}
                                className="form-control"
                                id="validationCustom04"
                                placeholder="Enter Your Bio"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.bio || ""}
                                invalid={
                                  validation.touched.bio &&
                                  validation.errors.bio
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.bio &&
                              validation.errors.bio ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.bio}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <div className=" pt-2 d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary">
                              Update
                            </button>
                          </div>
                        </Row>
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

export default AttorneyDetailsCard
