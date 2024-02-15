import React, { useState, useEffect } from "react"
import MetaTags from "react-meta-tags"
import { Link, withRouter } from "react-router-dom"
import { Col, Container, Row } from "reactstrap"
import { map } from "lodash"
import banner from "../../../assets/images/background-img/banner.jpg"
import illustration from "../../../assets/images/law-illustration.jpg"
import PerfectScrollbar from "react-perfect-scrollbar"
import contact from "../../../assets/images/contact-mail.gif"

//Import Card
import LandingCard from "./LandingCard"

// //redux
// import {
//   getAllAttorneys,
//   getAttorneysCount,
// } from "rainComputing/helpers/backend_helper"

import { getAllRegAttorneys } from "rainComputing/helpers/backend_helper"

import Pagination from "components/pagination/Pagination"
import { useDropzone } from "react-dropzone"

const LandingGrid = () => {
  const [searchText, setSearchText] = useState("")
  const [searchTextError, setSearchTextError] = useState("");
  const [loading, setLoading] = useState(true)
  const [attorneys, setAttorneys] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const loadAttorney = async () => {
    const res = await getAllRegAttorneys({ page, limit, searchText })
    console.log("PR RES",res)
    if (res.success) {
      // console.log(first)
      setAttorneys(res.attorneys)
    } else {
      console.log("Error while fetching Attorneys", res)
    }
  }
  // const loadAttorneyCount = async () => {
  //   const res = await getAttorneysCount({ searchText })
  //   if (res.success) {
  //     setAttorneysCount(res.count)
  //   } else {
  //   }
  // }

  useEffect(() => {
    const handleLoad = async () => {
      setLoading(true)
      await loadAttorney()
      setLoading(false)
    }
    handleLoad()
  }, [page, limit,searchText])

  useEffect(() => {
    setPage(1)
  }, [searchText])

  
  {searchTextError && (
    <div className="invalid-feedback">{searchTextError}</div>
  )}
  return (
    <React.Fragment>
      <div>
        <div className="" style={{ marginTop: 100 }} id="landinggrid">
          <div className="mb-2">
            <div className="app-search ">
              <input
                type="text-success"
                className="form-control "
                placeholder="Search for Attorney with Name, Firm, Expertise, Jurisdiction and Fee..."
                value={searchText}
                onChange={(e) => {
                  const text = e.target.value;
                  if (text.length <= 30) {
                    setSearchText(text);
                    setSearchTextError("");
                  } else {
                    setSearchTextError("Search text cannot exceed 30 characters");
                  }
                }}
              />
              {/* <span className="bx bx-search-alt mt-3" /> */}
            </div>
          </div>
          {loading ? (
            <Row>
              <Col xs="12">
                <div className="text-center my-3">
                  <Link to="#" className="text-success">
                    <i className="bx bx-hourglass bx-spin me-2" />
                    Loading. . .
                  </Link>
                </div>
              </Col>
            </Row>
          ) : (
            <>
              <Row>
                {attorneys
                  ?.filter(
                    item =>
                      item?.regUser?.firstname
                        ?.toString()
                        .toLowerCase()
                        .includes(searchText.toString().toLowerCase()) ||
                      item?.regUser?.lastname
                        ?.toString()
                        .toLowerCase()
                        .includes(searchText.toString().toLowerCase()) ||
                      item?.firm
                        ?.toString()
                        .toLowerCase()
                        .includes(searchText.toString().toLowerCase()) ||
                        item?.fee
                        ?.toString()
                        .toLowerCase()
                        .includes(searchText.toString().toLowerCase()) ||
                        item?.expertise
                        ?.toString()
                        .toLowerCase()
                        .includes(searchText.toString().toLowerCase()) ||
                        item?.jurisdiction
                        ?.toString()
                        .toLowerCase()
                        .includes(searchText.toString().toLowerCase())
                  )
                  .slice((page - 1) * 12, page * 12)
                  .map((user, key) => (
                    <LandingCard user={user} key={"_user_" + key} />
                  ))}
              </Row>
              <div className="d-flex justify-content-center">
                <Pagination
                  className="pagination-bar"
                  currentPage={page}
                  totalCount={attorneys?.length}
                  pageSize={limit}
                  onPageChange={p => setPage(p)}
                />
              </div>

              {/* <div>
         <div  id="bannerimg" className="text-white"> A law firm with a passion for success<br/>
              <div id="rights">Protecting Your<span className="text-primary" id="span"> Rights</span>, Your <span className="text-primary" id="span">Freedom</span>, Your <span className="text-primary" id="span">Future</span></div>
         </div> 
      
          <img src= {banner} alt="banner background"  id="banner"/>
           
      </div> */}
              <section style={{ paddingTop: "50px", paddingBottom: "60px" }}>
                <div>
                  <div className="d-flex flex-md-row flex-column">
                    <div className="col-lg-7 col-sm-6">
                      <div>
                        {/* <h2 className=" text-primary mb-5 ">
                          About Us{" "}
                          <div
                            style={{
                              width: "70px",
                              height: "3px",
                              backgroundColor: "#556ee6",
                              borderRadius: "10px",
                            }}
                          ></div>
                        </h2> */}
                      </div>
                      {/* <p style={{ fontSize: 15 }}>
                        Rain Computing’s ChatPro<sup>TM</sup> provides a Case-Based Instant
                        Messaging (CBIM) platform for professionals, such as,
                        lawyers, accountants, etc., to better manage their cases
                        and client correspondences. Unlike traditional emails,
                        all messages in ChatPro<sup>TM</sup> are securely transmitted and
                        kept in one place, and properly organized even before
                        they are sent. In addition to instant messaging,
                        ChatPro<sup>TM</sup> system can be coupled with various case
                        management tools to simplify tasks, such as, client
                        intake, due date management, etc. Please feel free to
                        try it out and contact our sales team for corporate
                        accounts.
                      </p> */}
                    </div>

                    {/* <div className="flex-fill col-lg-5 col-sm-12 d-flex justify-content-end ">
                      <img
                        src={illustration}
                        alt="about illustration"
                        className="img-fluid"
                        id="illimage"
                      />
                    </div> */}
                  </div>
                </div>
              </section>
              <div
                className=" d-flex flex-md-row flex-column  "
                style={{ paddingTop: "50px", paddingBottom: "120px" }}
              >
                {/* <div className="col-md-6 col-sm-12 text-center ">

                  <img src={contact} alt="contact info" id="congif" />

                  <h4>Love to hear from you</h4>
                  <p>Stay Connected.....</p>
                </div> */}

                {/* <div className="col-md-6 col-sm-12">
                  <h2>Contact Us </h2>
                  <div id="contactline"></div>

                  <div className="formsec">
                    <form>
                      <input
                        type="text"
                        placeholder="FirstName"
                        required
                        id="formcon1"
                      ></input>
                      <input
                        type="text"
                        placeholder="LastName"
                        id="formcon"
                      ></input>
                      <input
                        type="email"
                        placeholder="Mail ID"
                        required
                        id="formcon1"
                      ></input>

                      <input
                        type="tel"
                        placeholder="Phone no"
                        id="formcon"
                      ></input>
                    </form>
                    <button type="button" id="formbut">
                      Submit
                    </button>
                  </div>
                </div> */}
              </div>
            </>
          )}

          {/* <div className="py-5">
            <iframe
              src="https://webchat.botframework.com/embed/testrainbot-bot?s=8ugnF6uTJL4.-geCgZnAB57pnDg_qR3LdDFbCrZ0cQd4ObBVhmNUaSQ"
              style={{ minWidth: "400px", width: "100px", height: "500px" }}
            ></iframe>
          </div> */}
        </div>
      </div>
    </React.Fragment>
  )
}

export default withRouter(LandingGrid)
