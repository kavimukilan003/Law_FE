import React from "react"
import PropTypes from "prop-types"
import { useCallback, useState } from "react"
import ReactQuill from "react-quill"
import "quill-emoji/dist/quill-emoji.css";
import EmojiBlot from "quill-emoji/dist/quill-emoji"
import Quill from 'quill';
import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";
import { error } from "logrocket";
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import useMediaQuery from "rainComputing/helpers/hooks/useMediaQuery";

const ReactQuillInput = ({
  value,
  onChange,
  mentionsArray,
  messages,
  curMessageId,
  isQuill,
  onKeyPress,
  isEmptyOrSpaces,
  setModalOpen,
  isFullScreen,
  currentChat,
  currentCase,
  getChatName,
  inputBoxHeight,
  setAllFiles,
  subject,
  setSubject
}) => {
  const [isMobile] = useMediaQuery("764")

  const onSubjectChange = (e) => {
    // Handle the subject input change here
    const inputValue = e.target.value; // Truncate to 20 characters

    if (e.target.value.length > 20) {
      toastr.error("Maximum 20 characters allowed", "Error");
    } else {
      setSubject(inputValue);
    }
  };

  let modules = {
    toolbar: false,
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["@"],
      spaceAfterInsert: true,
      source: useCallback(
        (searchTerm, renderList, mentionChar) => {
          let values
          if (mentionChar === "@") {
            values = mentionsArray?.map(m => ({ id: m?.id, value: m?.display }))
          }
          if (searchTerm.length === 0) {
            renderList(values, searchTerm)
          } else {
            const matches = values.filter(item =>
              item.value.toLowerCase().includes(searchTerm.toLowerCase())
            )
            renderList(matches, searchTerm)
          }
        },
        [mentionsArray]
      ),
    },
  }
  Quill.register("modules/emoji", EmojiBlot);
  let modules1 = {
    toolbar: [
      [{ header: "1" }, { header: "2" }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
      [{ emoji: true }],
    ],
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["@"],
      spaceAfterInsert: true,
      source: useCallback(
        (searchTerm, renderList, mentionChar) => {
          let values
          if (mentionChar === "@") {
            values = mentionsArray?.map(m => ({ id: m?.id, value: m?.display }))
          }
          if (searchTerm.length === 0) {
            renderList(values, searchTerm)
          } else {
            const matches = values.filter(item =>
              item.value.toLowerCase().includes(searchTerm.toLowerCase())
            )
            renderList(matches, searchTerm)
          }
        },
        [mentionsArray]
      ),
    },
    "emoji-toolbar": true,
    "emoji-shortname": true,
  }
  const place = currentChat?.isGroup
    ? currentCase?.caseName || "Case Chat"
    : getChatName(currentChat.groupMembers)
  const placeholder = `Message ${place}`;

  // InputBox Drag And Drop Function
  const { getRootProps, getInputProps } = useDropzone({
    accept:
      ".png, .jpg, .jpeg,.pdf,.doc,.xls,.docx,.xlsx,.zip,.mp3,.webm,.ogg,.wav",
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to megabytes

        if (fileSizeInMB <= 25) {
          setAllFiles((prevFiles) => [
            ...prevFiles,
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
          ]);
        } else {
          toastr.error("File size should be 25 MB or less", "Error");
        }
      });
    },
    noClick: true, // Prevent opening file dialog on click
    noKeyboard: true,
  });

  return (
    <div style={{ position: "relative" }}>
      {isQuill && (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <ReactQuill
            theme="snow"
            className="quil"
            value={value}
            onKeyDown={onKeyPress}
            modules={modules}
            placeholder={placeholder}
            defaultValue={messages?.find(
              m => m._id === curMessageId?.messageData
            )}
            disabled={() => isEmptyOrSpaces()}
            // onChange={(content, delta, source, editor) => {
            //   onChange(content, delta, source, editor)
            // }}
            onChange={onChange}
            style={{
              flex: 1,
              height: inputBoxHeight,
              wordBreak: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "pre-line",
            }}
          />
        </div>
      )}
      {!isQuill && (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isMobile ? (
<>
<input
            type="text"
            placeholder="Type the Subject of this message..."
            value={subject}
            onChange={onSubjectChange}
            className="px-2 py-1 text-break mb-1 border border-2 border-dark rounded-3 "
            style={{
              position: "absolute",
              right: "50px",
              top: "5px",
              width: "250px",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "pre-line",
              minWidth: "fit-content"
            }}
          />
</>
          ) : (
            <>
          <input
            type="text"
            placeholder="Type the Subject of this message..."
            value={subject}
            onChange={onSubjectChange}
            className="px-2 py-1 text-break mb-1 border border-2 border-dark rounded-3 "
            style={{
              position: "absolute",
              right: "20px",
              top: "40px",
              width: "130px",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "pre-line",
              minWidth: "fit-content"
            }}
          />
          </>
          )}
          <ReactQuill
            theme="snow"
            className="quil"
            value={value}
            onKeyDown={onKeyPress}
            modules={modules1}
            placeholder={placeholder}
            defaultValue={messages?.find(
              m => m._id === curMessageId?.messageData
            )}
            disabled={() => isEmptyOrSpaces()}
            // onChange={(content, delta, source, editor) => {
            //   onChange(content, delta, source, editor)
            // }}
            onChange={onChange}
            style={{
              flex: 1,
              height: inputBoxHeight,
              wordBreak: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "pre-line",
            }}
          />
        </div>
      )}
    </div>
  )
}

ReactQuillInput.propTypes = {
  mentionsArray: PropTypes.any,
  value: PropTypes.any,
  onChange: PropTypes.any,
  messages: PropTypes.func,
  curMessageId: PropTypes.any,
  isQuill: PropTypes.any,
  onKeyPress: PropTypes.any,
  isEmptyOrSpaces: PropTypes.any,
  setModalOpen: PropTypes.any,
  isFullScreen: PropTypes.any,
  currentChat: PropTypes.any,
  currentCase: PropTypes.any,
  getChatName: PropTypes.any,
  inputBoxHeight: PropTypes.any,
  setAllFiles: PropTypes.any,
  subject: PropTypes.any,
  setSubject: PropTypes.any,
}

export default ReactQuillInput
