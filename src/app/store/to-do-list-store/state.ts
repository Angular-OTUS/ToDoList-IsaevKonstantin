import { EStatus } from "../../enums/status";
import { IToDoItem } from "../../interfaces/interfaces";


export interface ToDoListState {
    isLoad: boolean,
    list: IToDoItem[],
    selectedItem: number | null,
    isEdit: boolean,
    isAdd: boolean,
    isDelete: boolean,
    isChange: boolean,
    filterStatus: EStatus.All | EStatus.Completed | EStatus.InProgress,
}

export const initialState: ToDoListState = {
    isLoad: false,
    list: [],
    selectedItem: null,
    isEdit: false,
    isAdd: false,
    isDelete: false,
    isChange: false,
    filterStatus: EStatus.All,
}