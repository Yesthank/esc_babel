import * as THREE from 'three';
import { ROOM_CONFIGS } from '../RoomConfigs';
import type { InteractableEntry } from '../../types/game';
import { makeBox, makeRoom } from './GeometryHelpers';

export function buildRoom2(
  scene: THREE.Scene,
  rooms: THREE.Group[],
  interactables: InteractableEntry[],
): void {
  const cfg = ROOM_CONFIGS[1];
  const g = makeRoom(cfg, 1, scene, rooms);
  const [w, h, d] = cfg.size;

  // Cold blue-white spot lights (fluorescent)
  const fluor1 = new THREE.RectAreaLight(0x88BBFF, 2, 2, 0.3);
  fluor1.position.set(-1.5, h - 0.1, 0);
  fluor1.lookAt(-1.5, 0, 0);
  g.add(fluor1);

  const fluor2 = new THREE.RectAreaLight(0x88BBFF, 2, 2, 0.3);
  fluor2.position.set(1.5, h - 0.1, 0);
  fluor2.lookAt(1.5, 0, 0);
  g.add(fluor2);

  // Fluorescent tube housings
  g.add(makeBox(2, 0.05, 0.15, 0xCCCCCC, -1.5, h - 0.08, 0, { emissive: 0x88BBFF, emissiveIntensity: 0.5 }));
  g.add(makeBox(2, 0.05, 0.15, 0xCCCCCC, 1.5, h - 0.08, 0, { emissive: 0x88BBFF, emissiveIntensity: 0.5 }));

  // ===== CENTRAL WORK TABLE =====
  g.add(makeBox(2.5, 0.06, 1, 0x556677, 0, 0.85, 0)); // top
  g.add(makeBox(0.06, 0.85, 0.06, 0x445566, -1.1, 0.425, -0.4));
  g.add(makeBox(0.06, 0.85, 0.06, 0x445566, 1.1, 0.425, -0.4));
  g.add(makeBox(0.06, 0.85, 0.06, 0x445566, -1.1, 0.425, 0.4));
  g.add(makeBox(0.06, 0.85, 0.06, 0x445566, 1.1, 0.425, 0.4));

  // ===== TYPEWRITER on table (puzzle interactable) =====
  // Typewriter body
  g.add(makeBox(0.35, 0.12, 0.3, 0x222222, 0, 0.94, 0, { roughness: 0.3, metalness: 0.6 }));
  // Paper guide
  g.add(makeBox(0.3, 0.15, 0.02, 0x333333, 0, 1.05, -0.14, { metalness: 0.5 }));
  // Paper
  g.add(makeBox(0.25, 0.2, 0.005, 0xFFF8DC, 0, 1.1, -0.15));
  // Keys row
  g.add(makeBox(0.3, 0.02, 0.08, 0x333333, 0, 0.91, 0.12));

  const typewriterLock = makeBox(0.4, 0.15, 0.35, 0x333344, 0, 0.93, 0, {
    name: 'typewriter_lock',
    emissive: 0x001122,
    emissiveIntensity: 0.15,
  });
  typewriterLock.userData = {
    type: 'puzzle',
    puzzleId: 'typewriter_lock',
    prompt: '[E] 타자기 잠금장치',
    lockedMsg: '잠겨있다. 5자리 영문 코드가 필요하다.',
    unlockedMsg: '타자기가 열렸다!',
  };
  g.add(typewriterLock);
  interactables.push({ mesh: typewriterLock, room: 1 });

  // ===== BILINGUAL NOTE (examine) =====
  const bilingualNote = makeBox(0.2, 0.005, 0.15, 0xFFFACD, -0.7, 0.89, 0.2, {
    name: 'bilingual_note',
    emissive: 0x222200,
    emissiveIntensity: 0.2,
  });
  bilingualNote.userData = {
    type: 'examine',
    prompt: '[E] 이중언어 노트 읽기',
    dialog: {
      title: '이중언어 노트',
      content:
        '교수의 한영 융합 실험 노트:\n\n' +
        '"한글 자음/모음이 영어 단어에 융합되면\n' +
        ' 새로운 단어가 탄생한다!"\n\n' +
        '실험 기록:\n' +
        '  ink + 피(P) = Pink ✓\n' +
        '  art + 피(P) = Part ✓\n' +
        '  lock + 비(?) = ???\n\n' +
        '"비"의 영문 음가를 찾아\n' +
        'lock 앞에 붙여보라.\n\n' +
        '이것이 번역의 핵심이다 —\n' +
        '두 언어의 경계를 넘는 것.',
    },
  };
  g.add(bilingualNote);
  interactables.push({ mesh: bilingualNote, room: 1 });

  // ===== WHITEBOARD (examine) =====
  g.add(makeBox(1.8, 1.2, 0.04, 0xEEEEFF, -w / 2 + 0.05, 1.5, 0));
  const wbText = makeBox(1.6, 1.0, 0.005, 0xDDDDEE, -w / 2 + 0.07, 1.5, 0, {
    name: 'whiteboard',
    emissive: 0x111122,
    emissiveIntensity: 0.1,
  });
  wbText.userData = {
    type: 'examine',
    prompt: '[E] 화이트보드 읽기',
    dialog: {
      title: '화이트보드 공식',
      content:
        '교수의 필체로 적힌 공식들:\n\n' +
        '━━━ 한영 융합 법칙 ━━━\n\n' +
        '규칙: 한글 음절의 영문 음가를 추출하여\n' +
        '      영단어의 앞에 접합한다.\n\n' +
        '피 = P → ink → P + ink = Pink ✓\n' +
        '비 = B → lock → B + lock = ??? \n\n' +
        '화이트보드 구석에 적힌 메모:\n' +
        '"타자기에 정답을 입력하라"',
    },
  };
  g.add(wbText);
  interactables.push({ mesh: wbText, room: 1 });

  // ===== KOREAN CONVERSION TABLE (examine — Quiz 3 environmental storytelling) =====
  const koreanTable = makeBox(0.5, 0.4, 0.03, 0xDDCCAA, w / 2 - 0.05, 1.5, -1.5, {
    name: 'korean_table',
    emissive: 0x221100,
    emissiveIntensity: 0.15,
  });
  koreanTable.userData = {
    type: 'examine',
    prompt: '[E] 한글 변환 분석표 조사',
    dialog: {
      title: '한글 변환 분석표',
      content:
        '교수의 또 다른 연구 — 거울 문자 변환:\n\n' +
        '"알파벳을 좌우 반전하면\n' +
        ' 한글 자모와 놀랍도록 닮는다!"\n\n' +
        'E(뒤집음) → ㅌ\n' +
        'x(뒤집음) → ㅡ (모음)\n' +
        '+(뒤집음) → ㄱ\n' +
        'l → ㄹ (그대로)\n' +
        'b(뒤집음) → ㅂ\n\n' +
        '조합하면: ㅌ+ㅡ+ㄱ+ㄹ+ㅂ\n' +
        '→ 특급\n\n' +
        '메모: "이 패턴은 퍼즐로만... 탈출에는 불필요하다"',
    },
  };
  g.add(koreanTable);
  interactables.push({ mesh: koreanTable, room: 1 });

  // ===== TRANSLATION CONSOLE (back wall, decorative) =====
  g.add(makeBox(2.5, 1.8, 0.4, 0x334455, 0, 1.2, -d / 2 + 0.25, { roughness: 0.5, metalness: 0.3 }));
  // Screens on console
  g.add(makeBox(0.8, 0.5, 0.02, 0x112233, -0.6, 1.5, -d / 2 + 0.07, {
    emissive: 0x224488,
    emissiveIntensity: 0.6,
  }));
  g.add(makeBox(0.8, 0.5, 0.02, 0x112233, 0.6, 1.5, -d / 2 + 0.07, {
    emissive: 0x224488,
    emissiveIntensity: 0.6,
  }));
  // Console glow
  const consoleGlow = new THREE.PointLight(0x4488FF, 0.4, 3);
  consoleGlow.position.set(0, 1.5, -d / 2 + 0.8);
  g.add(consoleGlow);

  // ===== FILE CABINET (right wall) =====
  g.add(makeBox(0.5, 1.2, 0.4, 0x556677, w / 2 - 0.3, 0.6, 1.5, { metalness: 0.4 }));
  // Drawers
  g.add(makeBox(0.45, 0.02, 0.35, 0x667788, w / 2 - 0.3, 0.4, 1.5));
  g.add(makeBox(0.45, 0.02, 0.35, 0x667788, w / 2 - 0.3, 0.8, 1.5));

  // ===== Dictionaries on table =====
  g.add(makeBox(0.2, 0.15, 0.15, 0x8B0000, 0.8, 0.96, -0.2));
  g.add(makeBox(0.18, 0.12, 0.14, 0x006400, 0.8, 0.96, 0));
  g.add(makeBox(0.22, 0.1, 0.16, 0x00008B, 0.6, 0.94, -0.1));

  // ===== DOOR back to Room 1 =====
  const doorBack = makeBox(0.9, 2.2, 0.1, 0x445566, -2, 1.1, d / 2 - 0.05, { name: 'door_back1' });
  doorBack.userData = {
    type: 'door',
    targetRoom: 0,
    prompt: '[E] 서재로 돌아가기',
    requires: null,
    spawnLocal: { x: 0, z: 2.5 },
    faceY: 0,
  };
  g.add(doorBack);
  interactables.push({ mesh: doorBack, room: 1 });

  // ===== DOOR to Room 3 =====
  const door2 = makeBox(0.9, 2.2, 0.1, 0x334455, 0, 1.1, -d / 2 + 0.05, {
    name: 'door_to_tower',
    emissive: 0x000000,
  });
  door2.userData = {
    type: 'door',
    targetRoom: 2,
    prompt: '[E] 탑의 꼭대기로 이동',
    requires: 'tower_key',
    lockedMsg: '잠겨있다. 탑의 열쇠가 필요하다.',
    spawnLocal: { x: -3, z: -4 },
    faceY: Math.PI,
  };
  g.add(door2);
  interactables.push({ mesh: door2, room: 1 });

  // Door frames
  g.add(makeBox(0.08, 2.3, 0.15, 0x334455, -0.5, 1.15, -d / 2 + 0.05));
  g.add(makeBox(0.08, 2.3, 0.15, 0x334455, 0.5, 1.15, -d / 2 + 0.05));
  g.add(makeBox(1.08, 0.08, 0.15, 0x334455, 0, 2.3, -d / 2 + 0.05));

  // ===== Scattered papers on floor =====
  for (let i = 0; i < 3; i++) {
    const paper = makeBox(
      0.2, 0.003, 0.28, 0xFFFACD,
      -1.5 + Math.random() * 3, 0.05, 1 + Math.random() * 2,
    );
    paper.rotation.y = Math.random() * Math.PI;
    g.add(paper);
  }
}
