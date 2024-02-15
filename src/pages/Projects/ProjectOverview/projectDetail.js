import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import "../../Projects/ProjectOverview/projectdetail.scss"
import { map, get, attempt } from "lodash"
import { Button, Card, CardBody, Col, Row } from "reactstrap"
import { Link } from "react-router-dom"
import { attImages } from "../../../helpers/mockData"

const ProjectDetail = ({ project }) => {
  const imgIndex = Math.floor(Math.random() * 8)

  // const date = new Date(project.scheduleDates)
  // const options = { year: "numeric", month: "2-digit", day: "2-digit" }
  // const formattedDate = date
  //   .toLocaleDateString("en-US", options)
  const options = { year: "numeric", month: "2-digit", day: "2-digit" }

  const formattedDates = project.scheduleDates.map(date => {
    const formattedDate = new Date(date)
      .toLocaleDateString("en-US", options)
      .split("/")
      .join("-")
      .replace(/(\d{2})-(\d{2})-(\d{4})/, "$2-$1-$3")
    return formattedDate
  })
  console.log("formatteddates", formattedDates)
  return (
    <div id="" className="bg-white">
      <div>
        <div className="p-3">
          <div className="row">
            <div className="col-xs-12 col-lg-6 ">
              <div
                className="d-flex justify-content-center  p-5"
                id="profilebox"
              >
                <img
                  id="Attprofile"
                  className="mt-5 row-sm-6"
                  src={
                    project?.regUser?.profilePic
                      ? project?.regUser?.profilePic
                      : attImages[imgIndex].url
                  }
                  alt=""
                  style={{
                    width: "300px",
                    height: "300px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
            <div className="col-xs-12 col-lg-6 ">
              <div className="">
                <h1 className="">
                  {project?.regUser?.firstname} {project?.regUser?.lastname}
                </h1>
              </div>
              <div className="">
                <h5 className="font-size-14">{project?.firm}</h5>
              </div>
              <div>
                {" "}
                <h5 className="font-size-18  text-primary mt-3">Bio :</h5>
                <p className="text-muted font-size-14">
                  {project.bio ? project.bio : null}
                </p>
              </div>
              <div className="mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-telephone"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                </svg>
                <span className="font-size-14 ms-3">
                  {project?.phoneNumber}
                </span>
              </div>
              <div className="mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-envelope"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                </svg>
                <span className="font-size-14  ms-3">
                  {project?.regUser?.email}
                </span>
              </div>
              <div className="mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-geo-alt"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                  <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                </svg>
                <span className="text-lowercase font-size-14 ms-3">
                  {project?.address},{project?.city},{project?.state},
                  {project?.country},{project?.postalCode}
                </span>
              </div>
              {formattedDates.length > 0 && (
              <h5 className="font-size-18 text-primary mt-3">
                Available Dates:
              </h5>
              )}
              <div className="row row-cols-md-5 row-cols-3 g-3">
              
                {formattedDates.map((formattedDate, i) => (
                  <div className="col" key={i}>
                    <Button className="bg-success w-100">
                      {formattedDate}
                    </Button>
                  </div>
                ))}
              </div>

              {/* <ul className="list-group">
                {formattedDates.split(",").map((date, i) => (
                  <li key={i} className="list-group-item">
                    {date.trim()}
                  </li>
                ))}
              </ul> */}
              {/* <div className="d-flex  mt-5 ">
                <Link to={`/payment-via?uid=${project._id}`}>
                  <button type="button" className="btn btn-primary  w-lg ">
                    Get Appointment
                  </button>
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ProjectDetail.propTypes = {
  project: PropTypes.object,
}

export default ProjectDetail
