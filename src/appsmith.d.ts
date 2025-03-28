
type AppsmithTheme = object
type AppsmithModel = object

export interface AppsmithCustomWidgetGlobal {
  mode: string;
  theme: AppsmithTheme;
  model: AppsmithModel;
  onReady: (callback: () => void) => void;
  onModelChange: (callback: (model: AppsmithModel, prevModel: AppsmithModel) => void) => void;
  onThemeChange: (callback: (theme: AppsmithTheme, prevTheme: AppsmithTheme) => void) => void;
  updateModel: (model: AppsmithModel) => void;
  triggerEvent: (eventName: string, contextObj: object) => void;
}