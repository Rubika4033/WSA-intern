import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../../css/songs/SongGrid.css";

const SongGrid = ({ songs, onSelectFavourite, user }) => {
  if (!songs || songs.length === 0) {
    return (
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
        {songs.map((song) => {
          const isLiked = user?.favourites?.some((f) => f.id === song.id);

          return (
            <div className="song-card" key={song.id}>
              <img
                src={song.image}
                alt={song.name || song.title}
                className="song-card-image"
              />
              <p className="song-card-title">{song.name || song.title}</p>

              <button
                className="favourite-btn"
                onClick={() => onSelectFavourite(song)}
              >
                {isLiked ? (
                  <FaHeart color="#ff3c3c" size={20} />
                ) : (
                  <FaRegHeart color="#a855f7" size={20} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SongGrid;
