
// Import Appsmith types
import {AppsmithCustomWidgetGlobal} from "./appsmith";

// Global window interface
declare global {
  interface Window {
    appsmith: AppsmithCustomWidgetGlobal;
  }
}