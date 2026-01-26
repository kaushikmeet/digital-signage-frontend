import React, { useEffect, useState } from 'react';
import MediaPlayer from './MediaPlayer';

function ZonePlayer({ playlistId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`/playlists/${playlistId}/active-items`)
      .then(res => res.json())
      .then(setItems);
  }, [playlistId]);

  return <MediaPlayer items={items} />;
}
export default ZonePlayer;
