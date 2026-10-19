import { Easing, interpolate } from 'remotion';

/**
 * 通用時間軸小工具。
 * 所有動畫都用「幀 → 值」的純函式表示，方便在 Studio 拖時間軸時預期結果。
 */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 0 → 1 的進度，帶緩出曲線。frame 落在 [start, start+duration] 之外會被夾住。 */
export const progress = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = Easing.out(Easing.cubic),
): number => {
  if (duration <= 0) return frame >= start ? 1 : 0;
  const t = (frame - start) / duration;
  return easing(clamp01(t));
};

/** 淡入：從 start 起 duration 幀內 0 → 1 */
export const fadeIn = (frame: number, start: number, duration = 16) =>
  progress(frame, start, duration);

/** 淡出：在 end 前 duration 幀內 1 → 0 */
export const fadeOut = (frame: number, end: number, duration = 12) =>
  1 - progress(frame, end - duration, duration);

/** 依序淡入淡出的綜合透明度（用於段落切換） */
export const inOut = (frame: number, start: number, end: number, fade = 12) =>
  Math.min(fadeIn(frame, start, fade), fadeOut(frame, end, fade));

/** 上移 + 淡入，回傳可直接展開到 style 的物件 */
export const rise = (
  frame: number,
  start: number,
  duration = 18,
  distance = 24,
  easing?: (t: number) => number,
) => {
  const p = progress(frame, start, duration, easing);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * distance}px)`,
  } as const;
};

/** 數字區間映射，方便一次寫出「幀 → 任意值」 */
export const between = (
  frame: number,
  [from, to]: [number, number],
  [a, b]: [number, number],
  easing: (t: number) => number = Easing.out(Easing.cubic),
) =>
  interpolate(frame, [from, to], [a, b], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** 線性節奏（適合狀態機式的逐步切換，無緩動） */
export const linear = (t: number) => t;
