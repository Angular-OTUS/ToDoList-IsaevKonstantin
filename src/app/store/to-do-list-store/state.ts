import { EStatus } from "../../enums/status";
import { IToDoItem } from "../../interfaces/interfaces";


export interface ToDoListState {
    isLoad: boolean,
    list: IToDoItem[],
    isEdit: boolean,
    isAdd: boolean,
    isDelete: boolean,
    isChange: boolean,
    filterStatus: EStatus.All | EStatus.Completed | EStatus.InProgress,
    newDescription: string;
}

export const initialState: ToDoListState = {
    isLoad: false,
    list: [],
    isEdit: false,
    isAdd: false,
    isDelete: false,
    isChange: false,
    filterStatus: EStatus.All,
    newDescription: "",
}