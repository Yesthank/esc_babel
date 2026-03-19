import type { RoomConfig } from '../types/game';

export const ROOM_CONFIGS: RoomConfig[] = [
  { name: '서재', size: [7, 3.5, 7], offset: [0, 0, 0], color: 0x8B7355, ambient: 0x604020, light: 0xFFDDAA },
  { name: '번역실', size: [8, 3.5, 8], offset: [20, 0, 0], color: 0x2A3A5A, ambient: 0x102030, light: 0x88BBFF },
  { name: '탑의 꼭대기', size: [9, 5, 9], offset: [45, 0, 0], color: 0x1A1A28, ambient: 0x080810, light: 0x6644AA },
];

export const PLAYER_HEIGHT = 1.6;
export const MOVE_SPEED = 35;
export const FOG_COLORS = [0x0a0804, 0x050810, 0x020208];
