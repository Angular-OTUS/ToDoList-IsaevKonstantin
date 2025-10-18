import { createReducer, on } from "@ngrx/store";
import { initialState } from "./state";
import { setList, isLoadingList, selectItem, editItem, isAddItem, isDeleteItem, isChangeItem, changeItem, deleteItem, changeItemStatus, switchStatusFilter } from "./action";
import { IToDoItem } from "../../interfaces/interfaces";


export const toDoListReducer = createReducer(
    initialState,
    on(isLoadingList, (state, {isLoading}) => ({...state, isLoad: isLoading})),
    on(setList, (state, {list}) => {
        const sortedList = [...list].sort((a, b) => a.id - b.id);
        return {...state, list: sortedList};
    }),
    on(selectItem, (state, {id}) => ({...state, selectedItem: state.selectedItem !== id ? id : null, isEdit: false})),
    on(editItem, (state, {id}) => ({...state, selectedItem: id, isEdit: true})),
    on(isAddItem, (state, {isLoading}) => ({...state, isAdd: isLoading})),
    on(isDeleteItem, (state, {isLoading}) => ({...state, isDelete: isLoading})),
    on(deleteItem, (state, {id}) => (id === state.selectedItem ? {...state, selectedItem: null, isEdit: false} : {...state, isEdit: false})),
    on(isChangeItem, (state, {isLoading}) => ({...state, isChange: isLoading})),
    on(changeItem, (state) => ({...state, isEdit: false})),
    on(switchStatusFilter, (state, {status}) => ({...state, filterStatus: status})),
)