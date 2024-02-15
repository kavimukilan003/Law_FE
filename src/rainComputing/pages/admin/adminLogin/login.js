import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React, { useState } from "react"
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap"

import { withRouter, Link } from "react-router-dom"

// Formik validation
import * as Yup from "yup"
import { useFormik } from "formik"

// import images
import profile from "assets/images/profile-img.png"
import logo from "assets/images/rain-drop.png"
import computer from "assets/images/computer.png"
import rainlogo from "assets/images/RainCom_Logo.webp"
import { adminLogin } from "rainComputing/helpers/backend_helper"

const AdminLogin = props => {
  const [loginError, setLoginError] = useState("")
  const [loading, setLoading] = useState(false)
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      firstname: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("Please Enter Your  Name"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async values => {
      setLoading(true)
      const res = await adminLogin(values)
      if (res.success) {
        localStorage.setItem("authAdmin", JSON.stringify(res))
        props.history.push("/admin-page")
      } else {
        setLoginError(res?.msg)
      }
      setLoading(false)
    },
  })
  return (
    <React.Fragment>
      <MetaTags>
        <title>Login | Raincomputing</title>
      </MetaTags>

      {/* <div className="d-none d-xl-block ps-lg-5 ms-lg-5">
        <img src={rainlogo} height="50" />
      </div> */}

      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome Admin !</h5>
                        <p>Sign in to continue to Rain.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/" className="auth-logo-light">
                      <div className="avatar-md profile-user-wid mb-4">
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
                      {loginError && (
                        <Alert className="fw-bolder text-center" color="danger">
                          {loginError}
                        </Alert>
                      )}

                      <div className="mb-3">
                        <Label className="form-label">User Name</Label>
                        <Input
                          name="firstname"
                          className="form-control"
                          placeholder="Enter Name"
                          type="firstname"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.firstname || ""}
                          invalid={
                            validation.touched.firstname &&
                            validation.errors.firstname
                              ? true
                              : false
                          }
                        />
                        {validation.touched.firstname &&
                        validation.errors.firstname ? (
                          <FormFeedback type="invalid">
                            {validation.errors.firstname}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <Input
                          name="password"
                          value={validation.values.password || ""}
                          type="password"
                          placeholder="Enter Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.password &&
                            validation.errors.password
                              ? true
                              : false
                          }
                        />
                        {validation.touched.password &&
                        validation.errors.password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mt-5 d-grid">
                        {loading ? (
                          <button
                            type="button"
                            className="btn btn-dark"
                            style={{ cursor: "not-allowed" }}
                          >
                            <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>
                            Validating login...
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary btn-block"
                            type="submit"
                          >
                            Log In
                          </button>
                        )}
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

AdminLogin.propTypes = {
  history: PropTypes.object,
}
export default withRouter(AdminLogin)
