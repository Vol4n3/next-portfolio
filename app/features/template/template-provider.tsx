import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { TemplateName } from "./template-types";
import { MainTemplate } from "./main-template";
import { notInitializedFn } from "../../commons/utils/commons-utils";

interface TemplateOption {
  name: TemplateName;
}

interface TemplateContextProps {
  changeTemplate: (options: TemplateOption) => void;
}

const TemplateContext = createContext<TemplateContextProps>({
  changeTemplate: notInitializedFn,
});
export const useTemplate = () => useContext(TemplateContext);

export function TemplateProvider({ children }: PropsWithChildren) {
  const [template, setTemplate] = useState<TemplateName>("main");
  const SwitchTemplate = useMemo(() => {
    switch (template) {
      default:
      case "main":
        return <MainTemplate>{children}</MainTemplate>;
      case "none":
        return <>{children}</>;
    }
  }, [template, children]);
  const changeTemplate = (option: TemplateOption) => {
    if (template === option.name) {
      return;
    }
    setTemplate(option.name);
  };
  return (
    <TemplateContext.Provider value={{ changeTemplate }}>
      {SwitchTemplate}
    </TemplateContext.Provider>
  );
}
