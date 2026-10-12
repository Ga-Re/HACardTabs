/** Transition keyframes for switching tabs (Web Animations API). `dir` is 1 (forward) or -1 (backward). */

const P = "perspective(1200px)";

const TRANSITIONS = {
  fade: () => ({
    in: [{ opacity: 0 }, { opacity: 1 }],
    out: [{ opacity: 1 }, { opacity: 0 }],
  }),
  slide: (dir) => ({
    in: [{ transform: `translateX(${dir * 100}%)` }, { transform: "translateX(0)" }],
    out: [{ transform: "translateX(0)" }, { transform: `translateX(${-dir * 100}%)` }],
  }),
  slide_vertical: (dir) => ({
    in: [
      { transform: `translateY(${dir * 40}px)`, opacity: 0 },
      { transform: "translateY(0)", opacity: 1 },
    ],
    out: [
      { transform: "translateY(0)", opacity: 1 },
      { transform: `translateY(${-dir * 40}px)`, opacity: 0 },
    ],
  }),
  zoom: () => ({
    in: [
      { transform: "scale(0.88)", opacity: 0 },
      { transform: "scale(1)", opacity: 1 },
    ],
    out: [
      { transform: "scale(1)", opacity: 1 },
      { transform: "scale(1.08)", opacity: 0 },
    ],
  }),
  flip: (dir) => ({
    sequential: true,
    in: [
      { transform: `${P} rotateY(${-dir * 90}deg)`, opacity: 0.3 },
      { transform: `${P} rotateY(0deg)`, opacity: 1 },
    ],
    out: [
      { transform: `${P} rotateY(0deg)`, opacity: 1 },
      { transform: `${P} rotateY(${dir * 90}deg)`, opacity: 0.3 },
    ],
  }),
  cube: (dir) => {
    const inOrigin = dir > 0 ? "left center" : "right center";
    const outOrigin = dir > 0 ? "right center" : "left center";
    return {
      in: [
        { transformOrigin: inOrigin, transform: `${P} translateX(${dir * 100}%) rotateY(${dir * 90}deg)` },
        { transformOrigin: inOrigin, transform: `${P} translateX(0) rotateY(0deg)` },
      ],
      out: [
        { transformOrigin: outOrigin, transform: `${P} translateX(0) rotateY(0deg)` },
        { transformOrigin: outOrigin, transform: `${P} translateX(${-dir * 100}%) rotateY(${-dir * 90}deg)` },
      ],
    };
  },
  blur: () => ({
    in: [
      { filter: "blur(12px)", opacity: 0 },
      { filter: "blur(0px)", opacity: 1 },
    ],
    out: [
      { filter: "blur(0px)", opacity: 1 },
      { filter: "blur(12px)", opacity: 0 },
    ],
  }),
  bounce: () => ({
    easing: "ease-out",
    in: [
      { transform: "translateY(40px) scale(0.96)", opacity: 0, offset: 0 },
      { transform: "translateY(-8px) scale(1)", opacity: 1, offset: 0.6 },
      { transform: "translateY(3px)", offset: 0.8 },
      { transform: "translateY(0)", opacity: 1, offset: 1 },
    ],
    out: [{ opacity: 1 }, { opacity: 0 }],
  }),
};

export const ANIMATIONS = ["none", ...Object.keys(TRANSITIONS), "random"];

export const EASINGS = {
  ease: "ease",
  ease_in_out: "ease-in-out",
  ease_out: "ease-out",
  linear: "linear",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
};

/** Returns the keyframes for the given animation name, or undefined for "none". */
export function getTransition(name, dir) {
  let key = name;
  if (key === "random") {
    const keys = Object.keys(TRANSITIONS);
    key = keys[Math.floor(Math.random() * keys.length)];
  }
  const factory = TRANSITIONS[key];
  return factory ? factory(dir >= 0 ? 1 : -1) : undefined;
}
