import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React, { useState } from "react"
import {
  Row,
  Col,
  Alert,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Input,
  Label,
  Form,
} from "reactstrap"

import { withRouter, Link } from "react-router-dom"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"
// import images
import profile from "assets/images/profile-img.png"
import logo from "assets/images/rain-drop.png"
import { setResetPassword } from "rainComputing/helpers/backend_helper"

const EmailForgetPassword = props => {
  const [resetError, setResetError] = useState("")
  const [resetSucess, setResetSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
    }),
    onSubmit: async (values, onSubmitProps) => {
      setLoading(true)
      const res = await setResetPassword({ ...values, aflag: true })
      if (res.success) {
        setResetError("")
        setResetSuccess(res.msg)
        // onSubmitProps.setSubmitting(false) //Vidhya
        onSubmitProps.resetForm()
      } else {
        setResetSuccess("")
        setResetError(res.msg)
      }
      setLoading(false)
    },
  })

  return (
    <React.Fragment>
      <MetaTags>
        <title>Forget Password | RainComputing </title>
      </MetaTags>
      <div className="home-btn d-none d-sm-block"></div>
      <div className="account-pages pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-softbg-soft-primary">
                  <Row>
                    <Col xs={7}>
                    <div className="text-white p-4">
                          <h5 className="text-white">Forgot your password ?</h5>
                          <p>Enter your Email to retrive.</p>
                        </div>
                    </Col>
                    <Col className="col-5 flex align-self-end ">
                      
                      <img src={profile}  height="100" width="800" alt="" className="img-fluid" />
                      
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-2">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logo}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={e => {
                        e.preventDefault()
                        validation.handleSubmit()
                        return false
                      }}
                    >
                      {resetSucess && (
                        <Alert
                          className="fw-bolder text-center"
                          color="success"
                        >
                          {resetSucess}
                        </Alert>
                      )}

                      {resetError && (
                        <Alert color="danger" className="fw-bolder text-center">
                          {resetError}
                        </Alert>
                      )}
                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <Row className="mb-3">
                        <Col className="text-end">
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
                            <button
                              className="btn btn-primary w-md "
                              type="submit"
                            >
                              Reset
                            </button>
                          )}
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Go back to{" "}
                  <Link to="login" className="font-weight-medium text-primary">
                    Login
                  </Link>{" "}
                </p>
                <p>
                  © {new Date().getFullYear()} Rain. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by RainComputing
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

EmailForgetPassword.propTypes = {
  history: PropTypes.object,
}

export default withRouter(EmailForgetPassword)
