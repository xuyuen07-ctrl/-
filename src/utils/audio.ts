class AudioManager {
  toggleSound(enabled: boolean) {}
  isSoundEnabled() { return false; }
  playCollision() {}
  playSiphon() {}
  playMud() {}
  playBurn() {}
  playLightning() {}
  playWin() {}
  playSelect() {}
  playHeal() {}
  playThunder() {}
  playBounce() {}
  playLaser() {}
}

export const audio = new AudioManager();
