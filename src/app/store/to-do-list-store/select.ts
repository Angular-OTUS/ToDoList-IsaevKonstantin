import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ToDoListState } from "./state";

export const selectToDoListState = createFeatureSelector<ToDoListState>('toDoList');

export const isLoading = createSelector(
  selectToDoListState,
  (state) => (state.isLoad || state.isAdd || state.isChange || state.isDelete)
);

export const toDoList = createSelector(
  selectToDoListState,
  (state) => state.list
);

export const selectedItemId = createSelector(
  selectToDoListState,
  (state) => state.selectedItem
);

export const isEdit = createSelector(
  selectToDoListState,
  (state) => state.isEdit
);

export const descriptionSelected = createSelector(
  selectToDoListState,
  (state) => {
    return state.list.length && state.selectedItem !== null ? 
      state.list.find((listItem) => listItem.id === state.selectedItem)!.description || "Описания нет"
      : "Описания нет";
  }
);