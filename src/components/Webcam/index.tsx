/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { useCallback, useRef, useState } from 'react'
import WebcamCapture from 'react-webcam'

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: 'user'
}

const Webcam = (): JSX.Element => {
  const webcamRef = useRef<any>(null)
  // const [imgSrc, setImgSrc] = useState<any>(null)

  // const capture = useCallback(() => {
  //   const imageSrc = webcamRef.current.getScreenshot()
  //   const video = document.querySelector('video')
  //   navigator.mediaDevices
  //     .getUserMedia({
  //       audio: false,
  //       video: { facingMode: { exact: 'environment' }, width: 420, height: 1000 }
  //     })
  //     .then(function (stream) {
  //       const video = document.querySelector('video')
  //       // Older browsers may not have srcObject
  //       if ('srcObject' in video) {
  //         video.srcObject = stream
  //       } else {
  //         // Avoid using this in new browsers
  //         video.src = window.URL.createObjectURL(stream)
  //       }
  //     })
  //     .catch(function (err) {
  //       console.log(err.name + ': ' + err.message)
  //     })

  //   setImgSrc(webcamRef.current)
  //   console.log(123, imageSrc)
  // }, [webcamRef, setImgSrc])

  return (
    <>
      <WebcamCapture />
    </>
  )
}
export default Webcam
