import * as THREE from 'three';
import { ROOM_CONFIGS } from '../RoomConfigs';
import type { InteractableEntry } from '../../types/game';
import { makeBox, makeRoom } from './GeometryHelpers';

export function buildRoom3(
  scene: THREE.Scene,
  rooms: THREE.Group[],
  interactables: InteractableEntry[],
): void {
  const cfg = ROOM_CONFIGS[2];
  const g = makeRoom(cfg, 2, scene, rooms);
  const [w, h, d] = cfg.size;

  // Purple atmospheric lighting
  const purpleLight1 = new THREE.PointLight(0x6644AA, 0.6, 10);
  purpleLight1.position.set(-3, h - 1, -3);
  g.add(purpleLight1);

  const purpleLight2 = new THREE.PointLight(0x4422AA, 0.4, 10);
  purpleLight2.position.set(3, h - 1, 3);
  g.add(purpleLight2);

  // Moonlight from windows
  const moonlight = new THREE.DirectionalLight(0x8888CC, 0.3);
  moonlight.position.set(2, h, -2);
  g.add(moonlight);

  // ===== TALL BOOKSHELF PILLARS (4 corners) =====
  const pillarPositions = [
    [-w / 2 + 0.8, -d / 2 + 0.8],
    [w / 2 - 0.8, -d / 2 + 0.8],
    [-w / 2 + 0.8, d / 2 - 0.8],
    [w / 2 - 0.8, d / 2 - 0.8],
  ];
  pillarPositions.forEach(([px, pz]) => {
    g.add(makeBox(0.8, h - 0.3, 0.8, 0x2A1A38, px, (h - 0.3) / 2, pz, { roughness: 0.85 }));
    // Books on pillars
    for (let by = 0; by < 6; by++) {
      for (let bx = -1; bx <= 1; bx++) {
        const bookColor = [0x4B0082, 0x8B0000, 0x006400, 0x8B4513, 0x191970][Math.floor(Math.random() * 5)];
        const bookH = 0.2 + Math.random() * 0.15;
        g.add(makeBox(0.15, bookH, 0.12, bookColor,
          px + bx * 0.18, 0.3 + by * 0.6 + bookH / 2, pz + 0.35));
      }
    }
  });

  // ===== CENTRAL ALTAR/PEDESTAL =====
  // Base
  g.add(makeBox(1.5, 0.15, 1.5, 0x2A1A38, 0, 0.075, 0, { roughness: 0.6 }));
  // Column
  g.add(makeBox(0.8, 0.8, 0.8, 0x3A2A48, 0, 0.55, 0));
  // Top platform
  g.add(makeBox(1.0, 0.06, 1.0, 0x4A3A58, 0, 0.98, 0));

  // ===== CODEX on altar (examine) =====
  const codex = makeBox(0.4, 0.06, 0.3, 0x8B6914, 0, 1.04, 0, {
    name: 'codex',
    emissive: 0x442200,
    emissiveIntensity: 0.25,
  });
  codex.userData = {
    type: 'examine',
    prompt: '[E] 코덱스 읽기',
    dialog: {
      title: '바벨의 코덱스',
      content:
        '고대 양피지에 적힌 암호 체계:\n\n' +
        '"모든 단어에는 뼈대가 있고,\n' +
        ' 그 안에 숨결이 있다."\n\n' +
        '예시 - 뼈대(자음)와 숨결(모음)의 분리:\n\n' +
        '  FISH = F · IS · H\n' +
        '  LIST = L · IS · T\n' +
        '  BARB = B · AR · B\n' +
        '  WARM = W · AR · M\n\n' +
        '패턴: 첫자음 · 가운데모음 · 끝자음\n' +
        '같은 "숨결"을 공유하는 단어들이 있다.\n\n' +
        '"만약 FISH, LIST → IS 계열이라면\n' +
        ' FRVL = F · ?? · L 에서\n' +
        ' 숨결을 찾아 단어를 완성하라"',
    },
  };
  g.add(codex);
  interactables.push({ mesh: codex, room: 2 });

  // Codex glow
  const codexGlow = new THREE.PointLight(0xFFCC44, 0.5, 3);
  codexGlow.position.set(0, 1.5, 0);
  g.add(codexGlow);

  // ===== PROFESSOR'S LAST MEMO (examine) =====
  const lastMemo = makeBox(0.2, 0.005, 0.15, 0xFFF8DC, -0.3, 1.02, 0.2, {
    name: 'last_memo',
    emissive: 0x332200,
    emissiveIntensity: 0.2,
  });
  lastMemo.userData = {
    type: 'examine',
    prompt: '[E] 교수의 마지막 메모',
    dialog: {
      title: '교수의 마지막 메모',
      content:
        '떨리는 필체로 적혀 있다:\n\n' +
        '"내가 만든 마지막 퍼즐...\n' +
        ' 이것을 풀면 기억이 돌아올 것이다."\n\n' +
        'FRVL이란 단어가 주어졌다.\n' +
        '하지만 이것은 불완전한 뼈대일 뿐.\n\n' +
        'IF FISH = F(IS)H → 가운데는 IS\n' +
        'IF HEAT = H(EA)T → 가운데는 EA\n\n' +
        '그렇다면 FRVL에서...\n' +
        'FR_VL → FR(EA)VL? 아니다.\n' +
        'F_R_V_L → 이것은 두 단어의 뼈대:\n' +
        'FR = 첫 단어의 뼈대\n' +
        'VL = 끝 단어의 뼈대\n\n' +
        '"HEAT... 그것이 답이었다."',
    },
  };
  g.add(lastMemo);
  interactables.push({ mesh: lastMemo, room: 2 });

  // ===== ANCIENT STONE TABLET (examine — atmosphere) =====
  const tablet = makeBox(0.8, 1.0, 0.12, 0x555566, w / 2 - 0.15, 0.8, -1, {
    name: 'stone_tablet',
    roughness: 0.95,
    metalness: 0.0,
  });
  tablet.userData = {
    type: 'examine',
    prompt: '[E] 고대 언어 석판 조사',
    dialog: {
      title: '고대 언어 석판',
      content:
        '석판에 고대 문자가 새겨져 있다.\n\n' +
        '대부분 해독 불가능하지만,\n' +
        '교수의 주석이 옆에 적혀 있다:\n\n' +
        '"바벨탑의 전설... 인류는 한때\n' +
        ' 하나의 언어를 공유했다.\n' +
        ' 신이 언어를 흩뜨린 것이 아니라,\n' +
        ' 인간이 스스로 잊기로 한 것이다."\n\n' +
        '"보편 문법은 잊혀진 것이지,\n' +
        ' 사라진 것이 아니다.\n' +
        ' 모든 언어의 깊은 곳에\n' +
        ' 같은 구조가 숨 쉬고 있다."',
    },
  };
  g.add(tablet);
  interactables.push({ mesh: tablet, room: 2 });

  // ===== MIRROR / PORTAL FRAME (examine) =====
  // Frame
  g.add(makeBox(1.4, 2.0, 0.08, 0x8B6914, -w / 2 + 0.1, 1.3, 0));
  const mirror = makeBox(1.2, 1.8, 0.05, 0x88AACC, -w / 2 + 0.12, 1.3, 0, {
    name: 'mirror',
    roughness: 0.05,
    metalness: 0.95,
    emissive: 0x112233,
    emissiveIntensity: 0.15,
  });
  mirror.userData = {
    type: 'examine',
    prompt: '[E] 거울 보기',
    dialog: {
      title: '거울 — 혹은 포탈',
      content:
        '거울에 비친 모습을 본다.\n\n' +
        '연구복을 입은 사람. 눈가에 깊은 주름.\n' +
        '가슴에 이름표: "언어학부 교수"\n\n' +
        '...나는 갇힌 것이 아니었다.\n' +
        '내가 스스로 이곳에 들어왔다.\n\n' +
        '보편 문법의 비밀에 너무 가까이 갔고,\n' +
        '그 무게를 감당할 수 없어\n' +
        '기억을 봉인한 것이다.\n\n' +
        '거울 표면이 미세하게 흔들린다.\n' +
        '포탈인가, 환상인가...',
    },
  };
  g.add(mirror);
  interactables.push({ mesh: mirror, room: 2 });

  // Mirror glow
  const mirrorGlow = new THREE.PointLight(0x6688AA, 0.3, 3);
  mirrorGlow.position.set(-w / 2 + 0.8, 1.3, 0);
  g.add(mirrorGlow);

  // ===== ARCHED WINDOWS (decorative) =====
  const windowPositions = [
    { x: w / 2 - 0.08, z: -2 },
    { x: w / 2 - 0.08, z: 2 },
    { x: 0, z: -d / 2 + 0.08 },
  ];
  windowPositions.forEach((wp) => {
    // Window frame
    const isBackWall = wp.z === -d / 2 + 0.08;
    const wx = isBackWall ? wp.x : wp.x;
    const wz = wp.z;

    if (isBackWall) {
      g.add(makeBox(0.8, 2.5, 0.02, 0x333344, wx, 2.5, wz));
      // Window glass (dim moonlight)
      g.add(makeBox(0.6, 2.0, 0.01, 0x223355, wx, 2.5, wz + 0.01, {
        emissive: 0x223355,
        emissiveIntensity: 0.4,
      }));
    } else {
      g.add(makeBox(0.02, 2.5, 0.8, 0x333344, wx, 2.5, wz));
      g.add(makeBox(0.01, 2.0, 0.6, 0x223355, wx - 0.01, 2.5, wz, {
        emissive: 0x223355,
        emissiveIntensity: 0.4,
      }));
    }
  });

  // ===== EXIT KEYPAD (puzzle) =====
  const exitKeypad = makeBox(1.0, 2.4, 0.1, 0x2A1A38, 0, 1.2, d / 2 - 0.05, {
    name: 'tower_exit',
    emissive: 0x220044,
    emissiveIntensity: 0.15,
  });
  exitKeypad.userData = {
    type: 'puzzle',
    puzzleId: 'tower_exit',
    prompt: '[E] 탈출구 — 비밀번호 입력',
    lockedMsg: '최종 출구. 4자리 영문 코드가 필요하다.',
    unlockedMsg: '문이 열린다...',
  };
  g.add(exitKeypad);
  interactables.push({ mesh: exitKeypad, room: 2 });

  // Exit glow
  const exitGlow = new THREE.PointLight(0xFFCC44, 0.3, 3);
  exitGlow.position.set(0, 2.5, d / 2 - 0.5);
  g.add(exitGlow);

  // Exit frame
  g.add(makeBox(0.08, 2.5, 0.15, 0x3A2A48, -0.55, 1.25, d / 2 - 0.05));
  g.add(makeBox(0.08, 2.5, 0.15, 0x3A2A48, 0.55, 1.25, d / 2 - 0.05));
  g.add(makeBox(1.2, 0.08, 0.15, 0x3A2A48, 0, 2.5, d / 2 - 0.05));

  // ===== DOOR back to Room 2 =====
  const doorBack = makeBox(0.8, 2.1, 0.1, 0x334455, -3, 1.05, -d / 2 + 0.05, { name: 'door_back2' });
  doorBack.userData = {
    type: 'door',
    targetRoom: 1,
    prompt: '[E] 번역실로 돌아가기',
    requires: null,
    spawnLocal: { x: 0, z: -3.5 },
    faceY: Math.PI,
  };
  g.add(doorBack);
  interactables.push({ mesh: doorBack, room: 2 });

  // ===== SCATTERED PAPERS on floor =====
  for (let i = 0; i < 8; i++) {
    const paper = makeBox(
      0.2, 0.003, 0.28, 0xDDDDCC,
      -2 + Math.random() * 4, 0.05, -1 + Math.random() * 3,
    );
    paper.rotation.y = Math.random() * Math.PI;
    g.add(paper);
  }

  // ===== Candles on altar =====
  const candlePositions = [
    [-0.35, 0, -0.3],
    [0.35, 0, -0.3],
    [-0.35, 0, 0.3],
    [0.35, 0, 0.3],
  ];
  candlePositions.forEach(([cx, _cy, cz]) => {
    // Candle body
    const candle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.025, 0.15, 8),
      new THREE.MeshStandardMaterial({ color: 0xFFF8DC, roughness: 0.8 }),
    );
    candle.position.set(cx, 1.08, cz);
    g.add(candle);

    // Flame (small light)
    const flame = new THREE.PointLight(0xFF8800, 0.2, 1.5);
    flame.position.set(cx, 1.2, cz);
    g.add(flame);
  });
}
