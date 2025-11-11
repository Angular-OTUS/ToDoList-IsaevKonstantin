import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, of, startWith, switchMap, tap, withLatestFrom } from "rxjs";
import {
    getList, setList, isLoadingList,
    addItem, isAddItem,
    deleteItem, isDeleteItem,
    changeItem, isChangeItem,
    changeItemStatus,
    updateList
} from "./action";
import { ToDoListService } from "../../services/to-do-list-service";
import { ToastService } from "../../services/toast";
import { select, Store } from "@ngrx/store";
import { allToDoList, filteredToDoList, newDescription } from "./select";

@Injectable()
export class ToDoEffects {
    private readonly toDoService = inject(ToDoListService);
    private readonly toast = inject(ToastService);
    private readonly actions$ = inject(Actions);
    private readonly store = inject(Store);
    
    loadList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getList),
            switchMap(() => {
                return this.toDoService.getList().pipe(
                    switchMap((list) => {
                        this.toast.showToast("Дела насущнные получены!");
                        return of(isLoadingList({isLoading: false}), setList({list: list}));
                    }),
                    catchError(() => of(isLoadingList({isLoading: false}))),
                    startWith(isLoadingList({isLoading: true})),
                )
            }),
        ),
    );

    updateList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateList),
            switchMap(() => {
                this.toast.showToast("Обновление дел...")
                return this.toDoService.getList().pipe(
                    switchMap((list) => {
                        this.toast.showToast("Дела насущнные обновлены!");
                        return of(isLoadingList({isLoading: false}), setList({list: list}))
                    }),
                    catchError(() => of(isLoadingList({isLoading: false}))),
                    startWith(isLoadingList({isLoading: true})),
                )
            }),
        ),
    );

    addItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addItem),
            withLatestFrom(this.store.pipe(select(filteredToDoList))),
            switchMap(([{item}, list]) => {
                const nextId: number = list.length ? Math.max(...list.map(item => item.id)) + 1 : 0;
                return this.toDoService.addItem(item, nextId).pipe(
                    switchMap((result) => {
                        if (result) {
                            this.toast.showToast("Дело успешно добавлено!");
                            return of(isAddItem({isLoading: false}), updateList());
                        }
                        this.toast.showToast("Не удалось добавить дело!");
                        return of(isAddItem({isLoading: false}));
                    }),
                    catchError(() => of(isAddItem({isLoading: false}))),
                    startWith(isAddItem({isLoading: true})),
                );
            }),
        ),
    );

    deleteItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteItem),
            switchMap(({id}) => {
                return this.toDoService.deleteItem(id).pipe(
                    switchMap((result) => {
                        if (result) {
                            this.toast.showToast("Дело успешно удалено!");
                            return of(isDeleteItem({isLoading: false}), updateList());
                        }
                        this.toast.showToast("Не удалось удалить дело!");
                        return of(isDeleteItem({isLoading: false}));
                    }),
                    catchError(() => of(isDeleteItem({isLoading: false}))),
                    startWith(isDeleteItem({isLoading: true})),
                );
            }),
        ),
    );

    changeItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(changeItem),
            withLatestFrom(this.store.pipe(select(newDescription))),
            switchMap(([{item}, description]) => {
                return this.toDoService.changeItem({...item, description: description}).pipe(
                    switchMap((result) => {
                        if (result) {
                            this.toast.showToast("Дело успешно сохранено!");
                            return of(isChangeItem({isLoading: false}), updateList());
                        }
                        this.toast.showToast("Не удалось удалить дело!");
                        return of(isChangeItem({isLoading: false}));
                    }),
                    catchError(() => of(isChangeItem({isLoading: false}))),
                    startWith(isChangeItem({isLoading: true})),
                );
            }),
        ),
    );

    changeItemStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(changeItemStatus),
            withLatestFrom(this.store.pipe(select(allToDoList))),
            switchMap(([{item}, list]) => {
                if (list.find((listItem) => listItem.id === item.id)?.status === item.status) {
                    this.toast.showToast("Статус не изменился!");
                    return of(null);
                }
                return this.toDoService.changeItemStatus(item).pipe(
                    tap((result) => {
                        if (result) {
                            const newList = [...list].map((listItem) => {
                                if (listItem.id === item.id) return {...listItem, status: item.status};
                                return listItem;
                            });
                            this.store.dispatch(setList({list: newList}));
                        }
                        this.toast.showToast(result ? "Статус успешно изменен!" : "Не удалось изменить статус!");
                    }),
                );
            }),
        ),
        {dispatch: false},
    );
}