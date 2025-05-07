// src/utils/colorUtils.ts
import tinycolor from "tinycolor2";

/**
 * プライマリカラーに対する可読性の高い前景色（#ffffff か #000000）を返す
 *
 * why: WCAG コントラスト比を満たしつつ、最も可読性の高い色を自動選択するため
 */
export function getContrastForeground(
  backgroundHex: string | tinycolor.Instance,
  //　候補色を指定することもできる

  options: string[] = ["#ffffff", "#000000"]
): string {
  // white と black のうち、背景色に対して最も読みやすい色を選ぶ
  return tinycolor
    .mostReadable(backgroundHex, options, {
      // includeFallbackColors を false にすると候補外の色にフォールバックしない
      includeFallbackColors: false,
      // レベル AA, large text 相当
      level: "AA",
      size: "large",
    })
    .toHexString();
}
