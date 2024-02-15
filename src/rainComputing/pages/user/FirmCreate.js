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
  Table,
  CardTitle,
} from "reactstrap"

import classnames from "classnames"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"

import { Search } from "react-bootstrap-table2-toolkit"
import {
  getAllRegAttorneys,
  registerFirm,
} from "rainComputing/helpers/backend_helper"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import { useHistory } from "react-router-dom"

const FirmCreate = () => {
  const { SearchBar } = Search
  const history = useHistory()
  const { currentAttorney } = useUser()
  const [allUser, setAllUser] = useState([])
  const [selectedAttorneys, setSelectedAttorneys] = useState([])

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      firmname: "",
    },
    validationSchema: Yup.object({
      firmname: Yup.string().required("Please Enter Your Firm Name"),
    }),
    onSubmit: (values) => {
      handleFirmReg({
        attorneyId: currentAttorney._id,
        firmName: values.firmname,
        members: [...selectedAttorneys,currentAttorney._id],
      })
    },
  })
  const handleFirmReg = async payload => {
    const res = await registerFirm(payload)
    if (res.success) {
      history.push("/firmlanding")
    } else {
      console.log("Failed to registering attorney", res)
    }
  }
  const handleAddAttorneys = id => {
    if (selectedAttorneys.includes(id)) {
      const membersAfterRemove = selectedAttorneys.filter(m => m !== id)
      setSelectedAttorneys(membersAfterRemove)
    } else {
      setSelectedAttorneys([...selectedAttorneys, id])
    }
  }

  useEffect(() => {

    if (currentAttorney?._id) {

      const getAllUser = async () => {
        const res = await getAllRegAttorneys({
          attorneyID: currentAttorney._id,
        })
        if (res.success) {
          setAllUser(res.attorneys)
        }
      }
      getAllUser()
    }
  }, [currentAttorney])

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>RainComputing | RainComputing</title>
        </MetaTags>
        <Container fluid={true}>
          <Breadcrumbs title="Forms" breadcrumbItem="Form Rain" />
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
                    <h4 className="card-title mb-4"> Firm Create</h4>
                    <div className="wizard clearfix">
                      <div className="steps clearfix">
                        {/* <ul>
                          <NavItem className={classnames({})}>
                            <NavLink>
                              <span className="text">Firm Registration</span> 
                            </NavLink>
                          </NavItem>
                        </ul> */}
                      </div>
                      <div className="content clearfix mt-2">
                        <div>
                            <Row>
                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="validationCustom06">
                                    Firm Name
                                  </Label>
                                  <Input
                                    name="firmname"
                                    type="text"
                                    className="form-control"
                                    id="validationCustom06"
                                    placeholder="Enter Your Firm Name"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.firmname || ""}
                                    invalid={
                                      validation.touched.firmname &&
                                      validation.errors.firmname
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.firmname &&
                                  validation.errors.firmname ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.firmname}
                                    </FormFeedback>
                                  ) : null}
                                </FormGroup>
                              </Col>
                            </Row>
                        </div>
                      </div>
                      <div className="actions clearfix"></div>
                      <Card>
                        <CardTitle className="h4 mt-0">
                          Attorney List Table{" "}
                        </CardTitle>
                        <Row className="mb-2">
                          <Col md="4">
                            <div className="search-box me-2 mb-2 d-inline-block">
                              <div className="position-relative">
                                <SearchBar />
                                <i className="bx bx-search-alt search-icon" />
                              </div>
                            </div>
                          </Col>
                        </Row>

                        <CardBody>
                          <div className="table-responsive">
                            <Table className="table table-striped table-bordered mb-0">
                              <thead>
                                <tr>
                                  <th className="font-size-18">Select</th>
                                  <th className="font-size-18">S.No</th>
                                  <th className="font-size-18">First Name</th>
                                  <th className="font-size-18">Last Name</th>
                                  <th className="font-size-18">E-mail</th>
                                </tr>
                              </thead>
                              <tbody>
                                {allUser &&
                                  allUser.map((users, i) => (
                                    <tr key={i}>
                                      <th className="font-size-14" scope="row">
                                        <Input
                                          type="checkbox"
                                          onClick={() =>handleAddAttorneys(users?._id)}
                                          className="custom-control-input"
                                          id="customCheck1"
                                        />
                                      </th>
                                      <th className="font-size-14" scope="row">
                                        {i + 1}
                                      </th>
                                      <td className="font-size-14 ">
                                        {users?.regUser?.firstname}
                                      </td>
                                      <td className="font-size-14 ">
                                        {users?.regUser?.lastname}
                                      </td>
                                      <td className="font-size-14">
                                        {users?.regUser?.email}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </Table>
                          </div>
                        </CardBody>
                        
                      </Card>
                      <Button color="primary" type="submit">
                    SUBMIT
                  </Button>
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


export default FirmCreate
