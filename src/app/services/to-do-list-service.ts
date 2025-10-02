import { DestroyRef, inject, Injectable } from "@angular/core";
import { NewToDoItem, ToDoItem } from "../interfaces/interfaces";
import { delay, map, Observable, of, switchMap, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { isAddItem, isChangeItem, isDeleteItem, isLoadingList } from "../store/to-do-list-store/action";
import { ToastService } from "./toast";

@Injectable({
    providedIn: 'root',
})
export class ToDoListService {
    private destroyRef = inject(DestroyRef);
    
    private list: ToDoItem[] = [
        {id: 0, text: "Проснуться", description: "Завтра рано вставать на работу, поэтому вважно успеть собраться, чтобы придти во ввремя."}, 
        {id: 1, text:  "Купить йогурт", description: "Жена попросила купить йогурт, зайти в магазин после работы."},
    ];

    constructor(
        private store: Store,
        private toast: ToastService,
    ) {}

    public getList(): Observable<ToDoItem[]> {
        return of(true).pipe(
            tap(() => this.store.dispatch(isLoadingList({isLoading: true}))),
            takeUntilDestroyed(this.destroyRef),
            delay(500),
            switchMap(() => of(this.list.sort((a, b) => a.id - b.id))),
            tap(() => {
                this.store.dispatch(isLoadingList({isLoading: false}));
                this.toast.showToast("Дела насущнные получены!");
            }),
        );
    }

    public deleteItem(id: number): Observable<boolean> {
        return of(id).pipe(
            tap(() => this.store.dispatch(isDeleteItem({isLoading: true}))),
            takeUntilDestroyed(this.destroyRef),
            delay(500),
            switchMap((id: number) => {
                if (!this.list.find((item) => item.id === id)) return of(false);
                this.list = this.list.filter((item) => item.id !== id);
                return of(true);
            }),
            tap((result: boolean) => {
                this.store.dispatch(isDeleteItem({isLoading: false}));
                this.toast.showToast(result ? "Дело успешно удалено!" : "Не удалось удалить дело!");
            }),
        );
    }

    public addItem(item: NewToDoItem): Observable<boolean> {
        return of(item).pipe(
            tap(() => this.store.dispatch(isAddItem({isLoading: true}))),
            takeUntilDestroyed(this.destroyRef),
            delay(500),
            switchMap((item: NewToDoItem) => {
                const nextId: number = this.list.length ? Math.max(...this.list.map(item => item.id)) + 1 : 0;
                const newItem = {
                    id: nextId,
                    text: item.text,
                    description: item.description,
                };
                if (!!this.list.find((listItem) => listItem.id === newItem.id)) return of(false);
                this.list = [...this.list, newItem];
                return of(true);
            }),
            tap((result: boolean) => {
                this.store.dispatch(isAddItem({isLoading: false}));
                this.toast.showToast(result ? "Дело успешно добавлено!" : "Не удалось добавить дело!");
            }),
        );
    }

    public changeItem(item: ToDoItem): Observable<boolean> {
        return of(item).pipe(
            tap(() => this.store.dispatch(isChangeItem({isLoading: true}))),
            takeUntilDestroyed(this.destroyRef),
            delay(500),
            switchMap((item: ToDoItem) => {
                const originalItem = this.list.find((listItem: ToDoItem) => listItem.id === item.id);
                if (!originalItem || (originalItem.text === item.text && originalItem.description === item.description)) return of(false);
                this.list = this.list.filter((listItem) => listItem.id !== item.id);
                this.list = [...this.list, item];
                return of(true);
            }),
            tap((result: boolean) => {
                this.store.dispatch(isChangeItem({isLoading: false}));
                this.toast.showToast(result ? "Дело успешно сохранено!" : "Не удалось сохранить дело!");
            }),
        )
    }
}