// import { useEffect, useState } from "react";
// const useRecorder = (props) => {
//   const [audioURL, setAudioURL] = useState("");
//   const [isRecording, setIsRecording] = useState(false);
//   const [recorder, setRecorder] = useState(null);
//   useEffect(() => {
//     // Lazily obtain recorder first time we're recording.
//     if (recorder === null) {
//       if (isRecording) {
//         requestRecorder().then(setRecorder, console.error);
//       }
//       return;
//     }
//     // Manage recorder state.
//     if (isRecording) {
//       recorder.start();
//     } else {
//       recorder.stop();
//     }
//     // Obtain the audio when ready.
//     const handleData = (e) => {
//       setAudioURL({
//         data: URL.createObjectURL(e.data),
//         type: e,
//         name: e.name
//       });
//     };
//     recorder.addEventListener("dataavailable", handleData);
//     // props.onStateValueChange(recorder);
//     return () => recorder.removeEventListener("dataavailable", handleData);
    
//   }, [recorder, isRecording]);
//   const startRecording = () => {
//     setIsRecording(true);
//   };
//   const stopRecording = () => {
//     setIsRecording(false);
//   };
//   return [audioURL, isRecording, startRecording, stopRecording];
// };
// async function requestRecorder() {
//   const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//   return new MediaRecorder(stream, { type: "audio/mp3" });
// }
// export default useRecorder;
