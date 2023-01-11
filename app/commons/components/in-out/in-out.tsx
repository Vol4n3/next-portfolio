import * as React from "react";
import { CSSProperties, PropsWithChildren, useEffect, useRef } from "react";
import { KeyframesHelper } from "../../utils/keyframes.utils";

type AnimationConfig = {
  keyframes?: Keyframe[];
  options?: KeyframeAnimationOptions;
};
const setVisible = (element: HTMLElement, value: boolean) => {
  if (value) {
    element.style.removeProperty("visibility");
    element.style.removeProperty("opacity");
    element.style.removeProperty("pointer-events");
    return;
  }

  element.style.setProperty("visibility", "hidden");
  element.style.setProperty("opacity", "0");
  element.style.setProperty("pointer-events", "none");
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
    delay: options.delay,
  };
  return element.animate(keyframes, option);
};

interface InOutProps {
  /**
   * permet de scroll une fois que l'élément apparait
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
   * style imposé au démarrage de l'animation default : opacity : 0
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
