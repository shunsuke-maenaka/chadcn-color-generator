import { type ComponentProps, type FC } from "react";
import { SketchPicker } from "react-color";
import tinycolor from "tinycolor2";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

export const ColorPickerPopover: FC<{
  value: tinycolor.Instance;
  onChange: (color: tinycolor.Instance) => void;
}> = ({ value, onChange }) => {
  console.log("l", value.toHsl().l);
  return (
    <div className="flex flex-col gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-gray-200 text-black">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: value.toHexString() }}
            />
            <span className="ml-2">{value.toHexString()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-0 w-auto p-0">
          <SketchPicker
            className="text-black"
            color={value.toHexString()}
            onChange={(value) => onChange(tinycolor(value.hex))}
          ></SketchPicker>
        </PopoverContent>
      </Popover>
      <Slider
        max={100}
        min={0}
        value={[value.toHsl().l * 100]}
        step={1}
        onValueChange={(sliderValue) => {
          const newColor = tinycolor({
            h: value.toHsl().h,
            s: value.toHsl().s,
            l: sliderValue[0] / 100,
          });
          onChange(newColor);
        }}
      />
    </div>
  );
};
