import { forwardRef } from "react";

const MediaPlayer = forwardRef(({ media, loop }, ref) => {
  if (media.type === "video") {
    return (
      <video
        ref={ref}
        src={media.url}
        autoPlay
        muted
        loop={loop}
        className="w-full h-full object-contain"
      />
    );
  }

  return (
    <img
      src={media.url}
      className="w-full h-full object-contain"
    />
  );
});

export default MediaPlayer;
