import * as THREE from 'three';
import { ROOM_CONFIGS } from '../RoomConfigs';
import type { InteractableEntry } from '../../types/game';
import { makeBox, makeRoom } from './GeometryHelpers';

export function buildRoom1(
  scene: THREE.Scene,
  rooms: THREE.Group[],
  interactables: InteractableEntry[],
): number {
  const cfg = ROOM_CONFIGS[0];
  const g = makeRoom(cfg, 0, scene, rooms);
  const [w, h, d] = cfg.size;

  // Warm flickering fireplace light
  const flicker = new THREE.PointLight(0xFF9933, 0.6, 6);
  flicker.position.set(-w / 2 + 0.5, 1.0, -d / 2 + 0.8);
  g.add(flicker);
  const flickerInterval = window.setInterval(() => {
    flicker.intensity = 0.4 + Math.random() * 0.4;
  }, 120);

  // Secondary warm light
  const warmLight = new THREE.PointLight(0xFFDDAA, 0.4, 5);
  warmLight.position.set(1, h - 0.5, 1);
  g.add(warmLight);

  // ===== FIREPLACE (left wall, back corner) =====
  // Fireplace body
  g.add(makeBox(1.2, 1.2, 0.5, 0x6B4226, -w / 2 + 0.4, 0.6, -d / 2 + 0.5, { roughness: 0.9 }));
  // Fireplace opening
  g.add(makeBox(0.7, 0.7, 0.3, 0x1a0a00, -w / 2 + 0.4, 0.4, -d / 2 + 0.35, {
    emissive: 0xFF3300,
    emissiveIntensity: 0.3,
  }));
  // Fireplace mantle
  g.add(makeBox(1.4, 0.08, 0.6, 0x5B3216, -w / 2 + 0.4, 1.25, -d / 2 + 0.5));
  // Chimney
  g.add(makeBox(0.6, 1.5, 0.4, 0x6B4226, -w / 2 + 0.4, 2.5, -d / 2 + 0.45));

  // ===== LARGE BOOKSHELF (back wall) =====
  const shelfX = 1.2;
  // Main bookshelf frame
  g.add(makeBox(2.5, 2.8, 0.4, 0x5B3216, shelfX, 1.4, -d / 2 + 0.25, { roughness: 0.85 }));
  // Shelves
  for (let sy = 0; sy < 5; sy++) {
    g.add(makeBox(2.3, 0.04, 0.35, 0x6B4226, shelfX, 0.3 + sy * 0.55, -d / 2 + 0.25));
    // Books on each shelf
    for (let bx = -4; bx <= 4; bx++) {
      const bookH = 0.25 + Math.random() * 0.2;
      const bookColor = [0x8B0000, 0x006400, 0x00008B, 0x8B4513, 0x4B0082, 0xDAA520][Math.floor(Math.random() * 6)];
      g.add(makeBox(0.12, bookH, 0.2, bookColor,
        shelfX + bx * 0.14, 0.3 + sy * 0.55 + bookH / 2 + 0.02, -d / 2 + 0.2));
    }
  }

  // Bookshelf lock (interactable — puzzle)
  const bookshelfLock = makeBox(0.35, 0.25, 0.15, 0x8B6914, shelfX, 1.2, -d / 2 + 0.5, {
    name: 'bookshelf_lock',
    emissive: 0x332200,
    emissiveIntensity: 0.2,
  });
  bookshelfLock.userData = {
    type: 'puzzle',
    puzzleId: 'bookshelf_lock',
    prompt: '[E] 책장 잠금장치',
    lockedMsg: '잠겨있다. 4자리 영문 코드가 필요하다.',
    unlockedMsg: '책장이 열렸다!',
  };
  g.add(bookshelfLock);
  interactables.push({ mesh: bookshelfLock, room: 0 });

  // ===== DESK + CHAIR (right side) =====
  // Desk
  const deskX = w / 2 - 1.2;
  const deskZ = 1;
  g.add(makeBox(1.4, 0.06, 0.7, 0x7A5C3A, deskX, 0.75, deskZ)); // top
  g.add(makeBox(0.06, 0.75, 0.65, 0x6A4C2A, deskX - 0.65, 0.375, deskZ)); // left leg
  g.add(makeBox(0.06, 0.75, 0.65, 0x6A4C2A, deskX + 0.65, 0.375, deskZ)); // right leg
  g.add(makeBox(1.28, 0.5, 0.04, 0x6A4C2A, deskX, 0.5, deskZ - 0.32)); // back panel

  // Chair
  g.add(makeBox(0.45, 0.04, 0.45, 0x6A4C2A, deskX, 0.45, deskZ + 0.8));
  g.add(makeBox(0.04, 0.45, 0.04, 0x5A3C1A, deskX - 0.2, 0.225, deskZ + 1));
  g.add(makeBox(0.04, 0.45, 0.04, 0x5A3C1A, deskX + 0.2, 0.225, deskZ + 1));
  g.add(makeBox(0.04, 0.45, 0.04, 0x5A3C1A, deskX - 0.2, 0.225, deskZ + 0.6));
  g.add(makeBox(0.04, 0.45, 0.04, 0x5A3C1A, deskX + 0.2, 0.225, deskZ + 0.6));
  g.add(makeBox(0.45, 0.6, 0.04, 0x6A4C2A, deskX, 0.75, deskZ + 1));

  // ===== OPEN BOOK on desk (examine) =====
  const openBook = makeBox(0.3, 0.02, 0.2, 0xFFF8DC, deskX - 0.2, 0.79, deskZ, {
    name: 'open_book',
    emissive: 0x332200,
    emissiveIntensity: 0.15,
  });
  openBook.userData = {
    type: 'examine',
    prompt: '[E] 펼쳐진 책 읽기',
    dialog: {
      title: '교수의 연구 노트',
      content:
        '모음 변환 이론 — 제3장\n\n' +
        '"알파벳에서 가장 기본적인 변환은 모음의 교체이다.\n' +
        'I → E 변환은 가장 단순하면서도 강력한 규칙으로,\n' +
        '단어의 의미를 완전히 바꿀 수 있다.\n\n' +
        '예시:\n' +
        '  PIN → PEN (핀 → 펜)\n' +
        '  SIT → SET (앉다 → 놓다)\n' +
        '  BIT → BET (조금 → 걸다)\n\n' +
        '이 변환을 다른 단어에도 적용해 보라.\n' +
        '패턴은 항상 같다: I가 E로."',
    },
  };
  g.add(openBook);
  interactables.push({ mesh: openBook, room: 0 });

  // ===== WORD CONVERSION TABLE on wall (examine) =====
  const wallChart = makeBox(0.8, 0.5, 0.02, 0xEEDDCC, w / 2 - 0.08, 1.5, -0.5, {
    name: 'wall_chart',
    emissive: 0x221100,
    emissiveIntensity: 0.15,
  });
  wallChart.userData = {
    type: 'examine',
    prompt: '[E] 단어 변환 도표 조사',
    dialog: {
      title: '단어 변환 도표',
      content:
        '벽에 걸린 교수의 연구 도표:\n\n' +
        '┌─────────────────────┐\n' +
        '│  모음 변환 규칙 I → E  │\n' +
        '├─────────────────────┤\n' +
        '│  PIN  →  PEN  ✓     │\n' +
        '│  HILL →  ???        │\n' +
        '│  SIX  →  ???        │\n' +
        '└─────────────────────┘\n\n' +
        '도표 아래에 연필로 적힌 메모:\n' +
        '"책장의 열쇠는 두 번째 변환에 있다"',
    },
  };
  g.add(wallChart);
  interactables.push({ mesh: wallChart, room: 0 });

  // Spotlight on wall chart
  const chartLight = new THREE.SpotLight(0xFFDDAA, 0.5, 4, Math.PI / 6, 0.5);
  chartLight.position.set(w / 2 - 1.5, 2.5, -0.5);
  chartLight.target.position.set(w / 2, 1.5, -0.5);
  g.add(chartLight);
  g.add(chartLight.target);

  // ===== FRAMED PUZZLE on wall — Quiz 2 (examine, environmental storytelling) =====
  const framePuzzle = makeBox(0.6, 0.5, 0.03, 0xDAA520, -w / 2 + 0.08, 1.6, 1.5, {
    name: 'frame_puzzle',
    emissive: 0x332200,
    emissiveIntensity: 0.1,
  });
  framePuzzle.userData = {
    type: 'examine',
    prompt: '[E] 액자 속 퍼즐 조사',
    dialog: {
      title: '액자 속 도형 퍼즐',
      content:
        '교수의 취미인 듯한 도형 퍼즐이 걸려 있다:\n\n' +
        '△ = UNCLE  (6글자, 삼각형은 3)\n' +
        '□ = TREATS (6글자, 사각형은 4)\n' +
        '⬠ = BEAUTY (6글자, 오각형은 5)\n\n' +
        '규칙: 도형의 변의 수 = 추출할 글자 위치\n' +
        '△(3번째) → C\n' +
        '□(4번째) → A\n' +
        '⬠(5번째) → T\n\n' +
        '답: CAT\n\n' +
        '아래에 교수의 메모:\n' +
        '"이런 패턴이 보편 문법의 열쇠일까?\n' +
        ' 구조 안에 숨겨진 의미..."',
    },
  };
  g.add(framePuzzle);
  interactables.push({ mesh: framePuzzle, room: 0 });

  // ===== LEATHER ARMCHAIR =====
  const armX = -w / 2 + 1.2;
  const armZ = d / 2 - 1.2;
  // Seat
  g.add(makeBox(0.7, 0.35, 0.7, 0x8B4513, armX, 0.25, armZ, { roughness: 0.6 }));
  // Back
  g.add(makeBox(0.7, 0.6, 0.1, 0x8B4513, armX, 0.65, armZ - 0.3));
  // Arms
  g.add(makeBox(0.1, 0.3, 0.6, 0x8B4513, armX - 0.35, 0.45, armZ));
  g.add(makeBox(0.1, 0.3, 0.6, 0x8B4513, armX + 0.35, 0.45, armZ));

  // ===== PERSIAN RUG (floor) =====
  g.add(makeBox(3, 0.01, 2.5, 0x8B2252, 0, 0.06, 0.5, { roughness: 0.95 }));
  g.add(makeBox(2.6, 0.005, 2.1, 0xA0522D, 0, 0.065, 0.5));

  // ===== DOOR to Room 2 =====
  const door = makeBox(0.9, 2.2, 0.1, 0x5B3216, 0, 1.1, d / 2 - 0.05, {
    name: 'door_to_lab',
    emissive: 0x000000,
  });
  door.userData = {
    type: 'door',
    targetRoom: 1,
    prompt: '[E] 번역실로 이동',
    requires: 'babel_key',
    lockedMsg: '잠겨있다. 바벨의 열쇠가 필요한 것 같다.',
    spawnLocal: { x: -2, z: 3.5 },
    faceY: 0,
  };
  g.add(door);
  interactables.push({ mesh: door, room: 0 });

  // Door frame
  g.add(makeBox(0.08, 2.3, 0.15, 0x4A2206, -0.5, 1.15, d / 2 - 0.05));
  g.add(makeBox(0.08, 2.3, 0.15, 0x4A2206, 0.5, 1.15, d / 2 - 0.05));
  g.add(makeBox(1.08, 0.08, 0.15, 0x4A2206, 0, 2.3, d / 2 - 0.05));

  // Key lock visual next to door
  g.add(makeBox(0.1, 0.15, 0.04, 0x8B6914, 0.6, 1.3, d / 2 - 0.05, {
    emissive: 0x664400,
    emissiveIntensity: 0.3,
  }));

  // ===== Ink pen on desk =====
  const pen = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.015, 0.15, 8),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.5 }),
  );
  pen.position.set(deskX + 0.3, 0.80, deskZ - 0.1);
  pen.rotation.z = 0.3;
  g.add(pen);

  // ===== Globe on desk =====
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0x2266AA, roughness: 0.4 }),
  );
  globe.position.set(deskX + 0.5, 0.88, deskZ + 0.2);
  g.add(globe);
  // Globe stand
  g.add(makeBox(0.04, 0.1, 0.04, 0x8B6914, deskX + 0.5, 0.80, deskZ + 0.2));

  return flickerInterval;
}
