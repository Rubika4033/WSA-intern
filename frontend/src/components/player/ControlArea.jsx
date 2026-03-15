import React from "react";
import { GiPauseButton } from "react-icons/gi";
import { FaCirclePlay } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from "react-icons/tb";
import { ImSpinner2 } from "react-icons/im";
import "../../css/footer/ControlArea.css";
import { useDispatch, useSelector } from "react-redux";
import { updateFavourites } from "../../redux/slices/authSlice";
import { formatTime } from "@/utils/helper";
import axios from "axios";

const ControlArea = ({ playerState, playerControls }) => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const { isPLaying, currentTime, duration, currentSong, isLoading } = playerState;
  const { handleTogglePlay, handleNext, handlePrev, handleSeek } = playerControls;

  const currentSongId = currentSong?.id;

  // Check if current song is already liked
  const isLiked = Boolean(
    currentSongId && user?.favourites?.some((fav) => fav.id === currentSong.id)
  );
  const handleLike = async () => {
  if (!isAuthenticated) {
    alert("Login to like songs");
    return;
  }

  try {
    const payload = {
      id: currentSong.id,
      name: currentSong.name,
      artist_name: currentSong.artist_name,
      image: currentSong.image,
    };

    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/song/favourites`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    let updatedFavourites;
    if (isLiked) {
      updatedFavourites = user.favourites.filter(
        (song) => song.id !== currentSong.id
      );
    } else {
      updatedFavourites = [...(user.favourites || []), res.data];
    }

    dispatch(updateFavourites(updatedFavourites));
  } catch (err) {
    console.error("Favourite error:", err.response?.data || err.message);
    alert("Favourite not updated");
  }
};


  // const handleLike = async (song) => {
  //   if (!user) {
  //     alert("Login to like songs");
  //     return;
  //   }

  //   try {
  //     // Full song object
  //     const songData = {
  //       id: song.id,
  //       name: song.name,
  //       artist_name: song.artist_name,
  //       image: song.image,
  //       duration: song.duration,
  //       audio: song.audio,
  //     };

  //     const res = await axios.post(
  //       `${import.meta.env.VITE_BASE_URL}/api/song/favourites`,
  //       { song: songData },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (res.status === 200) {
  //       // Toggle in frontend
  //       let updatedFavourites;

  //       if (isLiked) {
  //         // Remove song from favourites if already liked
  //         updatedFavourites = user.favourites.filter(f => f.id !== song.id);
  //       } else {
  //         // Add song to favourites if not liked
  //         updatedFavourites = [...(user.favourites || []), res.data];
  //       }

  //       dispatch(updateFavourites(updatedFavourites));
  //     } else {
  //       alert(res.data.message || "Could not like song");
  //     }
  //   } catch (error) {
  //     console.error("Favourite error:", error.response?.data || error.message);
  //     alert(error.response?.data?.message || "Failed to update favourite");
  //   }
  // };
  // const handleLike = async (song) => {
  // if (!user) {
  //   alert("Login to like songs");
  //   return;
  // }

  // try {
  //   const payload = {
  //     song: {
  //       id: song.id,
  //       name: song.name,
  //       artist_name: song.artist_name,
  //       image: song.image,
  //       duration: song.duration,
  //       audio: song.audio,
  //     },
  //   };

  //   const res = await axios.post(
  //     `${import.meta.env.VITE_BASE_URL}/api/song/favourites`,
  //     payload,
  //     { headers: { Authorization: `Bearer ${token}` } }
  //   );

  //   if (res.status === 200) {
  //     let updatedFavourites;

  //     // Toggle in frontend
  //     if (user.favourites?.some(f => f.id === song.id)) {
  //       updatedFavourites = user.favourites.filter(f => f.id !== song.id);
  //     } else {
  //       updatedFavourites = [...(user.favourites || []), res.data];
  //     }

  //     dispatch(updateFavourites(updatedFavourites));
  //   }
  // } catch (error) {
  //   console.error("Favourite error:", error.response?.data || error.message);
  //   alert(error.response?.data?.message || "Failed to update favourite");
  // }
  // };

  return (
    <div className="control-root">
      {/* Control Buttons */}
      <div className="control-buttons">
        <button type="button" aria-label="previous" className="control-icon-btn" onClick={handlePrev}>
          <TbPlayerTrackPrevFilled color="#a855f7" size={24} />
        </button>

        <button type="button" aria-label="play" className="control-play-btn" onClick={handleTogglePlay}>
          {isLoading ? (
            <ImSpinner2 className="animate-spin" color="#a855f7" size={36} />
          ) : isPLaying ? (
            <GiPauseButton color="#a855f7" size={42} />
          ) : (
            <FaCirclePlay color="#a855f7" size={42} />
          )}
        </button>

        <button type="button" aria-label="next" className="control-icon-btn" onClick={handleNext}>
          <TbPlayerTrackNextFilled color="#a855f7" size={24} />
        </button>

        {isAuthenticated && currentSong && (
          <button type="button" aria-label="like" className="control-icon-btn" onClick={() => handleLike(currentSong)}>
            {isLiked ? (
              <FaHeart color="#ff3c3c" size={22} />
            ) : (
              <FaRegHeart color="#a855f7" size={22} />
            )}
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="control-progress-wrapper">
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          className="control-progress"
          onChange={(e) => handleSeek(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, #a855f7 ${
              duration ? (currentTime / duration) * 100 : 0
            }%, #333 ${duration ? (currentTime / duration) * 100 : 0}%)`,
          }}
        />
        <div className="control-times">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default ControlArea;
