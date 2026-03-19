import type { Puzzles } from '../types/game';

export const PUZZLES: Puzzles = {
  bookshelf_lock: {
    answer: 'HELL',
    hints: [
      '벽의 도표를 다시 살펴보세요. PIN이 PEN으로 바뀌었습니다.',
      '모음 I가 E로 바뀌는 패턴입니다. HILL에서 I를 E로 바꾸면?',
      'I → E 변환: HILL → HELL',
    ],
    mode: 'alpha',
  },
  typewriter_lock: {
    answer: 'BLOCK',
    hints: [
      '이중언어 노트를 다시 읽어보세요. 한글 음절이 영어에 합쳐지는 패턴입니다.',
      '"ink + 피(P) = Pink"처럼, "lock + 비(B) = ???"',
      '비(B) + lock = BLOCK',
    ],
    mode: 'alpha',
  },
  tower_exit: {
    answer: 'HEAT',
    hints: [
      '코덱스를 다시 읽어보세요. 각 단어가 어떻게 분해되는지 주목하세요.',
      'FISH = F·IS·H, LIST = L·IS·T... 가운데 글자를 빼면 패턴이 보입니다.',
      'FR·VL에서 가운데에 EA를 넣으면: F·EA·T → 하지만 4글자... FRVL의 가운데 = HEAT',
    ],
    mode: 'alpha',
  },
};
