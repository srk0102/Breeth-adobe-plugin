export const VideoRenderer = ({ fileData }: any) => {
  const videoSrc = `data:video/mp4;base64,${fileData}`;
  return (
      <video 
          controls 
          className="h-full w-full object-cover rounded-lg shadow-lg border border-white/10"
          poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggNUwxOSAxMkw4IDE5VjVaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjciLz4KPC9zdmc+"
      >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
      </video>
  );
};

export const ImageRenderer = ({ fileData }: any) => {
  const imageSrc = `data:image/png;base64,${fileData}`;
  return (
    <img 
      src={imageSrc} 
      alt="Rendered content" 
      className="h-full w-full object-cover rounded-lg shadow-lg border border-white/10 transition-transform duration-300 hover:scale-105" 
    />
  );
};

export const AudioRenderer = ({ fileData }: any) => {
  const audioSrc = `data:audio/mp4;base64,${fileData}`;
  return (
    <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-brand-secondary/30 to-blue-900/30 rounded-lg border border-white/10 backdrop-blur-sm">
      <div className="bg-black/40 p-6 rounded-lg border border-white/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm">♫</span>
          </div>
          <span className="text-white font-medium">Audio File</span>
        </div>
        <audio controls className="w-full min-w-64">
          <source src={audioSrc} type="audio/mp4" />
          Your browser does not support the audio tag.
        </audio>
      </div>
    </div>
  );
};

