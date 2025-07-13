import { ArrowRight, Layout, Sparkles } from "lucide-react";
import { FC } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RoomTypeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectClassic: () => void;
  onSelectCanvas: () => void;
}

export const RoomTypeSelector: FC<RoomTypeSelectorProps> = ({
  open,
  onOpenChange,
  onSelectClassic,
  onSelectCanvas,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Choose Your Planning Experience
          </DialogTitle>
          <DialogDescription>
            Select the room type that best fits your team&apos;s needs
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 md:grid-cols-2">
          {/* Classic Room Option */}
          <div
            className="relative rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:border-primary/50 dark:hover:border-primary/50 transition-colors cursor-pointer group"
            onClick={onSelectClassic}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelectClassic();
              }
            }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Layout className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  Recommended
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Classic Planning Poker
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our traditional planning poker interface with a focused,
                  distraction-free environment perfect for quick estimation
                  sessions.
                </p>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                    Simple and intuitive interface
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                    Optimized for mobile devices
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                    Fast and lightweight
                  </li>
                </ul>
              </div>

              <Button
                variant="default"
                className="w-full group-hover:bg-primary/90"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectClassic();
                }}
              >
                Start Classic Room
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Canvas Room Option */}
          <div
            className="relative rounded-lg border-2 border-purple-200 dark:border-purple-700 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 p-6 hover:border-purple-300 dark:hover:border-purple-600 transition-colors cursor-pointer group"
            onClick={onSelectCanvas}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelectCanvas();
              }
            }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-purple-600 text-white hover:bg-purple-700 text-xs">
                    New
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs border-amber-500 text-amber-700 dark:text-amber-400"
                  >
                    Experimental
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Canvas Room</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Modern whiteboard-style interface with endless canvas,
                  floating navigation, and advanced collaboration features.
                </p>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-purple-500 rounded-full" />
                    Endless canvas with zoom & pan
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-purple-500 rounded-full" />
                    Floating navigation bar
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-purple-500 rounded-full" />
                    Full-screen mode support
                  </li>
                </ul>
              </div>

              <Button
                variant="outline"
                className="w-full border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-400 dark:hover:border-purple-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCanvas();
                }}
              >
                Try Canvas Room
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-2">
          You can switch between room types anytime by creating a new room
        </p>
      </DialogContent>
    </Dialog>
  );
};
