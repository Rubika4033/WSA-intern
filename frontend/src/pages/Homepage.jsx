import React, { use, useEffect, useState } from "react";

import Footer from "./layout/Footer";
import SideMenu from "./layout/SideMenu";
import MainArea from "./layout/MainArea";

import "../css/pages/HomePage.css";
import { useSelector } from "react-redux";
import axios  from "axios";
import useAudioPlayer from "../hooks/userAudioPlayer";  

import { getPlayListBYTag } from "../../../backend/controllers/songController";
import EditProfile from "../components/auth/editprofile";

const Homepage = () => {
  const [view, setView] = useState("home");
  const [songs,setSongs]= useState([]);
  const [searchSongs,setSearchSongs]= useState([]);
  const [openEditprofile,setOpen]=useState(false);
  const auth=useSelector((state) => state.auth);
  
  const songsToDisplay= view == "search" ? searchSongs :songs;

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
    handleTimeUPdate,
    handleEnded,
    handleToggleMute,
    handleToggleLoop,
    handleToggleShuffle,
    handleChangeSpeed,
    handleChangeVolume,
    handleSeek,
  }=useAudioPlayer(songsToDisplay);

  const playerState={
    currentSong,isPlaying,currentTime,duration,isMuted,loopEnabled,
    shuffleEnabled,playbackSpeed,volume,
  };
  const playerControls={
    playSongAtIndex,
    handleTogglePlay,
    handlePrev,
    handleSeek,
  };
  const  playerFeatures={
    ontoggleMute : handleToggleMute,
    onToggleloop: handleToggleLoop,
    onToggleShuffle: handleToggleShuffle,
    onChangeSpeed: handleChangeVolume,

  };
  useEffect(() =>{
    const fetchInitialSongs =async() =>{
      try{
        const res= await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/songs`,
          
        );
        setSongs(res.data.results || []);

      }
      catch(error){
        console.error("Error while fetching the songs",error);
        setSongs([]);
      }
    };
    fetchInitialSongs();
  },[]);

   const  loadPlayList =async(tag) => {
    if(!tag){
      console.warn("No tag is provided");
      return;
    }
    try{
      const res=await axios.get(`${import.meta.env.VITE_BASE_URL}/api/songs`);
      setSongs(res.data.results || []);      
    }catch(error){
      console.error("failed to load playList",error);
      setSongs([]);

    }
  };

  // whena an user click on a song in a table
  const handleSelectSong=(index) =>{
    playSongAtIndex(index);
  };

   
  const handlePlayFavourite=(song)=>{
    const favourites= auth.user?. favourites || [];
    if(!favourites.length) return;
    const index= auth.user.favourites.findIndex(fav.id ==song.id);
    setSongs(auth.user.favourites);
    setView("home");
    setTimeout(() => {
      if(index != -1){
        playSongAtIndex(index);
      } 

    },0);
  };

   

  
    
  

  


  // const songs = [
  //   {
  //     id: 1,
  //     name: "Believer",
  //     artist_name: "Imagine Dragons",
  //     cover: "https://i.scdn.co/image/ab67616d0000b273a466c9d6c7a3c7bbdc0e87f3",
  //     releasedate: "2017-02-01",
  //     duration: "04.30",
  //   },
  //   {
  //     id: 2,
  //     name: "Faded",
  //     artist_name: "Alan Walker",
  //     cover: "https://i.scdn.co/image/ab67616d0000b2733c6c8b9a43d1d93e4aaf0e65",
  //     releasedate: "2015-12-03",
  //     duration: "05.30",
  //   },
  //   {
  //     id: 3,
  //     name: "Shape of You",
  //     artist_name: "Ed Sheeran",
  //     cover: "https://i.scdn.co/image/ab67616d0000b273ba0e0bdfd8f5b1dc3c6d1c8e",
  //     releasedate: "2017-03-17",
  //     duration: "04.32",
  //   },
  // ];

  return (
    <div className="homepage-root">
      <audio ref={audioRef}
      onTimeUpdate={handleTimeUPdate}
      onLoadedMetadata={handleleLoadedMetadata}
      onEnded={handleEnded}
      >
      {currentSong && <source src={currentSong.audio} type="audio/mepg"/>}
      </audio>
      <div className="homepage-main-wrapper">
        {/* Sidebar */}
        <div className="homepage-sidebar">
          <SideMenu setView={setView} 
          view={view}
          OnopenEditprofile={() => setOpenEditProfile(true)} />
        </div>
        {/* Main Content */}
        <div className="homepage-content">
          <MainArea 
          view={view} 
          currentIndex={currentIndex} 
          onSelectSong={handleSelectSong} 
          onSelectFavourite={handlePlayFavourite}
          onSelectTag={loadPlayList}
          songsToDisplay={songsToDisplay}
          setSearchSong={setSearchSongs}/>
        </div>
      </div>
      {/* Footer Player */}
      <Footer 
      playerState={playerState}
      playerControls={playerControls}
      playerFeatures={pla} />
      {openEditprofile && <Model onclose={() => setOpenEditProfile(false)}>
        <EditProfile onClose={() => setOpenEditProfile(false)}/>
        </Model>}
    </div>

  );
};

export default Homepage;
