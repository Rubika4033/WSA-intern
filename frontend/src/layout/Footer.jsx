import React from "react";

import SongDetail from "../components/player/SongDetail";
import ControlArea from "../components/player/ControlArea";
import Features from "../components/player/Features";

import "../css/footer/Footer.css";

const Footer = ({ playerState, playerControls, playerFeatures }) => {
  return (
    <footer className="footer-root footer-glow">
      <SongDetail currentSong={playerState.currentSong} />
      <ControlArea playerState={playerState} playerControls={playerControls} />
      <Features
        playerState={playerState}
        playerControls={playerControls}
        playerFeatures={playerFeatures}
      />
    </footer>
  );
};

export default Footer;
