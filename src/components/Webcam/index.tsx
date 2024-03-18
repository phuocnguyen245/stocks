/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: 'environment'
}

const Webcam = (): JSX.Element => {
  return (
    <Webcam
      audio={false}
      height={720}
      screenshotFormat='image/jpeg'
      width={1280}
      videoConstraints={videoConstraints}
    >
      {({ getScreenshot }) => (
        <button
          onClick={() => {
            const imageSrc = getScreenshot()
            console.log(imageSrc)
          }}
        >
          Capture photo
        </button>
      )}
    </Webcam>
  )
}
export default Webcam
