import { useReducer, useState, useRef, useEffect } from "react";

const initialAudioState = {
  isPlaying: false,
  isLoading: false,
  isMuted: false,
  volume: 1,
  loopEnabled: false,
  shuffleEnabled: false,
  playbackSpeed: 1,
  currentIndex: null,
  currentSong: null,
  currentTime: 0,
};

function audioReducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, isLoading: true };
    case "PLAY":
      return { ...state, isPlaying: true, isLoading: false };
    case "PAUSE":
      return { ...state, isPlaying: false };
    case "MUTE":
      return { ...state, isMuted: true };
    case "UNMUTE":
      return { ...state, isMuted: false };
    case "SET_VOLUME":
      return { ...state, volume: action.payload };
    case "TOGGLE_LOOP":
      return { ...state, loopEnabled: !state.loopEnabled, shuffleEnabled: false };
    case "TOGGLE_SHUFFLE":
      return { ...state, shuffleEnabled: !state.shuffleEnabled, loopEnabled: false };
    case "SET_PLAYBACK_SPEED":
      return { ...state, playbackSpeed: action.payload };
    case "SET_CURRENT_TRACK":
      return { ...state, currentIndex: action.payload.index, currentSong: action.payload.song, currentTime: 0 };
    case "SET_CURRENT_TIME":
      return { ...state, currentTime: action.payload };
    default:
      return state;
  }
}

const useAudioPlayer = (playlist) => {
  const [audioState, dispatch] = useReducer(audioReducer, initialAudioState);
  const [duration, setDuration] = useState(0);
  const previousVolumeRef = useRef(1);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    if (!audioState.currentSong) return;

    audio.src = audioState.currentSong.audio;
    audio.currentTime = 0;
    audio.load();
    audio.volume = audioState.volume;
    audio.muted = audioState.isMuted;
    audio.playbackRate = audioState.playbackSpeed;

    audio
      .play()
      .then(() => dispatch({ type: "PLAY" }))
      .catch((err) => console.error("PLAY ERROR", err));

    const timeUpdate = () => dispatch({ type: "SET_CURRENT_TIME", payload: audio.currentTime });
    const loadedMetadata = () => setDuration(audio.duration || 0);
    const ended = () => {
      if (audioState.loopEnabled) {
        playSongAtIndex(audioState.currentIndex);
      } else {
        handleNext();
      }
    };

    audio.addEventListener("timeupdate", timeUpdate);
    audio.addEventListener("loadedmetadata", loadedMetadata);
    audio.addEventListener("ended", ended);

    return () => {
      audio.removeEventListener("timeupdate", timeUpdate);
      audio.removeEventListener("loadedmetadata", loadedMetadata);
      audio.removeEventListener("ended", ended);
    };
  }, [audioState.currentSong, audioState.loopEnabled]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = audioState.volume;
    audio.muted = audioState.isMuted;
    audio.playbackRate = audioState.playbackSpeed;
  }, [audioState.volume, audioState.isMuted, audioState.playbackSpeed]);

  const playSongAtIndex = (index) => {
    if (!playlist || playlist.length === 0 || index < 0 || index >= playlist.length) return;
    dispatch({ type: "SET_CURRENT_TRACK", payload: { index, song: playlist[index] } });
  };

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => dispatch({ type: "PLAY" })).catch(console.error);
    } else {
      audio.pause();
      dispatch({ type: "PAUSE" });
    }
  };

  const handleNext = () => {
    if (!playlist.length) return;
    if (audioState.shuffleEnabled && playlist.length > 1) {
      let randomIndex = audioState.currentIndex;
      while (randomIndex === audioState.currentIndex) {
        randomIndex = Math.floor(Math.random() * playlist.length);
      }
      playSongAtIndex(randomIndex);
      return;
    }
    const nextIndex = audioState.currentIndex === null ? 0 : (audioState.currentIndex + 1) % playlist.length;
    playSongAtIndex(nextIndex);
  };

  // const handlePrev = () => {
  //   if (!playlist.length) return;
  //   const prevIndex = audioState.currentIndex === null ? 0 : (audioState.currentIndex - 1 + playlist.length) % playlist.length;
  //   playSongAtIndex(prevIndex);
  // };
  const handlePrev = () => {
  if (!playlist.length) return;

  if (audioState.shuffleEnabled && playlist.length > 1) {
    // Pick a random index different from current
    let randomIndex = audioState.currentIndex;
    while (randomIndex === audioState.currentIndex) {
      randomIndex = Math.floor(Math.random() * playlist.length);
    }
    playSongAtIndex(randomIndex);
    return;
  }

  // Normal previous behavior with wrap-around
  const prevIndex =
    audioState.currentIndex === null
      ? 0
      : (audioState.currentIndex - 1 + playlist.length) % playlist.length;

  playSongAtIndex(prevIndex);
};


  const handleToggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioState.isMuted) {
      const restoreVolume = previousVolumeRef.current || 1;
      audio.muted = false;
      audio.volume = restoreVolume;
      dispatch({ type: "UNMUTE" });
      dispatch({ type: "SET_VOLUME", payload: restoreVolume });
    } else {
      previousVolumeRef.current = audioState.volume || 1;
      audio.muted = true;
      audio.volume = 0;
      dispatch({ type: "MUTE" });
      dispatch({ type: "SET_VOLUME", payload: 0 });
    }
  };

  const handleToggleLoop = () => dispatch({ type: "TOGGLE_LOOP" });
  const handleToggleShuffle = () => dispatch({ type: "TOGGLE_SHUFFLE" });

  const handleChangeSpeed = (newSpeed) => dispatch({ type: "SET_PLAYBACK_SPEED", payload: newSpeed });
  const handleChangeVolume = (newVolume) => {
    dispatch({ type: "SET_VOLUME", payload: newVolume });
    dispatch({ type: newVolume === 0 ? "MUTE" : "UNMUTE" });
  };

  const handleSeek = (time) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    dispatch({ type: "SET_CURRENT_TIME", payload: time });
  };

  return {
    audioRef,
    currentIndex: audioState.currentIndex,
    currentSong: audioState.currentSong,
    isPlaying: audioState.isPlaying,
    currentTime: audioState.currentTime,
    isLoading: audioState.isLoading,
    duration,
    isMuted: audioState.isMuted,
    loopEnabled: audioState.loopEnabled,
    shuffleEnabled: audioState.shuffleEnabled,
    playbackSpeed: audioState.playbackSpeed,
    volume: audioState.volume,
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleToggleMute,
    handleToggleLoop,
    handleToggleShuffle,
    handleChangeSpeed,
    handleChangeVolume,
    handleSeek,
  };
};

export default useAudioPlayer;
