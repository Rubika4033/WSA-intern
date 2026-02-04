import { current } from "@reduxjs/toolkit";
import {useReducer,useState,useRef} from "react";

const initialAudioState={
    isPlaying: false,
    isLoading: false,
    isMuted: false,
    volume:1,
    loopEnabled: false,
    shuffleEnabled: false,
    playbackSpeed: 1,
    currentIndex: null,
    currentSong: null,
    currentTime: 0,
};
// Reducer
function audioReducer(state,action){
    switch(action.type){
        case "LOADING":
            return { ...state,isLoading:true};

        case"PLAY":
            return{ ...state,isPlaying:true,isloading: true};
        case "PAUSE":
            return {...state,isplaying:false};
        case "MUTE":
            return { ...state,isMuted: true};
        case "MUTE":
            return { ...state,isMuted: true};
        case "UNMUTE":
            return { ...state,isMuted: false};

        case "SET_VOLUME":
            return{ ...state,volume: action.payload};
        case "TOOGLE_LOOP":
            
            return { ...state,loopEnabled: !state.loopEnabled,
                shuffleEnabled: false,
            };
        case "TOOGLE_SHUFFLE":
            return {
                ...state,
                shuffleEnabled: !state.shuffleEnabled,
                loopEnabled: false,
            };
        case "SET_PLAYBACK_SPEED":
            return { ...state,currentTime: action.payload};
        default:
            return state;

             
    }
}
const useAudioPlayer=(songs) => {
    const [audioState,dispatch]= useReducer(audioReducer,intialAudioState);
    const [duration,setDuration]= useState(0);
    const previousVolumeRef= useRef(1);
    const audioRef= useRef(null);
// play a song at a specific index value 
const playSongAtIndex = (index) =>{
    if(!songs || songs.length ==0){
        console.warn("NO song available to play");
        return;

    }
    if (index <0 || index >= songs.length) return;
    const song =songs[index];
    dispatch({
        type:"SET_CURRENT_TRACK",
        payload:{
            index,
            song,
        },
    });
    dispatch({ type:"SET_CURRENT_TIME",payload: 0});
    const audio =audioRef.current;
    if(!audio) return;
    dispatch({type: "LOADIGN"});
    audio.load();

    audio.playbackRate= audioState.playbackSpeed;
    audio
    .play()
    .then(() => dispatch({type: "PLAY"}))
    .catch((error) => console.error("PLAY ERROR",error));
};
    const handleTogglePlay=()=>{
        const audio =audioRef.current;
        if(!audio) return;
        
        if(audio.paused){
            audio.play()
            .then(()=>dispatch({type :"PLAY"}))
            .catch((e) => concole.error("Play error",e));
        }
        else{
            audio.pause();
            dispatch({type: "PAUSE"});

        }
    
    };
    // NExt Song
    const handleNext=() =>{
        if(!songs.length) return;
        if (audioState.currentIndex == null){
            playSongAtIndex(0);
            return;
        }
    
    // IF shuffle is ENbled
    if(audioState.shuffleEnabled && songs.length >1){
        let randomIndex =audioState.currentIndex;
        while(randomIndex == audioState.currentIndex){
            randomIndex=Math.floor(Math.random() * songs.lenght);

        }
        playSongAtIndex(randomIndex);
        return;
    }
    // next without shuffle
    const nextIndex= ( audioState.currentIndex+1) % songs.length;
    playSongAtIndex(nextIndex);
};
    const handlePrev =() =>{
        if(!songs.length) return;
        if(audioState.currentIndex== null){
            playSongAtIndex(0);
            return;
        }
     
    const  prevIndex=
        (audioState.currentIndex-1 + songs.length)% songs.length;
        playSongAtIndex(prevIndex);
    };
    // Audio event handle
    const handleTimeUPdate= () =>{
        if(!audio) return;
    
    dispatch({
        type:"SET_CURRENT_TIME",
        payload:audio.currentTime || 0,


    });
};
const handleLoadMetadata=() =>{
    const audio = audioRef.current;
    if(!audio) return;
    setDuration(audio.duration || 0);
    audio.playRate=audioState.playbackSpeed;
    audio.volume=audioState.volume;
    audio.muted=audioState.isMuted;
    
    dispatch({type:"PLAY"});

};
const handleEnded=() =>{
    const audio=audioRef.current;
    if(!audio) return;
    if(audioState.loopEnabled){
        audio
        .play()
        .then(() =>{
            dispatch({type:"PLAY"});
            dispatch({type:"SET_CURRENT_TIME",payload:0});
        })
        .catch((e) => console.error("Replay error",e));
        handleNext();
    }
};
const handleToggleMute= () =>{
    const audio =audioRef.current;
    if(!audio) return;
    if(audioState.isMuted){
        const restoreVolume= previousVolumeRef.current || 1;

        audio.muted=false;
        audio.volume=restoreVolume;
        dispatch({type: "UNMUTE"});
        dispatch({type:"SET_VOLUME",payload:restoreVolume});
    }
    else{
        previousVolumeRef.current=audioState.volume || 1;
        audio.muted=true;
        audio.volume=0;
        dispatch({type:"MUTE"});
        dispatch({type:"SET_VOLUME",payload:0});
    }
};
const  handleToggleLoop=() =>{
    dispatch({type:"TOGGLE_LOOP"});
};
const handleToggleShuffle=() =>{
    dispatch({type:"TOGGLE_SHUFFLE"});
};
const handleSeek=() =>{
    dispatch({type:"TOGGLE_SEEK"});
};
const  handleChangeSpeed =(newSPeed)=>{
    const audio =audioRef.current;
    dispatch({type: "SET_PLAYBACK_SPEED",payload:newSPeed});
    if(audio){
        audio.playRate=newSPeed;
    }
};
const handleChangeVolume=(newVolume)=>{
    const audio =audioRef.current;
   
    if(newVolume >0){
        previousVolumeRef.current=newVolume;
    }
    dispatch({type:"SET_VOLUME",payload:newVolume});
    if(!audio) return;
    audio.volume=newVolume;

    if(newVolume == 0){
        audio.muted=true;
        dispatch({type:"MUTE"});
    }
    else if(audioState.isMuted){
        audio.muted=false;
        dispatch({type:"UNMUTE"});
    }
};
    return{
        // AUdioRef
        audioRef,

        // current aonf state
        currentIndex:audioState.currentIndex,
        currentSong:audioState.currentSong,
        isPlaying:audioState.isplaying,
        currentTime:audioState.currentTime,
        isLoading:audioState.isLoading,
        duration,
        
        // Features Toggle
        isMuted: audioState.isMuted,
        loopEnabled:audioState.loopEnabled,
        shuffleEnabled:audioState.shuffleEnabled,
        playbackSpeed:audioState.playbackSpeed,
        volume:audioState.volume,

        // playback control functions
        playSongAtIndex,
        handleTogglePlay,
        handleNext,
        handlePrev,

        // Audio event handles
        handleTimeUPdate,
        handleLoadMetadata,
        handleEnded,

        // Feature control functions
        handleToggleMute,
        handleToggleLoop,
        handleToggleShuffle,
        handleChangeSpeed,
        handleChangeVolume,
       
    };



};
 
export default useAudioPlayer;