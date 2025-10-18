import { createAction, props } from "@ngrx/store";
import { IChStatusToDoItem, INewToDoItem, IToDoItem } from "../../interfaces/interfaces";
import { EStatus } from "../../enums/status";


export const isLoadingList = createAction('[ToDoList] Is Loading List', props<{isLoading: boolean}>());
export const getList = createAction('[ToDoList] Get List');
export const updateList = createAction('[ToDoList] Update List');
export const setList = createAction('[ToDoList] Set List', props<{list: IToDoItem[]}>());
export const selectItem = createAction('[ToDoList] Select Item', props<{id: number}>());
export const editItem = createAction('[ToDoList] Edit Item', props<{id: number}>());
export const isAddItem = createAction('[ToDoList] Is Add Item', props<{isLoading: boolean}>());
export const addItem = createAction('[ToDoList] Add Item', props<{item: INewToDoItem}>());
export const isDeleteItem = createAction('[ToDoList] Is Delete Item', props<{isLoading: boolean}>());
export const deleteItem = createAction('[ToDoList] Delete Item' , props<{id: number}>());
export const isChangeItem = createAction('[ToDoList] Is Change Item', props<{isLoading: boolean}>());
export const changeItem = createAction('[ToDoList] Change Item', props<{item: IToDoItem}>());
export const changeItemStatus = createAction('[ToDoList] Change Item Status', props<{item: IChStatusToDoItem}>());
export const switchStatusFilter = createAction('[ToDoList] Switch Status Filter', props<{status: EStatus.All | EStatus.Completed | EStatus.InProgress}>());

