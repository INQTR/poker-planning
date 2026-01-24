"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface StarfieldProps {
  starColorLight?: string;
  starColorDark?: string;
  bgColorLight?: string;
  bgColorDark?: string;
  mouseAdjust?: boolean;
  tiltAdjust?: boolean;
  easing?: number;
  clickToWarp?: boolean;
  hyperspace?: boolean;
  warpFactor?: number;
  opacity?: number;
  speed?: number;
  quantity?: number;
  className?: string;
}

// Star array indices for readability
const X = 0;
const Y = 1;
const Z = 2;
const SCREEN_X = 3;
const SCREEN_Y = 4;
const PREV_SCREEN_X = 5;
const PREV_SCREEN_Y = 6;
const VISIBLE = 7;

type Star = [number, number, number, number, number, number, number, boolean];

interface StarfieldData {
  w: number;
  h: number;
  ctx: CanvasRenderingContext2D | null;
  cw: number;
  ch: number;
  x: number;
  y: number;
  z: number;
  star: {
    colorRatio: number;
    arr: Star[];
  };
  prevTime: number;
}

export function Starfield({
  starColorLight = "rgba(0, 0, 0, 0.8)",
  starColorDark = "rgba(255, 255, 255, 0.8)",
  bgColorLight = "rgba(255, 255, 255, 1)",
  bgColorDark = "rgba(0, 0, 0, 1)",
  mouseAdjust = false,
  tiltAdjust = false,
  easing = 1,
  clickToWarp = false,
  hyperspace = false,
  warpFactor = 10,
  opacity = 0.1,
  speed = 1,
  quantity = 512,
  className,
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isHyperspaceRef = useRef(hyperspace);
  const { resolvedTheme } = useTheme();

  // Use refs for colors so they update without restarting animation
  const colorsRef = useRef({
    star: resolvedTheme === "dark" ? starColorDark : starColorLight,
    bg: resolvedTheme === "dark" ? bgColorDark : bgColorLight,
  });

  const mouse = useRef({ x: 0, y: 0 });
  const cursor = useRef({ x: 0, y: 0 });

  const sd = useRef<StarfieldData>({
    w: 0,
    h: 0,
    ctx: null,
    cw: 0,
    ch: 0,
    x: 0,
    y: 0,
    z: 0,
    star: { colorRatio: 0, arr: [] },
    prevTime: 0,
  });

  // Update colors when theme changes
  useEffect(() => {
    colorsRef.current = {
      star: resolvedTheme === "dark" ? starColorDark : starColorLight,
      bg: resolvedTheme === "dark" ? bgColorDark : bgColorLight,
    };
  }, [resolvedTheme, starColorDark, starColorLight, bgColorDark, bgColorLight]);

  useEffect(() => {
    isHyperspaceRef.current = hyperspace;
  }, [hyperspace]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const el = canvas?.parentElement;
    if (!canvas || !el) return;

    const ratio = quantity / 2;

    const measureViewport = () => {
      if (el) {
        sd.current.w = el.clientWidth;
        sd.current.h = el.clientHeight;
        sd.current.x = Math.round(sd.current.w / 2);
        sd.current.y = Math.round(sd.current.h / 2);
        sd.current.z = (sd.current.w + sd.current.h) / 2;
        sd.current.star.colorRatio = 1 / sd.current.z;

        if (cursor.current.x === 0 || cursor.current.y === 0) {
          cursor.current.x = sd.current.x;
          cursor.current.y = sd.current.y;
        }
        if (mouse.current.x === 0 || mouse.current.y === 0) {
          mouse.current.x = cursor.current.x - sd.current.x;
          mouse.current.y = cursor.current.y - sd.current.y;
        }
      }
    };

    const setupCanvas = () => {
      measureViewport();
      sd.current.ctx = canvas.getContext("2d");
      canvas.width = sd.current.w;
      canvas.height = sd.current.h;
      if (sd.current.ctx) {
        sd.current.ctx.fillStyle = colorsRef.current.bg;
        sd.current.ctx.strokeStyle = colorsRef.current.star;
      }
    };

    const bigBang = () => {
      if (sd.current.star.arr.length !== quantity) {
        sd.current.star.arr = Array.from({ length: quantity }, () => [
          Math.random() * sd.current.w * 2 - sd.current.x * 2,
          Math.random() * sd.current.h * 2 - sd.current.y * 2,
          Math.round(Math.random() * sd.current.z),
          0,
          0,
          0,
          0,
          true,
        ]);
      }
    };

    const resize = () => {
      const oldStar = { ...sd.current.star };
      measureViewport();
      sd.current.cw = sd.current.ctx?.canvas.width ?? 0;
      sd.current.ch = sd.current.ctx?.canvas.height ?? 0;

      if (sd.current.cw !== sd.current.w || sd.current.ch !== sd.current.h) {
        sd.current.x = Math.round(sd.current.w / 2);
        sd.current.y = Math.round(sd.current.h / 2);
        sd.current.z = (sd.current.w + sd.current.h) / 2;
        sd.current.star.colorRatio = 1 / sd.current.z;

        const rw = sd.current.w / sd.current.cw;
        const rh = sd.current.h / sd.current.ch;

        if (sd.current.ctx) {
          sd.current.ctx.canvas.width = sd.current.w;
          sd.current.ctx.canvas.height = sd.current.h;
        }

        if (!sd.current.star.arr.length) {
          bigBang();
        } else {
          sd.current.star.arr = sd.current.star.arr.map((star, i) => {
            const newStar: Star = [...star];
            newStar[X] = oldStar.arr[i][X] * rw;
            newStar[Y] = oldStar.arr[i][Y] * rh;
            newStar[SCREEN_X] =
              sd.current.x + (newStar[X] / newStar[Z]) * ratio;
            newStar[SCREEN_Y] =
              sd.current.y + (newStar[Y] / newStar[Z]) * ratio;
            return newStar;
          });
        }

        if (sd.current.ctx) {
          sd.current.ctx.fillStyle = colorsRef.current.bg;
          sd.current.ctx.strokeStyle = colorsRef.current.star;
        }
      }
    };

    const update = () => {
      const compSpeed = isHyperspaceRef.current ? speed * warpFactor : speed;

      mouse.current.x = (cursor.current.x - sd.current.x) / easing;
      mouse.current.y = (cursor.current.y - sd.current.y) / easing;

      if (sd.current.star.arr.length > 0) {
        sd.current.star.arr = sd.current.star.arr.map((star) => {
          const newStar: Star = [...star];
          newStar[VISIBLE] = true;
          newStar[PREV_SCREEN_X] = newStar[SCREEN_X];
          newStar[PREV_SCREEN_Y] = newStar[SCREEN_Y];
          newStar[X] += mouse.current.x >> 4;

          if (newStar[X] > sd.current.x << 1) {
            newStar[X] -= sd.current.w << 1;
            newStar[VISIBLE] = false;
          }
          if (newStar[X] < -sd.current.x << 1) {
            newStar[X] += sd.current.w << 1;
            newStar[VISIBLE] = false;
          }

          newStar[Y] += mouse.current.y >> 4;
          if (newStar[Y] > sd.current.y << 1) {
            newStar[Y] -= sd.current.h << 1;
            newStar[VISIBLE] = false;
          }
          if (newStar[Y] < -sd.current.y << 1) {
            newStar[Y] += sd.current.h << 1;
            newStar[VISIBLE] = false;
          }

          newStar[Z] -= compSpeed;
          if (newStar[Z] > sd.current.z) {
            newStar[Z] -= sd.current.z;
            newStar[VISIBLE] = false;
          }
          if (newStar[Z] < 0) {
            newStar[Z] += sd.current.z;
            newStar[VISIBLE] = false;
          }

          newStar[SCREEN_X] = sd.current.x + (newStar[X] / newStar[Z]) * ratio;
          newStar[SCREEN_Y] = sd.current.y + (newStar[Y] / newStar[Z]) * ratio;
          return newStar;
        });
      }
    };

    const draw = () => {
      const ctx = sd.current.ctx;
      if (!ctx) return;

      // Read colors from ref each frame for live updates
      const currentBgColor = isHyperspaceRef.current
        ? `rgba(0,0,0,${opacity})`
        : colorsRef.current.bg;

      ctx.fillStyle = currentBgColor;
      ctx.fillRect(0, 0, sd.current.w, sd.current.h);
      ctx.strokeStyle = colorsRef.current.star;

      sd.current.star.arr.forEach((star) => {
        if (
          star[PREV_SCREEN_X] > 0 &&
          star[PREV_SCREEN_X] < sd.current.w &&
          star[PREV_SCREEN_Y] > 0 &&
          star[PREV_SCREEN_Y] < sd.current.h &&
          star[VISIBLE]
        ) {
          ctx.lineWidth = (1 - sd.current.star.colorRatio * star[Z]) * 2;
          ctx.beginPath();
          ctx.moveTo(star[PREV_SCREEN_X], star[PREV_SCREEN_Y]);
          ctx.lineTo(star[SCREEN_X], star[SCREEN_Y]);
          ctx.stroke();
          ctx.closePath();
        }
      });
    };

    const animate = () => {
      if (sd.current.prevTime === 0) {
        sd.current.prevTime = Date.now();
      }
      resize();
      update();
      draw();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const init = () => {
      measureViewport();
      setupCanvas();
      bigBang();
      animate();
    };

    const destroy = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      sd.current = {
        w: 0,
        h: 0,
        ctx: null,
        cw: 0,
        ch: 0,
        x: 0,
        y: 0,
        z: 0,
        star: { colorRatio: 0, arr: [] },
        prevTime: 0,
      };
    };

    const mouseHandler = (event: MouseEvent) => {
      cursor.current.x =
        event.pageX || event.clientX + el.scrollLeft - el.clientLeft;
      cursor.current.y =
        event.pageY || event.clientY + el.scrollTop - el.clientTop;
    };

    const tiltHandler = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        const x = event.gamma;
        const y = event.beta;
        cursor.current.x = sd.current.w / 2 + x * 5;
        cursor.current.y = sd.current.h / 2 + y * 5;
      }
    };

    const clickDownHandler = () => {
      isHyperspaceRef.current = true;
    };

    const clickUpHandler = () => {
      isHyperspaceRef.current = false;
    };

    if (mouseAdjust) {
      el.addEventListener("mousemove", mouseHandler);
    }
    if (tiltAdjust) {
      window.addEventListener("deviceorientation", tiltHandler);
    }
    if (clickToWarp) {
      el.addEventListener("mousedown", clickDownHandler);
      el.addEventListener("mouseup", clickUpHandler);
    }

    init();

    return () => {
      destroy();
      if (mouseAdjust) {
        el.removeEventListener("mousemove", mouseHandler);
      }
      if (tiltAdjust) {
        window.removeEventListener("deviceorientation", tiltHandler);
      }
      if (clickToWarp) {
        el.removeEventListener("mousedown", clickDownHandler);
        el.removeEventListener("mouseup", clickUpHandler);
      }
    };
  }, [
    mouseAdjust,
    tiltAdjust,
    easing,
    clickToWarp,
    warpFactor,
    opacity,
    speed,
    quantity,
  ]);

  return (
    <div
      className={className}
      style={{ position: "absolute", width: "100%", height: "100%" }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
