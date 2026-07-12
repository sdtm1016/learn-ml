// 中文注释：通用步进控件 + 步进纯函数
// 纯函数抽出来便于测试；组件负责渲染按钮和步数指示。
import { useEffect, useRef, useState } from 'react';

// ---- 纯函数（可单测）----
export function clampStep(step: number, total: number): number {
  const max = Math.max(0, total - 1);
  return Math.min(Math.max(step, 0), max);
}

export function nextStep(step: number, total: number): number {
  return clampStep(step + 1, total);
}

// 中文注释：prevStep 只需下移一位且不低于 0（单参数，与 nextStep 的"total 约束"语义对称）
export function prevStep(step: number): number {
  return Math.max(step - 1, 0);
}

// ---- 组件 ----
interface StepperProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export function Stepper({ current, total, onPrev, onNext, isPlaying, onTogglePlay }: StepperProps) {
  const atStart = current <= 0;
  const atEnd = current >= total - 1;

  return (
    <div className="bt-stepper">
      <button className="bt-step-btn" type="button" onClick={onPrev} disabled={atStart} aria-label="上一步">
        ◀ 上一步
      </button>
      <span className="bt-step-indicator">{current + 1} / {total}</span>
      <button className="bt-step-btn" type="button" onClick={onNext} disabled={atEnd} aria-label="下一步">
        下一步 ▶
      </button>
      <button className="bt-play-btn" type="button" onClick={onTogglePlay} aria-label={isPlaying ? '暂停' : '播放'}>
        {isPlaying ? '⏸ 暂停' : '⏯ 播放'}
      </button>
    </div>
  );
}

// ---- 自动播放 hook ----
// 中文注释：到末步自动停止；返回当前 step、播放状态和控制函数
export function useAutoPlay(total: number, intervalMs = 1500) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) return;
    // 末步停止（guard 在 effect 体内，干净的停止时机）
    if (step >= total - 1) {
      setPlaying(false);
      return;
    }
    // 中文注释：每 tick 重建 interval（step 进依赖）。代价是定时器重建一次，
    // 收益是停止逻辑不依赖"在 setStep 更新器里调用别的 setter"这种反模式。
    timerRef.current = setInterval(() => {
      setStep((prev) => (prev >= total - 1 ? prev : prev + 1));
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, total, intervalMs, step]);

  function goNext() {
    setStep((prev) => nextStep(prev, total));
  }
  function goPrev() {
    setStep((prev) => prevStep(prev));
  }
  function togglePlay() {
    // 点击播放时若已到末步，从头开始
    if (!playing && step >= total - 1) setStep(0);
    setPlaying((p) => !p);
  }

  return { step, playing, goNext, goPrev, togglePlay };
}
