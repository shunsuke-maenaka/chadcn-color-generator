import { type ComponentProps, type FC } from "react";
import { SketchPicker } from "react-color";
import tinycolor from "tinycolor2";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

export const ColorPickerPopover: FC<
  Pick<ComponentProps<typeof SketchPicker>, "onChange"> & {
    value: tinycolor.Instance;
  }
> = ({ value, onChange }) => {
  return (
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
          onChange={onChange}
        ></SketchPicker>
      </PopoverContent>
    </Popover>
  );
};
