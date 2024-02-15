import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React, { useEffect, useState } from "react"
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
import toastr from "toastr"

//redux
// import { useSelector, useDispatch } from "react-redux";

import { withRouter, Link, useLocation } from "react-router-dom"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"

// import images
import profileImg from "assets/images/profile-img.png"
import logo from "assets/images/rain-drop.png"
import { setForgettingPassword } from "rainComputing/helpers/backend_helper"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

function useQuery() {
  const { search } = useLocation()
  return React.useMemo(() => new URLSearchParams(search), [search])
}

const ForgetPasswordPage = props => {
  const query = useQuery()
  const history = useHistory()
  const [forgetError, setForgetError] = useState("")
  const [forgetSuccessMsg, setForgetSuccessMsg] = useState("")

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      NewPassword: "",
      // ConfirmPassword:''
    },
    validationSchema: Yup.object({
      NewPassword: Yup.string()
        .required("Please Enter Your Password")
        .matches(/^(?=.{5,16}$)/, "Must Contain 5 to 16 Characters"),
      // ConfirmPassword: Yup.string().oneOf([Yup.ref('NewPassword'),null],"ConfirmPassword doesn't match"),
    }),
    onSubmit: async (values, onSubmitProps) => {
      if(values?.NewPassword.length <= 16) {
      await handleSetPasswordLink(values?.NewPassword)
      onSubmitProps.resetForm()
    }else{
      toastr.error(`Your passsword 16 charcters above`, "error")
    }
  }
  })

  const handleSetPasswordLink = async pw => {
    const payload = {
      verifyToken: query.get("token"),
      newPassword: pw,
    }
    const res = await setForgettingPassword(payload)
    if (res.success) {
      setForgetSuccessMsg("Your passsword has been reseted successfully")
      toastr.success(`Your passsword has been reseted successfully`, "Success")
      history.push("/login")
    } else {
      setForgetError(res?.msg || "Something went wrong")
    }
  }

  return (
    <React.Fragment>
      <MetaTags>
        <title>Forget Password | RainComputing</title>
      </MetaTags>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-softbg-soft-primary">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p>Sign in to continue to Skote.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profileImg} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
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
                    {forgetError && (
                      <Alert color="danger" style={{ marginTop: "13px" }}>
                        {forgetError}
                      </Alert>
                    )}
                    {forgetSuccessMsg && (
                      <Alert color="success" style={{ marginTop: "13px" }}>
                        {forgetSuccessMsg}
                      </Alert>
                    )}

                    <Form
                      className="form-horizontal"
                      onSubmit={e => {
                        e.preventDefault()
                        validation.handleSubmit()
                        return false
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label">New Password :</Label>
                        <Input
                          name="NewPassword"
                          className="form-control"
                          placeholder="Enter Password"
                          type="password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.NewPassword || ""}
                          invalid={
                            validation.touched.NewPassword &&
                            validation.errors.NewPassword
                              ? true
                              : false
                          }
                        />
                        {validation.touched.NewPassword &&
                        validation.errors.NewPassword ? (
                          <FormFeedback type="invalid">
                            {validation.errors.NewPassword}
                          </FormFeedback>
                        ) : null}
                      </div>
                      {/* <div className="mb-3">
                        <Label className="form-label">Confirm Password :</Label>
                        <Input
                          name="ConfirmPassword"
                          className="form-control"
                          placeholder="Enter Password"
                          type="password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.ConfirmPassword || ""}
                          invalid={
                            validation.touched.ConfirmPassword && validation.errors.ConfirmPassword ? true : false
                          }
                        />
                        {validation.touched.ConfirmPassword && validation.errors.ConfirmPassword ? (
                          <FormFeedback type="invalid">{validation.errors.ConfirmPassword}</FormFeedback>
                        ) : null}
                      </div> */}
                      <Row className="mb-3">
                        <Col className="text-end">
                          <button
                            className="btn btn-primary w-md "
                            type="submit"
                          >
                            Submit
                          </button>
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

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
}

export default withRouter(ForgetPasswordPage)
