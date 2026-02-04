import React from "react";
import "../..css/songs/SongCard.css";

const  SongCard=({songs,onSelectFavourite})=>{
    return(
        <div className="song-card" onClick={onSelectFavourite}>
            <div className="song-card-image">
                <img src={songs.image} alt={songs.name} loading="lazy"/>

            </div>
            <div className="song-card-info">
                <h4 className="song-title">{songs.name}</h4>
                <p className="song-artist">{songs.artist}</p>
 
            </div>
        </div>

    );
};
export default SongCard;