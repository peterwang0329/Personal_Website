import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";

// 定義遊戲狀態的介面
interface GameState {
  score: number; // 分數
  lives: number; // 生命值
  status: "idle" | "playing" | "gameover" | "victory"; // 遊戲狀態：閒置、進行中、失敗、勝利
}

export function BrickBreaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null); // 引用 Canvas 元素
  const [gameState, setGameState] = useState<GameState>({ score: 0, lives: 3, status: "idle" }); // 初始化遊戲狀態
  const animationRef = useRef<number>(0); // 用於記錄 requestAnimationFrame 的 ID，以便取消動畫

  useEffect(() => {
    // 只有在狀態為 "playing" 時才啟動遊戲邏輯
    if (gameState.status !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- 遊戲變數設定 ---
    let x = canvas.width / 2;     // 球的初始 X 座標（畫布中心）
    let y = canvas.height - 30;   // 球的初始 Y 座標
    let dx = 2;                   // 水平移動速度（正值向右，負值向左，數字愈大愈快）
    let dy = -2;                  // 垂直移動速度（負值向上，正值向下，數字愈大愈快）
    const ballRadius = 8;         // 球的半徑大小

    const paddleHeight = 10;      // 板子的高度
    const paddleWidth = 120;      // 板子的寬度
    let paddleX = (canvas.width - paddleWidth) / 2; // 板子的初始 X 座標
    let rightPressed = false;     // 右方向鍵是否被按下
    let leftPressed = false;      // 左方向鍵是否被按下

    const brickRowCount = 5;      // 磚塊列數
    const brickColumnCount = 8;   // 磚塊欄數
    const brickWidth = 75;        // 磚塊寬度
    const brickHeight = 20;       // 磚塊高度
    const brickPadding = 10;      // 磚塊間距
    const brickOffsetTop = 30;    // 磚塊與頂部的距離
    const brickOffsetLeft = 30;   // 磚塊與左側的距離

    let score = gameState.score;  // 內部計分變數
    let lives = gameState.lives;  // 內部生命值變數
    let status: GameState["status"] = gameState.status; // 內部狀態變數

    // 初始化磚塊陣列
    const bricks: { x: number, y: number, status: number }[][] = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }; // status: 1 表示磚塊存在，0 表示已被消滅
      }
    }

    // 處理按鍵按下事件
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    };
    // 處理按鍵放開事件
    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
    };

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    // 碰撞偵測邏輯（球與磚塊）
    const collisionDetection = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            // 判斷球是否進入磚塊的範圍
            if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
              dy = -dy; // 反彈
              b.status = 0; // 消滅磚塊
              score++; // 增加分數
              setGameState(prev => ({ ...prev, score }));

              // 檢查是否消滅所有磚塊
              if (score === brickRowCount * brickColumnCount) {
                status = "victory";
                setGameState(prev => ({ ...prev, status }));
              }
            }
          }
        }
      }
    };

    // 繪製球
    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#18d6ff"; // 球的顏色
      ctx.fill();
      ctx.closePath();
    };

    // 繪製板子
    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = "#7c5cff"; // 板子的顏色
      ctx.fill();
      ctx.closePath();
    };

    // 繪製所有磚塊
    const drawBricks = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = r % 2 === 0 ? "#7c5cff" : "#18d6ff"; // 交替顏色
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    };

    // 遊戲主迴圈（繪製每一幀）
    const draw = () => {
      if (status !== "playing") return;

      ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除上一幀的畫面
      drawBricks(); // 繪製磚塊
      drawBall(); // 繪製球
      drawPaddle(); // 繪製板子
      collisionDetection(); // 進行碰撞偵測

      // 牆壁碰撞偵測（左右側）
      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
      // 牆壁碰撞偵測（頂部）
      if (y + dy < ballRadius) {
        dy = -dy;
      }
      // 底部碰撞偵測
      else if (y + dy > canvas.height - ballRadius) {
        // 判斷是否接到球（球在板子的 X 軸範圍內）
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
          // 根據按鍵方向給球增加一點水平偏移（英文稱為 english，意指旋球效果）
          dx = dx + (rightPressed ? 1 : leftPressed ? -1 : 0);
        } else {
          lives--; // 漏球扣除生命值
          setGameState(prev => ({ ...prev, lives }));
          if (!lives) {
            status = "gameover"; // 生命值為 0，遊戲結束
            setGameState(prev => ({ ...prev, status }));
          } else {
            // 重置球與板子的位置
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = 3;
            dy = -3;
            paddleX = (canvas.width - paddleWidth) / 2;
          }
        }
      }

      // 根據按鍵移動板子
      if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
      } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
      }

      // 更新球的位置
      x += dx;
      y += dy;
      animationRef.current = requestAnimationFrame(draw); // 請求下一幀動畫
    };

    draw(); // 啟動主迴圈

    // 清除副作用（取消事件監聽與動畫）
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameState.status]); // 當遊戲狀態改變時重新運行 useEffect

  // 開始遊戲的函式
  const startGame = () => {
    setGameState({ score: 0, lives: 3, status: "playing" });
  };

  return (
    <section id="game" className="section">
      <div className="container">
        <div className="sectionHead reveal is-visible">
          <h2 className="sectionTitle">打磚塊小遊戲</h2>
          <p className="sectionLead">放鬆一下！使用左右方向鍵控制球拍，消除所有磚塊。</p>
        </div>

        <div className="card reveal is-visible" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>

          {/* 分數與生命值顯示 */}
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "720px" }}>
            <div className="badge"><span className="dot" style={{ background: "var(--warning)" }}></span>生命: {gameState.lives}</div>
            <div className="badge"><span className="dot" style={{ background: "var(--primary2)" }}></span>分數: {gameState.score}</div>
          </div>

          {/* 遊戲畫布區域 */}
          <div style={{ position: "relative", width: "100%", maxWidth: "720px", background: "var(--bg)", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--line)" }}>
            <canvas
              ref={canvasRef}
              width={720}
              height={400}
              style={{ display: "block", width: "100%", height: "auto" }}
            />

            {/* 遊戲結束、勝利或初始介面的遮罩層 */}
            {gameState.status !== "playing" && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
                <h3 style={{ fontSize: "28px", color: "white", marginBottom: "16px" }}>
                  {gameState.status === "gameover" ? "Game Over" : gameState.status === "victory" ? "You Win!" : "Ready?"}
                </h3>
                <button className="btn btn--primary" onClick={startGame}>
                  {gameState.status === "idle" ? <Play size={18} style={{ marginRight: "8px" }} /> : <RotateCcw size={18} style={{ marginRight: "8px" }} />}
                  {gameState.status === "idle" ? "開始遊戲" : "再玩一次"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
