
import { generateJoseAudio, decodeBase64, decodeAudioData } from './geminiService';
import { Language } from '../types';
import { SYSTEM_CONFIG } from '../constants';

class VoiceService {
  private static instance: VoiceService;
  private ctx: AudioContext | null = null;
  private activeSource: AudioBufferSourceNode | null = null;
  private subscribers: Set<(isSpeaking: boolean, key: string | null) => void> = new Set();
  private currentKey: string | null = null;
  private isLoading: boolean = false;
  private globalAudioIsPlaying: boolean = false;

  private constructor() {}

  static getInstance() {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  subscribe(callback: (isSpeaking: boolean, key: string | null) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notify(isSpeaking: boolean, key: string | null) {
    this.subscribers.forEach(cb => cb(isSpeaking, key));
  }

  async play(text: string, key: string, lang: Language = 'fr') {
    // ANTI-OVERLAP (Mutex Logic): Stop everything before playing something new
    this.stop();

    // SPLIT TEXT INTO PARAGRAPHS FOR ACCESSIBILITY PAUSES
    const paragraphs = text.split(/\n\n|STEP \d:/).filter(p => p.trim().length > 0);
    
    this.isLoading = true;
    this.notify(false, 'loading');

    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      if (this.ctx.state === 'suspended') await this.ctx.resume();

      this.globalAudioIsPlaying = true;
      this.currentKey = key;
      this.notify(true, key);

      for (const p of paragraphs) {
        // Double check global flag to support sudden stop() calls
        if (!this.globalAudioIsPlaying) break;

        const base64 = await generateJoseAudio(p, lang);
        if (!base64) continue;

        const decoded = decodeBase64(base64);
        const audioBuffer = await decodeAudioData(decoded, this.ctx, 24000, 1);
        
        const source = this.ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.ctx.destination);
        
        this.activeSource = source;
        source.start();

        await new Promise((resolve) => {
          source.onended = () => resolve(true);
        });

        // ACCESSIBILITY PAUSE (1.5s between steps/paragraphs)
        if (this.globalAudioIsPlaying) {
          await new Promise(resolve => setTimeout(resolve, SYSTEM_CONFIG.audio_logic.pause_duration));
        }
      }

      this.stop();
    } catch (e) {
      console.error("STARK-VOICE-ERROR:", e);
      this.stop();
    }
  }

  stop() {
    if (this.activeSource) {
      try {
        this.activeSource.stop();
      } catch (e) {}
      this.activeSource = null;
    }
    this.globalAudioIsPlaying = false;
    this.currentKey = null;
    this.isLoading = false;
    this.notify(false, null);
  }

  isCurrentlyReading(key: string) {
    return this.currentKey === key && this.globalAudioIsPlaying;
  }
}

export const voiceService = VoiceService.getInstance();
