import { create } from "zustand";
export default create(() => ({
  isEditorOpen: false,
  editorInfo: null,
  temporarySchema: null,
  actualSchema: null,
}));
