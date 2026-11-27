/**
 * Plays an IPA transcription aloud.
 *
 * Browsers' built-in speechSynthesis reads ordinary text, not IPA, so it cannot
 * pronounce these symbols. A speech engine that accepts phoneme input still has
 * to be chosen and plugged in here (see the README's "Audio" section).
 */
export async function speakIpa(ipa: string): Promise<void> {
  void ipa;
  throw new Error("Audio playback is not connected to a speech engine yet.");
}
