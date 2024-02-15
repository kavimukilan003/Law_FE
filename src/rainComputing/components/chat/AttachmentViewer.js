import React from "react"
import PropTypes from "prop-types"
import "./style/attachment-viewer.scss"
import ImageViewer from "./ImageViewer"
import { SERVER_URL } from "rainComputing/helpers/configuration"
import { getFileFromGFS } from "rainComputing/helpers/backend_helper"
import fileDownload from "js-file-download"
const AttachmentViewer = ({ attachments, text }) => {
  const handleFileDownload = async ({ id, filename }) => {
    getFileFromGFS(
      { id },
      {
        responseType: "blob",
      }
    ).then(res => {
      fileDownload(res, filename)
    })
  }
  return (
    <div className="att_wrapper">
      {attachments?.map((att, a) => (
        <div key={a} className="att_item">
          {att?.type?.includes("image") ? (
            <ImageViewer imgData={att} />
          ) : (
            <div key={a} className="">
              {att?.type?.includes("pdf") ? (
                <a
                  href={`${SERVER_URL}/file/${att?.id}`}
                  download={att?.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="att_file aligner"
                >
                  <div className="aligner_item">
                    <i
                      className="mdi mdi-file-pdf mdi-36px text-center"
                      style={{ color: "red", padding: 2 }}
                    />
                    <div style={{ wordBreak: "break-all" }}>{att?.name}</div>
                  </div>
                </a>
              ) : (
                <div className="aligner_item">
                  {att?.type?.includes("audio/mpeg") ? (
                    <i
                      className="mdi mdi-music text-success mdi-36px"
                      onClick={() =>
                        handleFileDownload({
                          id: att?.id,
                          filename: att?.name,
                        })
                      }
                    />
                  ) : (
                    <div className="aligner_item">
                      <i
                        className="mdi mdi-file-document-multiple text-success mdi-36px"
                        onClick={() =>
                          handleFileDownload({
                            id: att?.id,
                            filename: att?.name,
                          })
                        }
                      />
                      <div style={{ wordBreak: "break-all" }}>{att?.name}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

AttachmentViewer.propTypes = {
  attachments: PropTypes.array,
  text: PropTypes.string,
}
export default AttachmentViewer
