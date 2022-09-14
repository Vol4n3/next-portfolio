export const PickChoiceByDevice = <T>(
  device: ScreenDevice,
  choices: T[]
): T => {
  switch (device) {
    case "xl":
      return choices[3] || choices[2] || choices[1] || choices[0];
    case "lg":
      return choices[2] || choices[1] || choices[0];
    case "sm":
      return choices[1] || choices[0];
    case "xs":
    default:
      return choices[0];
  }
};
export const MakeCssMediaBreakPoint = (
  css: string,
  devices: ScreenDevice,
  breakPoints: [number, number, number]
): string => {
  let media = 0;
  switch (devices) {
    case "xs":
      return css;
    case "sm":
      media = breakPoints[0];
      break;
    case "lg":
      media = breakPoints[1];
      break;
    case "xl":
      media = breakPoints[2];
      break;
  }
  return `
     @media (min-width: ${media}px) {
        ${css}
     }
    `;
};
