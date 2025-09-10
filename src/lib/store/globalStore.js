import { create } from "zustand";

const useGlobalStore = create((set, get) => ({
  // editor state
  isEditorOpen: false,
  editorInfo: null, // { id, entity, slug, data, setData, name }

  // schemas per block id
  schemasById: {},

  // actions
  openEditorFor: (info) =>
    set({
      isEditorOpen: true,
      editorInfo: info,
    }),

  closeEditor: () =>
    set({
      isEditorOpen: false,
      editorInfo: null,
    }),

  setSchemaForId: (id, actualSchema) => {
    const temporarySchema = actualSchema
      ? JSON.parse(JSON.stringify(actualSchema))
      : null;
    set((state) => ({
      schemasById: {
        ...state.schemasById,
        [id]: { actualSchema, temporarySchema },
      },
    }));
  },

  updateTemporaryFieldForId: (id, section, field, value) => {
    set((state) => {
      const entry = state.schemasById[id] || {
        actualSchema: null,
        temporarySchema: {},
      };
      const temp = entry.temporarySchema ? { ...entry.temporarySchema } : {};
      const prevSec = temp[section] || {};
      const prevFields = prevSec.fields || {};
      const prevField = prevFields[field] || {};

      const newTemp = {
        ...temp,
        [section]: {
          ...prevSec,
          fields: {
            ...prevFields,
            [field]: {
              ...prevField,
              value: Array.isArray(value) ? [...value] : value,
            },
          },
        },
      };

      return {
        schemasById: {
          ...state.schemasById,
          [id]: { ...entry, temporarySchema: newTemp },
        },
      };
    });
  },

  replaceTemporaryWithActualForId: (id) =>
    set((state) => {
      const entry = state.schemasById[id];
      if (!entry) return {};
      return {
        schemasById: {
          ...state.schemasById,
          [id]: {
            ...entry,
            temporarySchema: entry.actualSchema
              ? JSON.parse(JSON.stringify(entry.actualSchema))
              : null,
          },
        },
      };
    }),

  clearSchemaForId: (id) =>
    set((state) => {
      const next = { ...state.schemasById };
      delete next[id];
      return { schemasById: next };
    }),
}));

export default useGlobalStore;
