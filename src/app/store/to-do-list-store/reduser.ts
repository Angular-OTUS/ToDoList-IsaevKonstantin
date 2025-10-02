import { createReducer, on } from "@ngrx/store";
import { initialState } from "./state";
import { setList, isLoadingList, selectItem, editItem, isAddItem, isDeleteItem, isChangeItem, changeItem, deleteItem } from "./action";


export const toDoListReducer = createReducer(
    initialState,
    on(isLoadingList, (state, {isLoading}) => ({...state, isLoad: isLoading})),
    on(setList, (state, {list}) => ({...state, list: list})),
    on(selectItem, (state, {id}) => ({...state, selectedItem: state.selectedItem !== id ? id : null, isEdit: false})),
    on(editItem, (state, {id}) => ({...state, selectedItem: id, isEdit: true})),
    on(isAddItem, (state, {isLoading}) => ({...state, isAdd: isLoading})),
    on(isDeleteItem, (state, {isLoading}) => ({...state, isDelete: isLoading})),
    on(deleteItem, (state, {id}) => (id === state.selectedItem ? {...state, selectedItem: null, isEdit: false} : {...state, isEdit: false})),
    on(isChangeItem, (state, {isLoading}) => ({...state, isChange: isLoading})),
    on(changeItem, (state) => ({...state, isEdit: false})),
)