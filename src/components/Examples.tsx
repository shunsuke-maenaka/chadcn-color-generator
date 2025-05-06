import type { FC } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";

export const Examples: FC = () => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Button variant="default">Default</Button>
        <Button variant="default" disabled>
          Disabled
        </Button>
        <Button variant="link">Link</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter className="flex gap-2 justify-between">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
        </CardFooter>
      </Card>
    </>
  );
};
