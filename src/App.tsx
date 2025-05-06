import "./App.css";
import tinycolor from "tinycolor2";
import { useCallback, useEffect, useState } from "react";
import { Examples } from "./components/Examples";
import { getContrastForeground } from "./lib/colorUtils";
import SyntaxHighlighter from "react-syntax-highlighter";
import { ColorPickerPopover } from "./components/ColorPickerPopover";
import { Sidebar, SidebarContent } from "./components/ui/sidebar";
import { Button } from "./components/ui/button";
import { Toggle } from "./components/ui/toggle";
import { MoonIcon, SunIcon } from "lucide-react";

interface Colors {
  primaryColor: tinycolor.Instance;
  secondaryColor?: tinycolor.Instance;
  backgroundColor?: tinycolor.Instance;
}

const setBrightness = (color: tinycolor.Instance, brightness: number) => {
  const hsl = color.toHsl();
  const newColor = tinycolor.fromRatio({
    h: hsl.h,
    s: hsl.s,
    l: brightness,
    a: hsl.a,
  });
  return newColor;
};

function App() {
  const [primary, setPrimary] = useState<tinycolor.Instance>(
    tinycolor("#000000")
  );
  const [secondary, setSecondary] = useState<tinycolor.Instance | undefined>(
    undefined
  );
  const [background, setBackground] = useState<tinycolor.Instance | undefined>(
    undefined
  );
  const [isDark, setIsDark] = useState(false);

  const generateColors = useCallback(
    ({
      primaryColor,
      secondaryColor: secondaryBase,
      backgroundColor,
    }: Colors) => {
      // ベースカラーから一貫したテーマを生成するため
      const base = primaryColor.clone();

      // CSS変数名と色変換ロジックのマッピング
      type ThemeMap = Record<string, string>;
      const backgroundColorString = backgroundColor
        ? backgroundColor.toHexString()
        : setBrightness(base, 95).toHexString();
      const foregroundColor = getContrastForeground(backgroundColorString);
      const primaryString = primaryColor.toHexString();
      const primaryForegroundString = getContrastForeground(primaryString);
      const secondaryColor = secondaryBase
        ? secondaryBase
        : primaryColor.clone().spin(180);
      const secondaryString = secondaryColor.toHexString();
      const secondaryForegroundString = getContrastForeground(secondaryString);
      const cardColorString = primaryColor
        .clone()
        .lighten(isDark ? 5 : -5)
        .toHexString();
      const cardForegroundString = getContrastForeground(cardColorString);
      const mutedColor = primaryColor.clone().setAlpha(0.5);
      const mutedString = mutedColor.toHex8String();
      const accentColor = primaryColor.clone().saturate(40).lighten(30);
      const accentString = accentColor.toHexString();
      const accentForegroundString = getContrastForeground(accentString);
      const themeMap: ThemeMap = {
        "--radius": "0.5rem",
        "--background": backgroundColorString,
        "--background-foreground": foregroundColor,
        "--foreground": foregroundColor,
        "--card": cardColorString,
        "--card-foreground": cardForegroundString,
        "--popover": primaryString,
        "--popover-foreground": primaryForegroundString,
        "--primary": primaryString,
        "--primary-foreground": primaryForegroundString,
        "--secondary": secondaryString,
        "--secondary-foreground": secondaryForegroundString,
        "--muted": mutedString,
        "--muted-foreground": primaryForegroundString,
        "--accent": accentString,
        "--accent-foreground": accentForegroundString,
        "--destructive": primaryColor
          .clone()
          .complement()
          .darken(20)
          .toHexString(),
        "--destructive-foreground": primaryColor
          .clone()
          .complement()
          .lighten(60)
          .toHexString(),
        "--border": primaryColor.clone().darken(10).toHexString(),
        "--input": primaryColor.clone().darken(5).toHexString(),
        "--ring": primaryColor.clone().lighten(10).toHexString(),
        "--chart-1": primaryColor.clone().saturate(50).toHexString(),
        "--chart-2": primaryColor.clone().spin(90).toHexString(),
        "--chart-3": primaryColor.clone().spin(180).toHexString(),
        "--chart-4": primaryColor.clone().spin(270).toHexString(),
        "--chart-5": primaryColor
          .clone()
          .saturate(30)
          .lighten(30)
          .toHexString(),
        "--sidebar": primaryColor.clone().lighten(95).toHexString(),
        "--sidebar-foreground": primaryColor.clone().darken(80).toHexString(),
        "--sidebar-primary": primaryColor
          .clone()
          .saturate(20)
          .lighten(20)
          .toHexString(),
        "--sidebar-primary-foreground": primaryColor
          .clone()
          .complement()
          .toHexString(),
        "--sidebar-accent": primaryColor.clone().saturate(40).toHexString(),
        "--sidebar-accent-foreground": primaryColor
          .clone()
          .lighten(95)
          .toHexString(),
        "--sidebar-border": primaryColor.clone().darken(10).toHexString(),
        "--sidebar-ring": primaryColor.clone().lighten(10).toHexString(),
      };

      // 計算結果を格納しておくオブジェクト
      const results: Record<string, string> = {};

      // 各変数に対してCSS反映と結果収集を実行
      Object.entries(themeMap).forEach(([name, prop]) => {
        // 実行時にテーマを即時反映させるため
        document.documentElement.style.setProperty(name, prop);
        results[name] = prop;
      });

      // 計算結果を可視化し、デザイン確認を容易にするため
      const colorStrings = Object.entries(results)
        .map(([name, hex]) => `  ${name}: ${hex}`)
        .join(";\n");
      return colorStrings;
    },
    [isDark]
  );

  const [colorStrings, setColorStrings] = useState<string>(
    generateColors({
      primaryColor: primary,
      secondaryColor: secondary,
      backgroundColor: background,
    })
  );

  useEffect(() => {
    const colorStrings = generateColors({
      primaryColor: primary,
      secondaryColor: secondary,
      backgroundColor: background,
    });
    setColorStrings(colorStrings);
  }, [primary, secondary, background, generateColors]);

  return (
    <div className="h-screen min-h-screen w-screen flex flex-row items-center justify-center gap-4 p-6">
      <Sidebar>
        <SidebarContent className="p-4">
          <Toggle
            variant="outline"
            onPressedChange={(value) => setIsDark(value)}
          >
            {isDark ? <MoonIcon /> : <SunIcon />} {isDark ? "Dark" : "Light"}
          </Toggle>
          <div className="flex flex-col gap-1">
            <p>Primary Color</p>
            <ColorPickerPopover
              value={primary}
              onChange={(colorValue) => {
                const newColor = tinycolor(colorValue.hex);
                setPrimary(newColor);
                const colorStrings = generateColors({
                  primaryColor: newColor,
                  secondaryColor: secondary,
                  backgroundColor: background,
                });
                setColorStrings(colorStrings);
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p>Secondary Color</p>
            <ColorPickerPopover
              value={secondary ?? primary.complement()}
              onChange={(colorValue) => {
                const newColor = tinycolor(colorValue.hex);
                setSecondary(newColor);
                const colorStrings = generateColors({
                  primaryColor: primary,
                  secondaryColor: newColor,
                  backgroundColor: background,
                });
                setColorStrings(colorStrings);
              }}
            />
            <Button onClick={() => setSecondary(primary.complement())}>
              Generate Primary's complement
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            <p>Background Color</p>
            <ColorPickerPopover
              value={background ?? setBrightness(primary, 95)}
              onChange={(colorValue) => {
                const newColor = tinycolor(colorValue.hex);
                setBackground(newColor);
                const colorStrings = generateColors({
                  primaryColor: primary,
                  secondaryColor: secondary,
                  backgroundColor: newColor,
                });
                setColorStrings(colorStrings);
              }}
            />
            <Button
              onClick={() =>
                setBackground(setBrightness(primary, isDark ? 10 : 90))
              }
            >
              {`Generate Primary's ${isDark ? "darkened" : "lightened"}`}
            </Button>
          </div>
          <SyntaxHighlighter language="css" className="text-xs">
            {`root: {\n${colorStrings}\n}`}
          </SyntaxHighlighter>
        </SidebarContent>
      </Sidebar>
      <div className="flex flex-row grow-1 gap-2">
        <Examples />
      </div>
    </div>
  );
}

export default App;
