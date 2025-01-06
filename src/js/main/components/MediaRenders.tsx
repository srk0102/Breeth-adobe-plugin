export const VideoRenderer = ({ fileData }: any) => {
  const videoSrc = `data:video/mp4;base64,${fileData}`;
  return (
      <video controls style={{ width: "200px", height: "120px" }}>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
      </video>
  );
};

export const ImageRenderer = ({ fileData }: any) => {
  const imageSrc = `data:image/png;base64,${fileData}`;
  return <img src={imageSrc} alt="Rendered content" style={{ width: "200px", height: "120px", objectFit: "contain" }} />;
};

export const AudioRenderer = ({ fileData }: any) => {
  const audioSrc = `data:audio/mp4;base64,${fileData}`;
  return (
    <audio controls style={{ width: "200px" }}>
      <source src={audioSrc} type="audio/mp4" />
      Your browser does not support the audio tag.
    </audio>
  );
};

