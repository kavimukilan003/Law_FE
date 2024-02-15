import React, { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"

import PDF from "assets/guide/guide.pdf"
import { Card } from "reactstrap"
import { Link } from "react-router-dom"
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const Guide = () => {
  // const [numPages, setNumPages] = useState(null);
  // const [pageNumber, setPageNumber] = useState(1);

  // function onDocumentLoadSuccess({ numPages }) {
  //   setNumPages(numPages);
  // }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="py-5"
    >
      <iframe
        style={{
          width: "60%", // Adjust the width as needed
          height: "80%",
          justifyContent: "center",
          alignItems: "center",
        }}
        src="https://docs.google.com/document/d/e/2PACX-1vSp0klcBAfwTarj2LzqJ-_fGyhDc_uB4ciOzu34Ml4GrrPH0kACB_-voNtqcB8i0OBM5iOlWC5VDceI/pub?embedded=true"
      ></iframe>
    </div>
  )
}

export default Guide
