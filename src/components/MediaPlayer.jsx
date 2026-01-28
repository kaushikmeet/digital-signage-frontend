import { forwardRef } from "react";
import { resolveBindings } from "../utils/resolveBindings";

const MediaPlayer = forwardRef(({ media }, ref) => {
  if (!media) return null;

  // IMAGE
  if (media.type === "image") {
    return (
      <img
        src={media.url}
        className="w-full h-full object-cover"
        alt=""
      />
    );
  }

  // VIDEO ✅ ref is attached here
  if (media.type === "video") {
    return (
      <video
        ref={ref}
        src={media.url}
        autoPlay
        muted
        className="w-full h-full object-cover"
      />
    );
  }

  // TEXT
  if (media.type === "text") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        {media.content}
      </div>
    );
  }

  // HTML
  if (media.type === "html") {
    const finalHtml = resolveBindings(media.content, {});
    return (
      <div
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: finalHtml }}
      />
    );
  }

  return null;
});

export default MediaPlayer;
