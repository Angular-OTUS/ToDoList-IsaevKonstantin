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
import { toDoList } from "./select";

@Injectable()
export class ToDoEffects {
    private actions$ = inject(Actions);
    private store = inject(Store);
    
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
            withLatestFrom(this.store.pipe(select(toDoList))),
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
            switchMap(({item}) => {
                return this.toDoService.changeItem(item).pipe(
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
            withLatestFrom(this.store.pipe(select(toDoList))),
            switchMap(([{item}, list]) => {
                if (list.find((listItem) => listItem.id === item.id)?.status === item.status) return of(false);
                return this.toDoService.changeItemStatus(item);
            }),
            tap((result) => {
                this.toast.showToast(result ? "Статус успешно изменен!" : "Статус не изменился!");
            }),
        ),
        {dispatch: false},
    );

    constructor(
        private toDoService: ToDoListService,
        private toast: ToastService,
    ) {}
}