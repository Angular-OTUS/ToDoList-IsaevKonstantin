import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ToDoListState } from "./state";
import { EStatus } from "../../enums/status";

export const selectToDoListState = createFeatureSelector<ToDoListState>('toDoList');

export const isLoading = createSelector(
  selectToDoListState,
  (state) => (state.isLoad || state.isAdd || state.isChange || state.isDelete)
);

export const allToDoList = createSelector(
  selectToDoListState,
  (state) => state.list,
);

export const filteredToDoList = createSelector(
  selectToDoListState,
  (state) => {
    if (state.filterStatus !== EStatus.All) return state.list.filter((item) => item.status === state.filterStatus);
    return state.list;
  },
);

export const isEdit = createSelector(
  selectToDoListState,
  (state) => state.isEdit,
);

export const newDescription = createSelector(
  selectToDoListState,
  (state) => state.newDescription,
);
