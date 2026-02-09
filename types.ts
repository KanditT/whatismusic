
export enum ModuleId {
  MENU = 'MENU',
  MELODY = 'MELODY',
  RHYTHM = 'RHYTHM',
  TEMPO = 'TEMPO',
  DYNAMICS = 'DYNAMICS',
  HARMONY = 'HARMONY'
}

export type Language = 'EN' | 'TH';
export type Theme = 'light' | 'dark';

export interface ModuleData {
  id: ModuleId;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  icon: string;
  description: Record<Language, string>;
  color: string;
}

export interface Point {
  x: number;
  y: number;
}
