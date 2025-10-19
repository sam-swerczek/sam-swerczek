"use client";

import React, { createContext, useEffect, useRef, useState, useCallback } from 'react';
import type { Song } from '../types';
import { logger } from '../utils/logger';

// TypeScript declarations for YouTube IFrame API
interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  getVolume(): number;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  loadVideoById(videoId: string): void;
  destroy(): void;
  getIframe(): HTMLIFrameElement;
}

interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

interface YTPlayerOptions {
  height?: string;
  width?: string;
  videoId?: string;
  playerVars?: {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    modestbranding?: 0 | 1;
    rel?: 0 | 1;
    showinfo?: 0 | 1;
    fs?: 0 | 1;
    playsinline?: 0 | 1;
  };
  events?: {
    onReady?: (event: YTPlayerEvent) => void;
    onStateChange?: (event: YTPlayerEvent) => void;
    onError?: (event: YTPlayerEvent) => void;
  };
}

// Player state constants
const PlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

declare global {
  interface Window {
    YT?: {
      Player: new (element: HTMLElement, options: YTPlayerOptions) => YTPlayer;
      PlayerState: typeof PlayerState;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// Track information interface
export interface CurrentTrack {
  id: string;
  title: string;
  artist: string;
  albumCoverUrl: string | null;
  youtubeVideoId: string;
  // Enhanced metadata
  durationSeconds?: number | null;
  tags?: string[] | null;
  releaseDate?: string | null;
  description?: string | null;
}

// Player state interface
export interface PlayerState {
  videoId: string;
  isPlaying: boolean;
  isPaused: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isReady: boolean;
  hasVisited: boolean;
  currentTrack: CurrentTrack | null;
  // Playlist management
  playlist: CurrentTrack[];
  currentIndex: number;
}

// Player controls interface
export interface PlayerControls {
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  seekTo: (seconds: number) => void;
  loadVideo: (videoId: string) => void;
  loadTrack: (track: Song) => void;
  // Playlist controls
  next: () => void;
  previous: () => void;
  setPlaylist: (tracks: Song[]) => void;
  jumpToTrack: (index: number) => void;
}

// Player preferences for localStorage
interface PlayerPreferences {
  volume: number;
  lastPosition: number;
  hasVisited: boolean;
}

// Context value interface
export interface YouTubePlayerContextValue extends PlayerState, PlayerControls {
  isLoading: boolean;
  isScriptLoaded: boolean;
  error: string | null;
}

// Create context
export const YouTubePlayerContext = createContext<YouTubePlayerContextValue | null>(null);

// Constants
const DEFAULT_VIDEO_ID = "Qey4qv3KnYI";
const DEFAULT_VOLUME = 0.3;
const STORAGE_KEY = "youtube-player-prefs";
const UPDATE_INTERVAL = 100; // ms

// Provider component
export function YouTubePlayerProvider({ children }: { children: React.ReactNode }) {
  const playerRef = useRef<YTPlayer | null>(null);
  const playerElementRef = useRef<HTMLDivElement | null>(null);
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializingRef = useRef(false);
  const isMountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const currentVideoIdRef = useRef<string>(DEFAULT_VIDEO_ID);
  const shouldAutoplayRef = useRef(false);
  const playlistInitializedRef = useRef(false);

  // State
  const [isHydrated, setIsHydrated] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [playerState, setPlayerState] = useState<PlayerState>(() => {
    // Initialize with defaults, will load from localStorage in useEffect
    return {
      videoId: DEFAULT_VIDEO_ID,
      isPlaying: false,
      isPaused: true,
      volume: DEFAULT_VOLUME,
      currentTime: 0,
      duration: 0,
      isReady: false,
      hasVisited: false,
      currentTrack: null,
      playlist: [],
      currentIndex: -1,
    };
  });

  // Load preferences from localStorage
  const loadPreferences = useCallback((): PlayerPreferences => {
    if (typeof window === 'undefined') {
      return {
        volume: DEFAULT_VOLUME,
        lastPosition: 0,
        hasVisited: false,
      };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const prefs = JSON.parse(stored);
        return {
          volume: typeof prefs.volume === 'number' ? prefs.volume : DEFAULT_VOLUME,
          lastPosition: typeof prefs.lastPosition === 'number' ? prefs.lastPosition : 0,
          hasVisited: prefs.hasVisited === true,
        };
      }
    } catch (err) {
      logger.error('Failed to load player preferences:', err);
    }

    return {
      volume: DEFAULT_VOLUME,
      lastPosition: 0,
      hasVisited: false,
    };
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((prefs: Partial<PlayerPreferences>) => {
    if (typeof window === 'undefined') return;

    try {
      const current = loadPreferences();
      const updated = { ...current, ...prefs };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      logger.error('Failed to save player preferences:', err);
    }
  }, [loadPreferences]);

  // Update current time periodically
  const startTimeUpdates = useCallback(() => {
    if (updateTimerRef.current) {
      clearInterval(updateTimerRef.current);
    }

    updateTimerRef.current = setInterval(() => {
      if (playerRef.current) {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          setPlayerState(prev => ({ ...prev, currentTime }));

          // Save position periodically
          savePreferences({ lastPosition: currentTime });
        } catch (err) {
          logger.error('Failed to get current time:', err);
        }
      }
    }, UPDATE_INTERVAL);
  }, [savePreferences]);

  const stopTimeUpdates = useCallback(() => {
    if (updateTimerRef.current) {
      clearInterval(updateTimerRef.current);
      updateTimerRef.current = null;
    }
  }, []);

  // Utility function to convert CurrentTrack to Song format
  const currentTrackToSong = useCallback((track: CurrentTrack, index: number = 0): Song => {
    return {
      id: track.id,
      title: track.title,
      artist: track.artist,
      album_cover_url: track.albumCoverUrl,
      content_type: 'video',
      youtube_video_id: track.youtubeVideoId,
      duration_seconds: track.durationSeconds ?? null,
      tags: track.tags ?? null,
      release_date: track.releaseDate ?? null,
      description: track.description ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      display_order: index,
      is_featured: false,
      is_active: true,
      spotify_url: null,
      apple_music_url: null,
    };
  }, []);

  /**
   * Triggers autoplay with a smooth fade-in effect from 0 to 30% volume over 5 seconds
   * This is the single source of truth for autoplay logic across the app
   */
  const triggerAutoplayWithFadeIn = useCallback(() => {
    if (!playerRef.current || !isMountedRef.current) {
      logger.warn('Cannot trigger autoplay - player not ready');
      return;
    }

    // Check if we've already autoplayed this session
    const hasAutoplayedThisSession = typeof window !== 'undefined'
      ? sessionStorage.getItem('youtube-player-autoplayed') === 'true'
      : false;

    if (hasAutoplayedThisSession) {
      logger.log('Autoplay already triggered this session, skipping');
      return;
    }

    logger.log('Triggering autoplay with fade-in');

    // Mark as autoplayed for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('youtube-player-autoplayed', 'true');
    }

    try {
      const prefs = loadPreferences();

      // Clear any existing fade interval
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }

      // Start at 0 volume
      playerRef.current.setVolume(0);
      setPlayerState(prev => ({ ...prev, volume: 0 }));

      // Start playing
      playerRef.current.playVideo();
      setPlayerState(prev => ({ ...prev, isPlaying: true, isPaused: false }));

      // Fade in volume from 0 to 30% over 5 seconds
      const targetVolume = 0.3;
      const fadeDuration = 5000; // 5 seconds
      const fadeSteps = 50; // Update 50 times during fade
      const stepDuration = fadeDuration / fadeSteps;
      const volumeIncrement = targetVolume / fadeSteps;

      let currentStep = 0;
      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        const newVolume = Math.min(volumeIncrement * currentStep, targetVolume);

        if (playerRef.current && isMountedRef.current) {
          playerRef.current.setVolume(newVolume * 100);
          setPlayerState(prev => ({ ...prev, volume: newVolume }));
        }

        if (currentStep >= fadeSteps) {
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
          // Save final volume to preferences
          savePreferences({ volume: targetVolume });
          logger.log('Autoplay fade-in complete at 30% volume');
        }
      }, stepDuration);

    } catch (err) {
      logger.warn('Autoplay blocked by browser:', err);
      // Reset to default volume if autoplay fails
      const prefs = loadPreferences();
      if (playerRef.current) {
        playerRef.current.setVolume(prefs.volume * 100);
      }
      setPlayerState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: true,
        volume: prefs.volume
      }));
    }
  }, [loadPreferences, savePreferences]);

  // Player event handlers
  const handleReady = useCallback((event: YTPlayerEvent) => {
    logger.log('YouTube player ready');
    const player = event.target;

    try {
      const duration = player.getDuration();
      const prefs = loadPreferences();

      setPlayerState(prev => ({
        ...prev,
        duration,
        isReady: true,
        volume: prefs.volume,
        hasVisited: prefs.hasVisited,
      }));

      // Set initial volume
      player.setVolume(prefs.volume * 100);

      // Attempt autoplay for first page load in this session
      // ONLY if the playlist has been initialized (to ensure featured song is loaded first)
      if (playlistInitializedRef.current) {
        logger.log('Player ready and playlist initialized - attempting autoplay');
        triggerAutoplayWithFadeIn();
      } else {
        logger.log('Player ready but playlist not initialized yet - deferring autoplay');
      }

      setIsLoading(false);
    } catch (err) {
      logger.error('Error in handleReady:', err);
      setError('Failed to initialize player');
      setIsLoading(false);
    }
  }, [loadPreferences, triggerAutoplayWithFadeIn]);

  const handleStateChange = useCallback((event: YTPlayerEvent) => {
    const state = event.data;

    switch (state) {
      case PlayerState.PLAYING:
        setPlayerState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
        startTimeUpdates();
        break;
      case PlayerState.PAUSED:
        setPlayerState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
        stopTimeUpdates();
        break;
      case PlayerState.ENDED:
        setPlayerState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
        stopTimeUpdates();

        // Trigger autoplay if there's a playlist
        shouldAutoplayRef.current = true;
        // Use setTimeout to break out of event handler and trigger next track
        setTimeout(() => {
          setPlayerState(current => {
            if (current.playlist.length === 0 || !isMountedRef.current) {
              shouldAutoplayRef.current = false;
              return current;
            }

            const nextIndex = (current.currentIndex + 1) % current.playlist.length;
            const nextTrack = current.playlist[nextIndex];

            if (nextTrack && playerRef.current) {
              const song = currentTrackToSong(nextTrack, nextIndex);

              try {
                retryCountRef.current = 0;
                currentVideoIdRef.current = song.youtube_video_id;
                playerRef.current.loadVideoById(song.youtube_video_id);

                return {
                  ...current,
                  videoId: song.youtube_video_id,
                  currentTrack: nextTrack,
                  currentIndex: nextIndex,
                  currentTime: 0,
                };
              } catch (err) {
                logger.error('Failed to autoplay next track:', err);
                shouldAutoplayRef.current = false;
              }
            }

            shouldAutoplayRef.current = false;
            return current;
          });
        }, 300);
        break;
      case PlayerState.CUED:
        // When next track is cued and ready, autoplay if flag is set
        if (shouldAutoplayRef.current && playerRef.current) {
          shouldAutoplayRef.current = false;
          setTimeout(() => {
            if (playerRef.current && isMountedRef.current) {
              playerRef.current.playVideo();
            }
          }, 100);
        }
        break;
      case PlayerState.BUFFERING:
        // Keep current state during buffering
        break;
      default:
        break;
    }
  }, [startTimeUpdates, stopTimeUpdates, currentTrackToSong]);

  const handleError = useCallback((event: YTPlayerEvent) => {
    logger.error('YouTube player error:', event.data);

    // Retry logic for recoverable errors
    if (retryCountRef.current < 3 && playerRef.current && currentVideoIdRef.current) {
      logger.log(`Retrying playback (attempt ${retryCountRef.current + 1}/3)...`);
      setTimeout(() => {
        if (playerRef.current && isMountedRef.current) {
          try {
            playerRef.current.loadVideoById(currentVideoIdRef.current);
            retryCountRef.current += 1;
          } catch (err) {
            logger.error('Retry failed:', err);
          }
        }
      }, 2000);
    } else {
      setError(`Player error: ${event.data} (failed after 3 retries)`);
      retryCountRef.current = 0; // Reset for next track
    }

    setPlayerState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
  }, []);

  // Initialize YouTube player
  const initializePlayer = useCallback(() => {
    if (!isScriptLoaded || isInitializingRef.current) {
      return;
    }

    if (typeof window === 'undefined' || !window.YT || !window.YT.Player) {
      logger.warn('YouTube API not ready');
      return;
    }

    // Look for the player container element in the DOM
    const containerElement = document.getElementById('youtube-player-container') as HTMLDivElement | null;
    if (!containerElement) {
      logger.log('Player container not found in DOM yet, will retry...');
      return;
    }

    // Store reference to the container
    playerElementRef.current = containerElement;

    // Clean up any existing player first
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (err) {
        logger.error('Error cleaning up existing player:', err);
      }
      playerRef.current = null;
    }

    // Clear the container of any leftover YouTube iframes
    while (containerElement.firstChild) {
      containerElement.removeChild(containerElement.firstChild);
    }

    isInitializingRef.current = true;

    try {
      const prefs = loadPreferences();

      playerRef.current = new window.YT.Player(containerElement, {
        height: '100%',
        width: '100%',
        videoId: DEFAULT_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 1,
          playsinline: 1,
        },
        events: {
          onReady: handleReady,
          onStateChange: handleStateChange,
          onError: handleError,
        },
      });

      logger.log('YouTube player initialized in container');

      // Mark initialization as complete after player is created
      isInitializingRef.current = false;
    } catch (err) {
      logger.error('Failed to initialize player:', err);
      setError('Failed to initialize player');
      setIsLoading(false);
      isInitializingRef.current = false;
    }
  }, [isScriptLoaded, loadPreferences, handleReady, handleStateChange, handleError]);

  // Wait for hydration to complete before initializing player
  useEffect(() => {
    // Use multiple async boundaries to ensure hydration is complete
    // This defers YouTube API initialization until after React finishes hydrating
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          setIsHydrated(true);
        }, 0);
      });
    });
  }, []);

  // Load YouTube IFrame API script - only after hydration is complete
  useEffect(() => {
    if (typeof window === 'undefined' || !isHydrated) return;

    // Check if script already exists
    if (window.YT && window.YT.Player) {
      logger.log('YouTube API already loaded');
      setIsScriptLoaded(true);
      return;
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
    if (existingScript) {
      logger.log('YouTube API script already in DOM, waiting for load');

      // Set up callback for when it loads
      window.onYouTubeIframeAPIReady = () => {
        logger.log('YouTube API ready (existing script)');
        setIsScriptLoaded(true);
      };

      // Check if it's already loaded
      if (window.YT && window.YT.Player) {
        setIsScriptLoaded(true);
      }

      return;
    }

    logger.log('Loading YouTube API script');

    // Inject script
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;

    // Set up callback
    window.onYouTubeIframeAPIReady = () => {
      logger.log('YouTube API ready (new script)');
      setIsScriptLoaded(true);
    };

    script.onerror = () => {
      logger.error('Failed to load YouTube API script');
      setError('Failed to load YouTube player');
      setIsLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      // Don't remove script on cleanup as it may be used by other components
      // Just clean up the callback
      window.onYouTubeIframeAPIReady = undefined;
    };
  }, [isHydrated]);

  // Initialize player when script is loaded
  useEffect(() => {
    if (!isScriptLoaded || !isHydrated) return;

    // Small delay to ensure YT object and DOM are fully ready
    const timer = setTimeout(() => {
      initializePlayer();
    }, 100);

    // Retry logic in case container isn't mounted yet
    const retryTimer = setInterval(() => {
      if (!playerRef.current && document.getElementById('youtube-player-container')) {
        logger.log('Retrying player initialization...');
        initializePlayer();
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      clearInterval(retryTimer);
    };
  }, [isScriptLoaded, isHydrated, initializePlayer]);

  // Load preferences on mount - only after hydration to avoid SSR/client mismatch
  useEffect(() => {
    if (!isHydrated) return;

    const prefs = loadPreferences();
    setPlayerState(prev => ({
      ...prev,
      volume: prefs.volume,
      hasVisited: prefs.hasVisited,
    }));
  }, [isHydrated, loadPreferences]);

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const prefs = JSON.parse(e.newValue) as PlayerPreferences;

          // Sync volume across tabs
          if (typeof prefs.volume === 'number' && playerRef.current) {
            playerRef.current.setVolume(prefs.volume * 100);
            setPlayerState(prev => ({ ...prev, volume: prefs.volume }));
          }
        } catch (err) {
          logger.error('Failed to sync preferences from storage event:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      logger.log('YouTubePlayerProvider unmounting, cleaning up...');

      // Mark as unmounted to prevent stale updates
      isMountedRef.current = false;

      // Stop any running timers
      stopTimeUpdates();

      // Clear fade interval
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }

      // Destroy the YouTube player instance
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (err) {
          logger.error('Error destroying player:', err);
        }
      }

      // Clear reference to container (React will clean up the DOM)
      playerElementRef.current = null;

      // Reset initialization flag
      isInitializingRef.current = false;
    };
  }, [stopTimeUpdates]);

  // Control methods
  const play = useCallback(() => {
    if (!playerRef.current || !playerState.isReady) return;

    try {
      playerRef.current.playVideo();
    } catch (err) {
      logger.error('Failed to play:', err);
      setError('Failed to play video');
    }
  }, [playerState.isReady]);

  const pause = useCallback(() => {
    if (!playerRef.current || !playerState.isReady) return;

    try {
      playerRef.current.pauseVideo();
    } catch (err) {
      logger.error('Failed to pause:', err);
      setError('Failed to pause video');
    }
  }, [playerState.isReady]);

  const setVolume = useCallback((volume: number) => {
    if (!playerRef.current || !playerState.isReady) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));

    try {
      playerRef.current.setVolume(clampedVolume * 100);
      setPlayerState(prev => ({ ...prev, volume: clampedVolume }));
      savePreferences({ volume: clampedVolume });
    } catch (err) {
      logger.error('Failed to set volume:', err);
      setError('Failed to set volume');
    }
  }, [playerState.isReady, savePreferences]);

  const seekTo = useCallback((seconds: number) => {
    if (!playerRef.current || !playerState.isReady) return;

    try {
      playerRef.current.seekTo(seconds, true);
      setPlayerState(prev => ({ ...prev, currentTime: seconds }));
      savePreferences({ lastPosition: seconds });
    } catch (err) {
      logger.error('Failed to seek:', err);
      setError('Failed to seek');
    }
  }, [playerState.isReady, savePreferences]);

  const loadVideo = useCallback((videoId: string) => {
    if (!playerRef.current || !playerState.isReady) return;

    try {
      playerRef.current.loadVideoById(videoId);
      setPlayerState(prev => ({
        ...prev,
        videoId,
        currentTime: 0,
        isPlaying: false,
        isPaused: true,
      }));

      // Update duration after video loads
      setTimeout(() => {
        if (playerRef.current) {
          try {
            const duration = playerRef.current.getDuration();
            setPlayerState(prev => ({ ...prev, duration }));
          } catch (err) {
            logger.error('Failed to get duration:', err);
          }
        }
      }, 1000);
    } catch (err) {
      logger.error('Failed to load video:', err);
      setError('Failed to load video');
    }
  }, [playerState.isReady]);

  const loadTrack = useCallback((track: Song) => {
    if (!playerRef.current || !playerState.isReady) {
      logger.log('Cannot load track - player not ready:', {
        hasPlayer: !!playerRef.current,
        isReady: playerState.isReady
      });
      return;
    }

    logger.log('Loading track:', {
      title: track.title,
      videoId: track.youtube_video_id
    });

    try {
      // Reset retry counter for new track
      retryCountRef.current = 0;

      // Update the ref so handleError has access to current video ID
      currentVideoIdRef.current = track.youtube_video_id;

      playerRef.current.loadVideoById(track.youtube_video_id);
      setPlayerState(prev => ({
        ...prev,
        videoId: track.youtube_video_id,
        currentTrack: {
          id: track.id,
          title: track.title,
          artist: track.artist,
          albumCoverUrl: track.album_cover_url,
          youtubeVideoId: track.youtube_video_id,
          // Enhanced metadata
          durationSeconds: track.duration_seconds,
          tags: track.tags,
          releaseDate: track.release_date,
          description: track.description,
        },
        currentTime: 0,
        isPlaying: false,
        isPaused: true,
      }));

      // Update duration after video loads
      setTimeout(() => {
        if (playerRef.current && isMountedRef.current) {
          try {
            const duration = playerRef.current.getDuration();
            setPlayerState(prev => ({ ...prev, duration }));
          } catch (err) {
            logger.error('Failed to get duration:', err);
          }
        }
      }, 1000);
    } catch (err) {
      logger.error('Failed to load track:', err);
      setError('Failed to load track');
    }
  }, [playerState.isReady]);


  // Playlist control methods
  const setPlaylist = useCallback((tracks: Song[]) => {
    logger.log('Setting playlist with', tracks.length, 'tracks. First track:', tracks[0]?.title);

    const playlist: CurrentTrack[] = tracks.map(track => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      albumCoverUrl: track.album_cover_url,
      youtubeVideoId: track.youtube_video_id,
      durationSeconds: track.duration_seconds,
      tags: track.tags,
      releaseDate: track.release_date,
      description: track.description,
    }));

    // Determine the current index
    let newIndex = -1;
    if (playlist.length > 0) {
      if (playerState.currentTrack) {
        // If there's already a current track, try to find it in the new playlist
        newIndex = playlist.findIndex(t => t.id === playerState.currentTrack?.id);
        if (newIndex === -1) {
          // Current track not in new playlist, default to first track
          newIndex = 0;
        }
      } else {
        // No current track, default to first track
        newIndex = 0;
      }
    }

    setPlayerState(prev => ({
      ...prev,
      playlist,
      currentIndex: newIndex,
      // Don't auto-set currentTrack here - let loadTrack set it to ensure sync
    }));

    // Mark playlist as initialized
    playlistInitializedRef.current = true;

    // If there's no current track and we have tracks, load the first one
    // This works whether player is ready now or becomes ready later
    if (!playerState.currentTrack && tracks.length > 0) {
      logger.log('Auto-loading first track:', tracks[0].title);

      // If player is ready, load immediately
      if (playerRef.current && playerState.isReady) {
        loadTrack(tracks[0]);

        // Trigger autoplay with fade-in (with delay to let track load)
        logger.log('Triggering deferred autoplay now that playlist is initialized');
        setTimeout(() => {
          if (playerRef.current && isMountedRef.current) {
            triggerAutoplayWithFadeIn();
          }
        }, 500);
      } else {
        // Player not ready yet - the useEffect will load it when ready
        logger.log('Player not ready yet, will load first track when ready');
      }
    }
  }, [playerState.currentTrack, playerState.isReady, loadTrack, triggerAutoplayWithFadeIn]);

  const jumpToTrack = useCallback((index: number) => {
    if (index < 0 || index >= playerState.playlist.length) {
      logger.warn('Invalid track index:', index);
      return;
    }

    const track = playerState.playlist[index];
    if (!track) return;

    const song = currentTrackToSong(track, index);
    loadTrack(song);
    setPlayerState(prev => ({ ...prev, currentIndex: index }));
  }, [playerState.playlist, loadTrack, currentTrackToSong]);

  const next = useCallback(() => {
    if (playerState.playlist.length === 0) return;

    const nextIndex = (playerState.currentIndex + 1) % playerState.playlist.length;
    jumpToTrack(nextIndex);
  }, [playerState.playlist.length, playerState.currentIndex, jumpToTrack]);

  const previous = useCallback(() => {
    if (playerState.playlist.length === 0) return;

    const prevIndex = playerState.currentIndex <= 0
      ? playerState.playlist.length - 1
      : playerState.currentIndex - 1;
    jumpToTrack(prevIndex);
  }, [playerState.playlist.length, playerState.currentIndex, jumpToTrack]);

  // Auto-load first track when player becomes ready if playlist exists but no track is loaded
  useEffect(() => {
    if (playerState.isReady && playerState.playlist.length > 0 && !playerState.currentTrack && playerRef.current) {
      logger.log('Player ready with playlist but no track loaded, auto-loading first track');
      const firstTrack = playerState.playlist[0];
      const song = currentTrackToSong(firstTrack, 0);

      loadTrack(song);
      setPlayerState(prev => ({ ...prev, currentIndex: 0 }));

      // Trigger autoplay with fade-in (with delay to let track load)
      logger.log('Triggering autoplay (player became ready after playlist init)');
      setTimeout(() => {
        if (playerRef.current && isMountedRef.current) {
          triggerAutoplayWithFadeIn();
        }
      }, 500);
    }
  }, [playerState.isReady, playerState.playlist, playerState.currentTrack, loadTrack, currentTrackToSong, triggerAutoplayWithFadeIn]);

  const contextValue: YouTubePlayerContextValue = {
    ...playerState,
    play,
    pause,
    setVolume,
    seekTo,
    loadVideo,
    loadTrack,
    next,
    previous,
    setPlaylist,
    jumpToTrack,
    isLoading,
    isScriptLoaded,
    error,
  };

  return (
    <YouTubePlayerContext.Provider value={contextValue}>
      {/* Player container is now created directly in the DOM via useEffect, outside React's control */}
      {children}
    </YouTubePlayerContext.Provider>
  );
}
