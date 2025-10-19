import { createReducer, on } from "@ngrx/store";
import { initialState } from "./state";
import { setList, isLoadingList, isAddItem, isDeleteItem, isChangeItem, changeItem, deleteItem, switchStatusFilter, updateDescription, isEditItem } from "./action";


export const toDoListReducer = createReducer(
    initialState,
    on(isLoadingList, (state, {isLoading}) => ({...state, isLoad: isLoading})),
    on(setList, (state, {list}) => {
        const sortedList = [...list].sort((a, b) => a.id - b.id);
        return {...state, list: sortedList};
    }),
    on(isEditItem, (state, {isEdit}) => ({...state, isEdit: isEdit})),
    on(isAddItem, (state, {isLoading}) => ({...state, isAdd: isLoading})),
    on(isDeleteItem, (state, {isLoading}) => ({...state, isDelete: isLoading})),
    on(deleteItem, (state) => ({...state, isEdit: false})),
    on(isChangeItem, (state, {isLoading}) => ({...state, isChange: isLoading})),
    on(changeItem, (state) => ({...state, isEdit: false})),
    on(switchStatusFilter, (state, {status}) => ({...state, filterStatus: status})),
    on(updateDescription, (state, {description}) => ({...state, newDescription: description})),
)