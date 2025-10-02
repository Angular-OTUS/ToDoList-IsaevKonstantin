import { createAction, props } from "@ngrx/store";
import { NewToDoItem, ToDoItem } from "../../interfaces/interfaces";


export const isLoadingList = createAction('[ToDoList] Is Loading List', props<{isLoading: boolean}>());
export const getList = createAction('[ToDoList] Get List');
export const setList = createAction('[ToDoList] Set List', props<{list: ToDoItem[]}>());
export const selectItem = createAction('[ToDoList] Select Item', props<{id: number}>());
export const editItem = createAction('[ToDoList] Edit Item', props<{id: number}>());
export const isAddItem = createAction('[ToDoList] Is Add Item', props<{isLoading: boolean}>());
export const addItem = createAction('[ToDoList] Add Item', props<{item: NewToDoItem}>());
export const isDeleteItem = createAction('[ToDoList] Is Delete Item', props<{isLoading: boolean}>());
export const deleteItem = createAction('[ToDoList] Delete Item' , props<{id: number}>());
export const isChangeItem = createAction('[ToDoList] Is Change Item', props<{isLoading: boolean}>());
export const changeItem = createAction('[ToDoList] Change Item', props<{item: ToDoItem}>());

