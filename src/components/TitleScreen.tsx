import styles from './TitleScreen.module.css';

interface Props {
  mode: 'title' | 'paused';
  isMobile: boolean;
  onStart: () => void;
  onResume: () => void;
}

export default function TitleScreen({ mode, isMobile, onStart, onResume }: Props) {
  if (mode === 'title') {
    return (
      <div className={styles.blocker}>
        <div className={styles.titleScreen}>
          <h1>바벨의 서재</h1>
          <h2>THE LIBRARY OF BABEL</h2>
          <div className={styles.story}>
            머리가 무겁다. 낡은 서재의 냄새가 난다.<br />
            여기가... 내 서재인가?<br /><br />
            기억이 흐릿하다. 하지만 한 가지는 분명하다.<br />
            <strong className={styles.storyStrong}>이 탑에서 나가야 한다.</strong>
          </div>
          <button className={styles.startBtn} onClick={onStart}>시 작</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.blocker} onClick={onResume}>
      <div className={styles.clickToPlay}>
        <p>클릭하여 시작</p>
        <div className={styles.keys}>
          {isMobile
            ? '조이스틱 이동 | 화면 터치 시점 | E 버튼 상호작용'
            : 'WASD 이동 | 마우스 시점 | 클릭 상호작용 | ESC 일시정지'}
        </div>
      </div>
    </div>
  );
}
