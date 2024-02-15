import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import React from "react"
import { getFileFromGFS } from "rainComputing/helpers/backend_helper"

function VoiceMessage({ msg }) {
  const [audioUrls, setAudioUrls] = useState(null)

  useEffect(() => {
    const fetchAudioUrls = async () => {
      try {
        const urls = await Promise.all(
          msg?.voiceMessage.map(async voiceMsg => {
            const { id } = voiceMsg || {}
            const name = voiceMsg?.name

            if (!id) {
              console.error("Voice message ID is undefined")
              return null
            }

            const audioFile = await getFileFromGFS(
              { id },
              {
                responseType: "blob",
              }
            )

            if (!audioFile) {
              console.error(
                `Failed to retrieve audio file for voice message with ID ${id}`
              )
              return null
            }

            const audioBlob = new Blob([audioFile])
            const audioUrl = URL?.createObjectURL(audioBlob)

            return {
              audioUrl,
              name,
            }
          })
        )

        setAudioUrls(urls)
      } catch (error) {
        console.error(`Failed to fetch audio URLs: ${error}`)
      }
    }

    fetchAudioUrls()
  }, [msg])

  if (!audioUrls) {
    return "Loading..."
  }

  return (
    <div>
      {audioUrls.map((audioUrl, i) => (
        <div key={i}>
          <audio
            src={audioUrl.audioUrl}
            controls
            onLoadedMetadata={() => console.log("Audio loaded")}
            className="d-block d-sm-none"
            style={{
              height: "40px",
              paddingRight: "164px",
              marginLeft: "-18px",
              paddingTop: "6px",
            }}
          />
          <audio
            src={audioUrl.audioUrl}
            controls
            onLoadedMetadata={() => console.log("Audio loaded")}
            className="d-none d-sm-block"
          />

          {/* <div style={{ wordBreak: "break-all" }}>{audioUrl.name}</div> */}
        </div>
      ))}
    </div>
  )
}

VoiceMessage.propTypes = {
  msg: PropTypes.object,
}

export default VoiceMessage
