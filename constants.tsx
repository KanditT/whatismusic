
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
    color: '#9B5FE3',
    guide: {
      title: { EN: 'How to Play Melody', TH: 'วิธีเล่นทำนอง' },
      instructions: {
        EN: [
          'Drag your finger or mouse across the dots to create a path.',
          'Press the PLAY button to hear the melody you drew.',
          'Change the playback speed using the slider on the left.',
          'Hit the RESET button to clear the canvas and try again.'
        ],
        TH: [
          'ลากนิ้วหรือเมาส์ผ่านจุดต่างๆ เพื่อวาดเส้นทำนอง',
          'กดปุ่มเล่นเพื่อฟังเสียงทำนองที่คุณวาด',
          'ปรับความเร็วในการเล่นได้ด้วยแถบเลื่อนด้านซ้าย',
          'กดปุ่มรีเซ็ตเพื่อล้างกระดานและเริ่มใหม่'
        ]
      }
    }
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
    color: '#10b981',
    guide: {
      title: { EN: 'How to Play Rhythm', TH: 'วิธีเล่นจังหวะ' },
      instructions: {
        EN: [
          'Tap the squares in the 4x4 grid to turn sounds on or off.',
          'Each row plays a different instrument (Kick, Snare, Tom, Hi-hat).',
          'Press PLAY LOOP to start the sequencer.',
          'Use the Tempo slider to slow down or speed up the beat.'
        ],
        TH: [
          'แตะที่ช่องสี่เหลี่ยมในตาราง 4x4 เพื่อเปิดหรือปิดเสียง',
          'แต่ละแถวจะเล่นเสียงเครื่องดนตรีที่ต่างกัน (Kick, Snare, Tom, Hi-hat)',
          'กด "เล่นวนลูป" เพื่อเริ่มเล่นจังหวะ',
          'ใช้แถบเลื่อนความเร็ว (Tempo) เพื่อลดหรือเพิ่มจังหวะ'
        ]
      }
    }
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
    color: '#f59e0b',
    guide: {
      title: { EN: 'How to Play Tempo', TH: 'วิธีเล่นความเร็ว' },
      instructions: {
        EN: [
          'Drag the slider to change the Beats Per Minute (BPM).',
          'Notice how the bouncing shapes react to the changing speed.',
          'Try the preset buttons (Largo, Andante, Allegro) for instant changes.',
          'Record your voice and press play to hear how tempo scales audio!'
        ],
        TH: [
          'ลากแถบเลื่อนเพื่อเปลี่ยนความเร็วของจังหวะต่อนาที (BPM)',
          'สังเกตดูว่ารูปทรงที่เด้งตอบสนองต่อการเปลี่ยนความเร็วอย่างไร',
          'ลองกดปุ่มอัตโนมัติ (Largo, Andante, Allegro) เพื่อเปลี่ยนความเร็วทันที',
          'บันทึกเสียงของคุณและกดเล่นเพื่อฟังว่าเสียงเปลี่ยนไปตามความเร็วอย่างไร!'
        ]
      }
    }
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
    color: '#a855f7',
    guide: {
      title: { EN: 'How to Play Dynamics', TH: 'วิธีเล่นความดัง-เบา' },
      instructions: {
        EN: [
          'Click and drag the glowing orb handle up or down.',
          'Moving it up increases the volume (Forte) and intensity of the sound.',
          'Moving it down decreases the volume (Piano) making it softer.',
          'Watch the visual waves react to the changing dynamics.'
        ],
        TH: [
          'คลิกและลากวงแหวนสว่างขึ้นหรือลง',
          'ลากขึ้นเพื่อเพิ่มความดัง (Forte) และความเข้มของเสียง',
          'ลากลงเพื่อลดความดัง (Piano) ทำให้เสียงเบาลง',
          'ดูการตอบสนองของคลื่นภาพตามความดังที่เปลี่ยนไป'
        ]
      }
    }
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
    color: '#B87AFF',
    guide: {
      title: { EN: 'How to Play Harmony', TH: 'วิธีเล่นเสียงประสาน' },
      instructions: {
        EN: [
          'Click individual notes to turn them on or off.',
          'Stack multiple notes together to hear how they blend into a chord.',
          'Try the quick-presets on the left to instantly build popular chords.',
          'Notice how the overlapping glowing colors form new textures.'
        ],
        TH: [
          'คลิกที่โน้ตแต่ละตัวเพื่อเปิดหรือปิดเสียง',
          'เล่นเสียงโน้ตหลายตัวพร้อมกันเพื่อฟังการประสานเสียงคลื่นเข้าด้วยกัน',
          'ลองกดปุ่มอัตโนมัติด้านซ้ายเพื่อสร้างคอร์ดที่เป็นที่นิยมทันที',
          'สังเกตสีสะท้อนแสงซ้อนทับกันสร้างพื้นผิวใหม่'
        ]
      }
    }
  }
];

export const TRANSLATIONS: Record<string, Record<Language, string>> = {
  gotIt: { EN: 'GOT IT', TH: 'เข้าใจแล้ว' },
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
  },
  voiceExp: { EN: 'Voice Experiment', TH: 'ทดลองด้วยเสียงของคุณ' },
  recordVoice: { EN: 'RECORD VOICE', TH: 'บันทึกเสียง' },
  stopRecord: { EN: 'STOP RECORDING', TH: 'หยุดบันทึก' },
  playVoice: { EN: 'PLAY VOICE', TH: 'เล่นเสียง' },
  stopVoice: { EN: 'STOP VOICE', TH: 'หยุดเสียง' },
  voiceHint: { EN: 'Record your voice and see how tempo changes its speed and pitch!', TH: 'บันทึกเสียงของคุณและดูว่าเทมโปเปลี่ยนความเร็วและระดับเสียงอย่างไร!' },
  metronomeSound: { EN: 'Metronome Tick', TH: 'เสียงจังหวะพื้นฐาน' },
  prevModule: { EN: 'Prev', TH: 'ก่อนหน้า' },
  nextModule: { EN: 'Next', TH: 'ถัดไป' }
};
