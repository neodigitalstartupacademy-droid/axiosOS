
import { generateJoseAudio, decodeBase64, decodeAudioData } from './geminiService';
import { Language } from '../types';

class VoiceService {
  private static instance: VoiceService;
  private ctx: AudioContext | null = null;
  private activeSource: AudioBufferSourceNode | null = null;
  private subscribers: Set<(isSpeaking: boolean, key: string | null) => void> = new Set();
  private currentKey: string | null = null;
  private isLoading: boolean = false;

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
    // Audit vocal : Stop immédiat si on reclique sur le même lecteur
    if (this.currentKey === key) {
      this.stop();
      return;
    }

    // Protection interférence : On coupe toute source active
    this.stop();
    this.isLoading = true;
    this.notify(false, 'loading'); // Etat spécial pour l'UI

    try {
      const base64 = await generateJoseAudio(text, lang);
      if (!base64) {
        this.isLoading = false;
        return;
      }

      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      const decoded = decodeBase64(base64);
      const audioBuffer = await decodeAudioData(decoded, this.ctx, 24000, 1);
      
      const source = this.ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.ctx.destination);
      
      this.activeSource = source;
      this.currentKey = key;
      this.isLoading = false;
      this.notify(true, key);

      source.start();
      source.onended = () => {
        if (this.currentKey === key) {
          this.currentKey = null;
          this.notify(false, null);
        }
      };
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
    this.currentKey = null;
    this.isLoading = false;
    this.notify(false, null);
  }

  isCurrentlyReading(key: string) {
    return this.currentKey === key;
  }
}

export const voiceService = VoiceService.getInstance();
