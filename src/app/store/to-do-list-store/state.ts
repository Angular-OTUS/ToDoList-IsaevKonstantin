import { ToDoItem } from "../../interfaces/interfaces";


export interface ToDoListState {
    isLoad: boolean,
    list: ToDoItem[],
    selectedItem: number | null,
    isEdit: boolean,
    isAdd: boolean,
    isDelete: boolean,
    isChange: boolean,
}

export const initialState: ToDoListState = {
    isLoad: false,
    list: [],
    selectedItem: null,
    isEdit: false,
    isAdd: false,
    isDelete: false,
    isChange: false,
}