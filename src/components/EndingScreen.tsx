import styles from './EndingScreen.module.css';

interface Props {
  visible: boolean;
  elapsed: number;
  hintsUsed: number;
  discoveredClues: number;
}

export default function EndingScreen({ visible, elapsed, hintsUsed, discoveredClues }: Props) {
  if (!visible) return null;

  const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const s = String(elapsed % 60).padStart(2, '0');

  return (
    <div className={styles.ending}>
      <h1>탈 출 성 공</h1>
      <div className={styles.endingText}>
        탑의 문이 열리고, 아침 햇살이 쏟아진다.<br /><br />
        기억이 돌아온다 — 당신은 언어학 교수였다.<br />
        보편 문법의 비밀에 너무 가까이 다가가<br />
        스스로 기억을 봉인했다.<br /><br />
        바벨탑은 무너지지 않았다.<br />
        당신이 올라가기를 멈췄을 뿐.<br /><br />
        <span className={styles.highlight}>
          이제 다시 올라갈 준비가 되었다.
        </span>
      </div>
      <div className={styles.stats}>
        클리어 시간: {m}:{s}<br />
        힌트 사용: {hintsUsed}회<br />
        발견한 단서: {discoveredClues}개
      </div>
      <button className={styles.replayBtn} onClick={() => location.reload()}>다시 플레이</button>
    </div>
  );
}
