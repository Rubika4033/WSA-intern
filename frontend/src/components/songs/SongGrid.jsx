import React from "react";
import "../../css/songs/SongGrid.css";

const SongGrid = ({ songs,onSelectFavouite }) => {
  if(!songs || songs.length == 0){
    return(
      <div className="song-grid-empty">
        <p className="empty-text">No Favourite Songs yet</p>
        <p className="empty-subtext">
          Start exploring and add songs to your favourites! 
        </p>
      </div>
    );
  }

  
  return (
    <div className="song-grid-wrapper">
      <h2 className="song-grid-heading">Your Favourites</h2>
      <div className="song-grid">
        {songs.map((song) => (
        <div key={song.id}>{song.name || song.title}</div>
      ))}
      </div>
    </div>
  
      
  );
};

export default SongGrid;
