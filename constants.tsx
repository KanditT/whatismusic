
import { ModuleId, ModuleData, Language } from './types';

export const MODULES: ModuleData[] = [
  {
    id: ModuleId.MELODY,
    title: { EN: 'Melody', TH: 'ทำนอง' },
    subtitle: { EN: 'Melody', TH: 'ทำนอง' },
    icon: 'music_note',
    description: { 
      EN: 'Pitch moves up and down over time.', 
      TH: 'ระดับเสียงเคลื่อนที่ขึ้นและลงตามเวลา' 
    },
    color: '#13c8ec'
  },
  {
    id: ModuleId.RHYTHM,
    title: { EN: 'Rhythm', TH: 'จังหวะ' },
    subtitle: { EN: 'Rhythm', TH: 'จังหวะ' },
    icon: 'grid_view',
    description: { 
      EN: 'Tap the grid to create visualization.', 
      TH: 'แตะที่ตารางเพื่อสร้างภาพจำลองจังหวะ' 
    },
    color: '#10b981'
  },
  {
    id: ModuleId.TEMPO,
    title: { EN: 'Tempo', TH: 'ความเร็ว' },
    subtitle: { EN: 'Tempo', TH: 'ความเร็ว' },
    icon: 'speed',
    description: { 
      EN: 'Tempo is the speed of the beat.', 
      TH: 'ความเร็วคือความเร็วของจังหวะ' 
    },
    color: '#f59e0b'
  },
  {
    id: ModuleId.DYNAMICS,
    title: { EN: 'Dynamics', TH: 'ความดัง-เบา' },
    subtitle: { EN: 'Dynamics', TH: 'ความดัง-เบา' },
    icon: 'volume_up',
    description: { 
      EN: 'Explore volume variation.', 
      TH: 'สำรวจความแตกต่างระหว่างเสียงดังและเบา' 
    },
    color: '#a855f7'
  },
  {
    id: ModuleId.HARMONY,
    title: { EN: 'Harmony', TH: 'เสียงประสาน' },
    subtitle: { EN: 'Harmony', TH: 'เสียงประสาน' },
    icon: 'piano',
    description: { 
      EN: 'Layer notes to build texture.', 
      TH: 'วางตัวโน้ตซ้อนกันเพื่อสร้างเสียงประสาน' 
    },
    color: '#13c8ec'
  }
];

export const TRANSLATIONS: Record<string, Record<Language, string>> = {
  backToMenu: { EN: 'Back to Menu', TH: 'กลับสู่เมนู' },
  exhibition: { EN: 'Interactive Exhibition', TH: 'นิทรรศการเสียงเชิงโต้ตอบ' },
  startExhibition: { EN: 'START EXHIBITION', TH: 'เริ่มชมนิทรรศการ' },
  reset: { EN: 'RESET', TH: 'รีเซ็ต' },
  clear: { EN: 'CLEAR ALL', TH: 'ล้างทั้งหมด' },
  showGuides: { EN: 'Show Guides', TH: 'แสดงเส้นไกด์' },
  playbackSpeed: { EN: 'Playback Speed', TH: 'ความเร็วในการเล่น' },
  playLoop: { EN: 'PLAY LOOP', TH: 'เล่นวนลูป' },
  stopLoop: { EN: 'STOP LOOP', TH: 'หยุดวนลูป' },
  volume: { EN: 'VOLUME', TH: 'ระดับเสียง' },
  harmonyName: { EN: 'Current Harmony', TH: 'เสียงประสานปัจจุบัน' },
  tryCombinations: { EN: 'Try These Combinations:', TH: 'ลองผสมเสียงเหล่านี้:' },
  drawMelody: { EN: 'DRAW YOUR MELODY', TH: 'วาดทำนองของคุณ' },
  visualImpact: { EN: 'Visual Impact', TH: 'ผลกระทบทางสายตา' },
  currentTempo: { EN: 'Current Tempo', TH: 'ความเร็วปัจจุบัน' },
  didYouKnow: { EN: 'Did you know?', TH: 'รู้หรือไม่?' },
  tempoDesc: { 
    EN: 'Tempo is the speed of the beat. Drag the slider to see how speed changes the energy of the shapes.', 
    TH: 'เทมโปคือความเร็วของจังหวะ ลองเลื่อนแถบสไลด์เพื่อดูว่าความเร็วเปลี่ยนพลังงานของรูปทรงอย่างไร' 
  },
  italianTerms: {
    EN: '"Italian terms are used for tempo because Italian composers were the first to formalize these indicators in the 17th century."',
    TH: '"คำศัพท์ภาษาอิตาลีถูกนำมาใช้เรียกเทมโป เนื่องจากนักประพันธ์เพลงชาวอิตาลีเป็นกลุ่มแรกที่เริ่มกำหนดสัญลักษณ์เหล่านี้อย่างเป็นทางการในศตวรรษที่ 17"'
  }
};
