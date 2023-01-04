const fadeIn: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }];
const fadeOut: Keyframe[] = [{ opacity: 1 }, { opacity: 0 }];
const slideInFrom: (x?: string, y?: string) => Keyframe[] = (
  x: string = "0",
  y: string = "0"
) => {
  return [
    {
      opacity: 0,
      transform: `translate3d(${x},${y},0)`,
      transformOrigin: "top",
    },
    {
      opacity: 1,
      transform: "translate3d(0,0,0)",
      transformOrigin: "top",
    },
  ];
};
const slideOutFrom: (x?: string, y?: string) => Keyframe[] = (
  x: string = "0",
  y: string = "0"
) => {
  return [
    {
      opacity: 1,
      pointerEvents: "none",
      transform: "translate3d(0,0,0)",
      transformOrigin: "top",
    },
    {
      opacity: 0,
      pointerEvents: "none",
      transform: `translate3d(${x},${y},0)`,
      transformOrigin: "top",
    },
  ];
};
const slideInFromRight: Keyframe[] = [
  {
    opacity: 0,
    transform: "translate3d(50%,0,0)",
    transformOrigin: "top",
  },
  {
    opacity: 1,
    transform: "translate3d(0,0,0)",
    transformOrigin: "top",
  },
];
const slideInFromLeft: Keyframe[] = [
  {
    opacity: 0,
    transform: "translate3d(-50%,0,0)",
    transformOrigin: "top",
  },
  {
    opacity: 1,
    transform: "translate3d(0,0,0)",
    transformOrigin: "top",
  },
];
const slideInFromTop: Keyframe[] = [
  {
    opacity: 0,
    pointerEvents: "none",
    transform: "translate3d(0,-50%,0)",
    transformOrigin: "top",
  },
  {
    opacity: 1,
    pointerEvents: "none",
    transform: "translate3d(0,0,0)",
    transformOrigin: "top",
  },
];
const slideInFromBottom: Keyframe[] = [
  {
    opacity: 0,
    pointerEvents: "none",
    transform: "translate3d(0,50%,0)",
    transformOrigin: "top",
  },
  {
    opacity: 1,
    pointerEvents: "none",
    transform: "translate3d(0,0,0)",
    transformOrigin: "top",
  },
];
const slideOutToRight: Keyframe[] = [
  {
    opacity: 1,
    pointerEvents: "none",
    transform: "translate3d(0,0,0)",
    transformOrigin: "top",
  },
  {
    opacity: 0,
    pointerEvents: "none",
    transform: "translate3d(50%,0,0)",
    transformOrigin: "top",
  },
];
const slideOutToLeft: Keyframe[] = [
  {
    opacity: 1,
    pointerEvents: "none",
    transform: "translate3d(0,0,0)",
    transformOrigin: "top",
  },
  {
    opacity: 0,
    pointerEvents: "none",
    transform: "translate3d(-50%,0,0)",
    transformOrigin: "top",
  },
];
const slideOutToTop: Keyframe[] = [
  {
    opacity: 1,
    pointerEvents: "none",
    transform: "translate3d(0,0,0)",
    transformOrigin: "top",
  },
  {
    opacity: 0,
    pointerEvents: "none",
    transform: "translate3d(0,-50%,0)",
    transformOrigin: "top",
  },
];
const slideOutToBottom: Keyframe[] = [
  {
    opacity: 1,
    pointerEvents: "none",
    transform: "translate3d(0,0,0)",
    transformOrigin: "top",
  },
  {
    opacity: 0,
    pointerEvents: "none",
    transform: "translate3d(0,50%,0)",
    transformOrigin: "top",
  },
];
const growInToRight: Keyframe[] = [
  {
    transform: "scale(0,1)",
    transformOrigin: "left",
  },
  {
    transform: "scale(1,1)",
    transformOrigin: "left",
  },
];
const increaseHeight: (maxHeight: string) => Keyframe[] = (
  maxHeight: string
) => {
  return [
    {
      maxHeight: "0px",
      overflow: "hidden",
    },
    {
      maxHeight,
      overflow: "hidden",
    },
  ];
};
const increaseWidth: (maxWidth: string) => Keyframe[] = (maxWidth: string) => {
  return [
    {
      maxWidth: "0px",
      overflow: "hidden",
    },
    {
      maxWidth,
      overflow: "hidden",
    },
  ];
};
const decreaseWidth: (maxWidth: string) => Keyframe[] = (maxWidth: string) => {
  return [
    {
      maxWidth,
      overflow: "hidden",
    },
    {
      maxWidth: "0px",
      overflow: "hidden",
    },
  ];
};
const decreaseHeight: (maxHeight: string) => Keyframe[] = (
  maxHeight: string
) => {
  return [
    {
      maxHeight,
      overflow: "hidden",
    },
    {
      maxHeight: "0px",
      overflow: "hidden",
    },
  ];
};
export const KeyframesHelper = {
  fadeIn,
  fadeOut,
  slideInFromRight,
  slideInFromLeft,
  slideInFromTop,
  slideInFromBottom,
  slideOutToRight,
  slideOutToLeft,
  slideOutToTop,
  slideOutToBottom,
  growInToRight,
  increaseWidth,
  increaseHeight,
  decreaseHeight,
  decreaseWidth,
  slideInFrom,
  slideOutFrom,
};
