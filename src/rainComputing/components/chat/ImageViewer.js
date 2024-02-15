import React, { useEffect, useState, memo } from "react";
import PropTypes from "prop-types";
import { SERVER_URL } from "rainComputing/helpers/configuration";
const ImageViewer = ({ imgData }) => {
  return (
    <div className="image-container">
      <a
        href={`${SERVER_URL}/file/${imgData?.id}`}
        download={imgData?.name}
        target="_blank"
        rel="noopener noreferrer"
        className="att_file"
        // onMouseEnter={openModal} // Open the modal on hover
      >
        <img
          src={`${SERVER_URL}/file/${imgData?.id}`}
          alt={imgData?.name}
          className="att_file-img"
        />
      </a>
        <img
          src={`${SERVER_URL}/file/${imgData?.id}`}
          alt={imgData?.name}
          className="att_file "
        />
    </div>
  );
};
ImageViewer.propTypes = {
  imgData: PropTypes.object,
};
export default memo(ImageViewer);