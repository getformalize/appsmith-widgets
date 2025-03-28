import React from 'react';
import { createRoot } from 'react-dom/client';
import KVWidget from './widgets/kv/KVWidget';
import ChecklistWidget from './widgets/checklist/ChecklistWidget';

// Export all widgets
export { KVWidget, ChecklistWidget };

// Helper function to inject CSS styles
function injectStyles(cssText: string, widgetName: string) {
  // Check if styles are already injected
  const styleId = `appsmith-widget-${widgetName}-styles`;
  if (document.getElementById(styleId)) {
    return; // Styles already injected
  }

  // Create style element
  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = cssText;
  document.head.appendChild(styleElement);
}

// Generic initialization function 
export function initializeWidget(Widget: React.ComponentType<any>) {
  if (typeof window.appsmith !== 'undefined') {
    // Extract widget name from constructor name for style ID
    const widgetName = Widget.name.toLowerCase();
    
    // Get the CSS text from the imported styles in the widget module
    // @ts-ignore - Accessing styles which is imported as string due to esbuild loader config
    const cssText = (Widget as any).styles || '';
    
    // Inject widget-specific styles
    injectStyles(cssText, widgetName);

    // Helper function to get or create root element
    const getRootElement = () => {
      let rootElement = document.getElementById("root");
      
      // If root element doesn't exist, create it
      if (!rootElement) {
        rootElement = document.createElement("div");
        rootElement.id = "root";
        document.body.appendChild(rootElement);
      }
      
      return rootElement;
    };

    // Render function that's used for both initial render and updates
    const renderWidget = () => {
      const rootElement = getRootElement();
      const createdRoot = createRoot(rootElement);
      createdRoot.render(<Widget {...window.appsmith.model} />);
    };

    // Initialize on Appsmith ready
    window.appsmith.onReady(renderWidget);

    // Handle model changes
    window.appsmith.onModelChange(renderWidget);
  }
}