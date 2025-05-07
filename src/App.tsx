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

const setBrightness = (color: tinycolor.Instance, brightness: number) => {
  const hsl = color.clone().toHsl();
  const newColor = tinycolor.fromRatio({
    h: hsl.h,
    s: hsl.s,
    l: brightness,
    a: hsl.a,
  });
  return newColor;
};

interface ColorTheme {
  primaryColor: tinycolor.Instance;
  secondaryColor: tinycolor.Instance;
  backgroundColor: tinycolor.Instance;
  isDark: boolean;
}

function App() {
  const [colorTheme, setColorTheme] = useState<ColorTheme>({
    primaryColor: tinycolor("#2020AA"),
    secondaryColor: tinycolor("#2020AA").complement(),
    backgroundColor: tinycolor("#FFFFFF"),
    isDark: false,
  });

  const generateColors = useCallback(
    ({ primaryColor, secondaryColor, backgroundColor, isDark }: ColorTheme) => {
      // CSS変数名と色変換ロジックのマッピング
      type ThemeMap = Record<string, string>;
      const backgroundColorString = backgroundColor.toHexString();
      const foregroundColor = getContrastForeground(backgroundColorString);
      const primaryString = primaryColor.toHexString();
      const primaryForegroundString = getContrastForeground(primaryString);
      const secondaryString = secondaryColor.toHexString();
      const secondaryForegroundString = getContrastForeground(secondaryString);
      const cardColorString = backgroundColor
        .clone()
        .lighten(isDark ? 5 : -5)
        .toHexString();
      const cardForegroundString = getContrastForeground(cardColorString);
      const mutedColor = primaryColor.clone().saturate(-30);
      const mutedForegroundString = getContrastForeground(
        backgroundColorString,
        ["#AAA", "#666"]
      );
      const mutedString = mutedColor.toHexString();
      const accentColor = primaryColor.clone().saturate(40).lighten(30);
      const accentString = accentColor.toHexString();
      const accentForegroundString = getContrastForeground(accentString);
      const sidebarColor = setBrightness(
        backgroundColor.clone(),
        isDark ? 5 : 95
      );
      const sidebarString = sidebarColor.toHexString();
      const sidebarForegroundString = getContrastForeground(
        sidebarColor.toHexString()
      );
      const sidebarPrimaryColor = primaryColor.clone().saturate(20).lighten(10);
      const sidebarPrimaryString = sidebarPrimaryColor.toHexString();
      const sidebarPrimaryForegroundString =
        getContrastForeground(sidebarPrimaryString);
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
        "--muted-foreground": mutedForegroundString,
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
        "--chart-1": primaryColor
          .clone()
          .spin((360 * 1) / 5)
          .toHexString(),
        "--chart-2": primaryColor
          .clone()
          .spin((360 * 2) / 5)
          .toHexString(),
        "--chart-3": primaryColor
          .clone()
          .spin((360 * 3) / 5)
          .toHexString(),
        "--chart-4": primaryColor
          .clone()
          .spin((360 * 4) / 5)
          .toHexString(),
        "--chart-5": primaryColor
          .clone()
          .saturate(30)
          .lighten(30)
          .toHexString(),
        "--sidebar": sidebarString,
        "--sidebar-foreground": sidebarForegroundString,
        "--sidebar-primary": sidebarPrimaryString,
        "--sidebar-primary-foreground": sidebarPrimaryForegroundString,
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
    []
  );

  const colorStrings = generateColors(colorTheme);

  return (
    <div className="h-screen min-h-screen w-screen flex flex-row items-center justify-center gap-4 p-6">
      <Sidebar>
        <SidebarContent className="p-4">
          <Toggle
            variant="outline"
            onPressedChange={(value) => {
              setColorTheme((cur) => ({
                ...cur,
                backgroundColor: setBrightness(
                  cur.primaryColor.clone(),
                  value ? 10 : 90
                ),
                isDark: value,
              }));
            }}
          >
            {colorTheme.isDark ? <MoonIcon /> : <SunIcon />} switch to{" "}
            {!colorTheme.isDark ? "Dark" : "Light"}
          </Toggle>
          <div className="flex flex-col gap-1">
            <p>Primary Color</p>
            <ColorPickerPopover
              value={colorTheme.primaryColor}
              onChange={(newColor) => {
                setColorTheme((prev) => ({
                  ...prev,
                  primaryColor: newColor,
                }));
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p>Secondary Color</p>
            <ColorPickerPopover
              value={colorTheme.secondaryColor}
              onChange={(newColor) => {
                setColorTheme((prev) => ({
                  ...prev,
                  secondaryColor: newColor,
                }));
              }}
            />
            <Button
              onClick={() =>
                setColorTheme((prev) => ({
                  ...prev,
                  secondaryColor: prev.primaryColor.clone().complement(),
                }))
              }
            >
              Generate Primary's complement
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            <p>Background Color</p>
            <ColorPickerPopover
              value={colorTheme.backgroundColor}
              onChange={(newColor) => {
                setColorTheme((prev) => ({
                  ...prev,
                  backgroundColor: newColor,
                }));
              }}
            />
            <Button
              onClick={() =>
                setColorTheme((prev) => ({
                  ...prev,
                  backgroundColor: setBrightness(
                    prev.primaryColor.clone(),
                    prev.isDark ? 10 : 95
                  ),
                }))
              }
            >
              {`Generate Primary's ${
                colorTheme.isDark ? "darkened" : "lightened"
              }`}
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
