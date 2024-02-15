import React from "react"
import { Container, Row, Col, Button } from "reactstrap"
import { Link } from 'react-router-dom'
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props"
// import TwitterLogin from "react-twitter-auth"
import { GoogleLogin } from "react-google-login" 

import "./footerclr.scss"
const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer" id="footclr">
        <Container fluid  >
          <Row>
            <div className="col-md-3 col-sm-10 " id="footmen">
              <ul className="list-unstyled">
                <h3 className="text-primary">ABOUT</h3>
                <Link 
                role = "button"
                to = "#" className="text-dark">
                <li className="mt-4 font-size-14 "> - About Us</li>
                <li className="mt-3 font-size-14 "> - How it works</li>
                <li className="mt-3  font-size-14"> - Security</li>
                </Link>
              </ul>
            </div>

            <div className="col-md-3 col-sm-6" id="footmen">
              <ul className="list-unstyled ">
                <h3 className="text-primary">SOLUTION</h3>
                <Link 
                role = "button"
                to = "#" className="text-dark">
                <li className="mt-4 font-size-14 "> - Enterprise</li>
                <li className="mt-3 font-size-14 "> - Private Label</li>
                <li className="mt-3 font-size-14 "> - Management</li>
                </Link>
              </ul>
            </div>

            <div className="col-md-3 col-sm-6" id="footmen">
              <ul className="list-unstyled  ">
                <h3 className="text-primary">CONTACT</h3>
                <Link 
                role = "button"
                to = "#" className="text-dark">
                <li className="mt-4 font-size-14 "> - Contact Us </li>
                <li className="mt-3 font-size-14"> - Careers</li>
                <li className="mt-3  font-size-14"> - Security</li>
                </Link>
              </ul>
            </div>

            <div className="col-md-3 col-sm-6 ">
              <ul className="list-unstyled  ">
                <h3 className="text-primary">FOLLOW US</h3>
                <Link 
                role = "button"
                to = "#" >
                <li className="mt-4 text-dark  font-size-14" >
                  <i className="mdi mdi-facebook text-primary mx-2" />
                  Facebook{" "}
                </li>
                {/* <li><i className="mdi mdi-twitter"/>Twitter</li> */}
                <li className="mt-3 text-dark  font-size-14">
                  {" "}
                  <i className="mdi mdi-google text-primary mx-2" />
                  Google
                </li>
                </Link>
              </ul>
            </div>

            <hr></hr>

            <Col md={6}>{new Date().getFullYear()} © <Link to="#" id="footlog" ></Link></Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block mb-4">
                {/* Design & Develop by <Link to="#" id="footlog"><strong></strong></Link> */}
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
