import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";
import {
    getList, setList, isLoadingList,
    addItem, isAddItem,
    deleteItem, isDeleteItem,
    changeItem, isChangeItem
} from "./action";
import { ToDoListService } from "../../services/to-do-list-service";
import { ToastService } from "../../services/toast";

@Injectable()
export class ToDoEffects {
    private actions$ = inject(Actions);

    constructor(
        private toDoService: ToDoListService,
        private toast: ToastService,
    ) {}
    
    loadList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getList),
            switchMap(() => {
                return this.toDoService.getList().pipe(
                    map((list) => setList({list: list})),
                    catchError(() => of(isLoadingList({isLoading: false}))),
                )
            }),
        ),
    );

    addItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addItem),
            switchMap(({item}) => {
                return this.toDoService.addItem(item).pipe(
                    tap(() => this.toast.showToast("Обновление дел...")),
                    map(() => getList()),
                    catchError(() => of(isAddItem({isLoading: false}))),
                );
            }),
        ),
    );

    deleteItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteItem),
            switchMap(({id}) => {
                return this.toDoService.deleteItem(id).pipe(
                    tap(() => this.toast.showToast("Обновление дел...")),
                    map(() => getList()),
                    catchError(() => of(isDeleteItem({isLoading: false}))),
                );
            }),
        ),
    );

    changeItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(changeItem),
            switchMap(({item}) => {
                return this.toDoService.changeItem(item).pipe(
                    map((result) => {
                        if (result) this.toast.showToast("Обновление дел...");
                        return result ? getList() : isChangeItem({isLoading: false});
                    }),
                    catchError(() => of(isChangeItem({isLoading: false}))),
                );
            }),
        ),
    );
}