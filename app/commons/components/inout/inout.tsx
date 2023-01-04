import * as React from "react";
import { CSSProperties, PropsWithChildren, useEffect, useRef } from "react";
import { KeyframesHelper } from "../../utils/keyframes.utils";

type State = "in" | "start" | "shown" | "end" | "out";
type AnimationConfig = {
  keyframes?: Keyframe[];
  options?: KeyframeAnimationOptions;
};
const setVisible = (element: HTMLElement, value: boolean) => {
  element.style.setProperty("visibility", value ? "visible" : "hidden");
  element.style.setProperty("opacity", value ? "1" : "0");
  element.style.setProperty("pointer-events", value ? "initial" : "none");
};
const execAnimation = (
  element: HTMLDivElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions
): Animation => {
  const option = {
    ...options,
    easing: options.easing || "cubic-bezier(0.8, 0, 0.2, 1)",
    duration: options.duration || 250,
    delay: options.delay, // managed by component because animation event listener has not on begin event
  };
  return element.animate(keyframes, option);
};

interface InOutProps {
  /**
   * permet de scroll une fois que l'élement apparait
   */
  autoScroll?: boolean | ScrollIntoViewOptions;
  /**
   * configuration de l'animation en entrée
   */
  enter?: AnimationConfig;
  /**
   * configuration de l'animation en sorti
   */
  exit?: AnimationConfig;
  /**
   * permet de montrer ou afficher en appliquant les animations configurer
   */
  show: boolean;
  /**
   * style imposé au démarage de l'animation default : opacity : 0
   */
  startStyle?: CSSProperties;
  /**
   * démarre l'animation si le composant apparait d'un coup
   */
  starting?: boolean;
  /**
   * style appliquer quand l'élément est montré
   */
  style?: CSSProperties;
}

export function InOut({
  children,
  show,
  starting,
  enter,
  exit,
  autoScroll,
  style,
}: PropsWithChildren<InOutProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previous = useRef<boolean>(starting ? false : show);

  useEffect(() => {
    const container = containerRef.current as HTMLDivElement;
    if (!container) {
      return;
    }

    if (show && show !== previous.current) {
      previous.current = show;
      const anim = execAnimation(
        container,
        enter?.keyframes || KeyframesHelper.fadeIn,
        enter?.options || {}
      );
      container.style.removeProperty("visibility");
      const onFinishEnter = () => {
        setVisible(container, true);
        if (autoScroll) {
          if (typeof autoScroll === "boolean") {
            container.scrollIntoView({
              block: "start",
              behavior: "smooth",
            });
          } else {
            container.scrollIntoView(autoScroll);
          }
        }
      };
      anim.addEventListener("finish", onFinishEnter, { once: true });
    } else if (!show && show !== previous.current) {
      previous.current = show;
      const anim = execAnimation(
        container,
        exit?.keyframes || KeyframesHelper.fadeOut,
        exit?.options || {}
      );

      const onFinishEnd = () => {
        setVisible(container, false);
      };
      anim.addEventListener("finish", onFinishEnd, { once: true });
    } else {
      if (!show) {
        setVisible(container, false);
      }
    }
  }, [autoScroll, enter, exit, show]);

  return (
    <div
      style={{ ...style, ...(starting ? { opacity: 0 } : {}) }}
      ref={containerRef}
    >
      {children}
    </div>
  );
}
