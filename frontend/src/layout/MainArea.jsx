import React from "react";
import { useSelector } from "react-redux";

import Auth from "../components/auth/Auth";
import Playlist from "../components/player/Playlist";
import SongList from "../components/player/SongList";
import SearchBar from "../components/search/SearchBar";
import SongGrid from "../components/songs/SongGrid";

import "../css/mainArea/MainArea.css";

const MainArea = ({
  view,
  currentIndex,
  onSelectSong,
  onSelectFavourite,
  songsToDisplay,
  setSearchSongs,
  onSelectTag, // if needed for Playlist
}) => {
  const auth = useSelector((state) => state.auth);

  return (
    <div className="mainarea-root">
      <div className="mainarea-top">
        <Auth />
        {view === "home" && <Playlist onSelectTag={onSelectTag} />}
        {view === "search" && <SearchBar setSearchSongs={setSearchSongs} />}
      </div>

      <div className="mainarea-scroll">
        {(view === "home" || view === "search") && (
          <SongList
            songs={songsToDisplay}
            onSelectSong={onSelectSong}
            currentIndex={currentIndex}
          />
        )}

        {view === "favourite" && (
          <SongGrid
            songs={auth.user?.favourites || []}
            onSelectFavourite={onSelectFavourite}
          />
        )}
      </div>
    </div>
  );
};

export default MainArea;

