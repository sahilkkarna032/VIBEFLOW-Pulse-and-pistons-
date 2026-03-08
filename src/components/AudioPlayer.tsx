import { useEffect, useRef } from 'react';
import { usePlayer } from '@/contexts/FocusContext';

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    volume,
    currentTime,
    setCurrentTime,
    setDuration,
    playNext,
  } = usePlayer();

  // Load track and auto-play if needed
  useEffect(() => {
    if (audioRef.current && currentTrack?.audio_url) {
      const audio = audioRef.current;
      const wasPlaying = isPlaying;
      
      audio.src = currentTrack.audio_url;
      audio.load();
      
      // Set duration when metadata is loaded
      const handleLoadedMetadata = () => {
        if (audio) {
          setDuration(audio.duration);
        }
      };
      
      // Auto-play when ready if isPlaying is true
      const handleCanPlay = () => {
        if (wasPlaying) {
          audio.play().catch((error) => {
            console.error('Error auto-playing audio:', error);
            setIsPlaying(false);
          });
        }
      };
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('canplay', handleCanPlay);
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [currentTrack?.audio_url, setDuration]);

  // Play/Pause control
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, setIsPlaying]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Seek
  useEffect(() => {
    if (audioRef.current && Math.abs(audioRef.current.currentTime - currentTime) > 1) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  // Update current time and handle track end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      playNext();
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [setCurrentTime, playNext, setIsPlaying]);

  return (
    <audio
      ref={audioRef}
      preload="metadata"
      className="hidden"
    />
  );
}
