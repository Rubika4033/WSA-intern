import React, { useEffect, useState } from "react";
import Footer from "../layout/Footer";
import SideMenu from "../layout/SideMenu";
import MainArea from "../layout/MainArea";
import "../css/pages/HomePage.css";
import { useSelector } from "react-redux";
import axios from "axios";
import useAudioPlayer from "../hooks/userAudioPlayer";
import EditProfile from "../components/auth/editprofile";
import Modal from "../components/common/Modal";

const Homepage = () => {
  const [view, setView] = useState("home");
  const [songs, setSongs] = useState([]);
  const [searchSongs, setSearchSongs] = useState([]);
  const [openEditProfile, setOpen] = useState(false);
  const auth = useSelector((state) => state.auth);

  const songsToDisplay = view === "search" ? searchSongs : songs;

  const {
    audioRef,
    currentIndex,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    loopEnabled,
    shuffleEnabled,
    playbackSpeed,
    volume,
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleTimeUpdate,
    handleLoadMetadata,
    handleEnded,
    handleToggleMute,
    handleToggleLoop,
    handleToggleShuffle,
    handleChangeSpeed,
    handleChangeVolume,
  } = useAudioPlayer(songsToDisplay);

  const playerState = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    loopEnabled,
    shuffleEnabled,
    playbackSpeed,
    volume,
  };

  const playerControls = {
    playSongAtIndex,
    handleTogglePlay,
    handlePrev,
  };

  const playerFeatures = {
    onToggleMute: handleToggleMute,
    onToggleLoop: handleToggleLoop,
    onToggleShuffle: handleToggleShuffle,
    onChangeSpeed: handleChangeSpeed,
    onChangeVolume: handleChangeVolume,
  };

  useEffect(() => {
    const fetchInitialSongs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/songs`);
        setSongs(res.data.results || []);
      } catch (error) {
        console.error("Error fetching songs", error);
        setSongs([]);
      }
    };
    fetchInitialSongs();
  }, []);

  const loadPlayList = async (tag) => {
    if (!tag) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/songs`);
      setSongs(res.data.results || []);
    } catch (error) {
      console.error("Failed to load playlist", error);
      setSongs([]);
    }
  };

  const handleSelectSong = (index) => playSongAtIndex(index);

  const handlePlayFavourite = (song) => {
    const favourites = auth.user?.favourites || [];
    if (!favourites.length) return;

    const index = favourites.findIndex((fav) => fav.id === song.id);
    setSongs(favourites);
    setView("home");

    setTimeout(() => {
      if (index !== -1) playSongAtIndex(index);
    }, 0);
  };

  return (
    <div className="homepage-root">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadMetadata}
        onEnded={handleEnded}
      >
        {currentSong && <source src={currentSong.audio} type="audio/mpeg" />}
      </audio>

      <div className="homepage-main-wrapper">
        <div className="homepage-sidebar">
          <SideMenu
            setView={setView}
            view={view}
            OnopenEditprofile={() => setOpen(true)}
          />
        </div>
        <div className="homepage-content">
          <MainArea
            view={view}
            currentIndex={currentIndex}
            onSelectSong={handleSelectSong}
            onSelectFavourite={handlePlayFavourite}
            onSelectTag={loadPlayList}
            songsToDisplay={songsToDisplay}
            setSearchSong={setSearchSongs}
          />
        </div>
      </div>

      <Footer
        playerState={playerState}
        playerControls={playerControls}
        playerFeatures={playerFeatures}
      />

      {openEditProfile && (
        <Modal onclose={() => setOpen(false)}>
          <EditProfile onClose={() => setOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default Homepage;

