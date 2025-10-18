import { DestroyRef, inject, Injectable } from "@angular/core";
import { INewToDoItem, IToDoItem } from "../interfaces/interfaces";
import { delay, map, Observable, } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { TStatus } from "../types/types";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class ToDoListService {
    private readonly apiUrl = "/api/todos";
    private destroyRef = inject(DestroyRef);
    list: IToDoItem[] = [];

    constructor(private http: HttpClient) {}

    public getList(): Observable<IToDoItem[]> {
        return this.http.get<IToDoItem[]>(this.apiUrl).pipe(
            takeUntilDestroyed(this.destroyRef), 
            delay(500),
            map((list) => list.map((item) => ({...item, id: +item.id}))),
        );
    }

    public deleteItem(id: number): Observable<boolean> {
        return this.http.delete(`${this.apiUrl}/${id as number}`).pipe(
            takeUntilDestroyed(this.destroyRef), 
            delay(500),
            map((item) => !!item),
        )
    }

    public addItem(item: INewToDoItem, nextId: number): Observable<boolean> {
        const newItem: IToDoItem = {...item, id: nextId, status: "InProgress"};
        return this.http.post<IToDoItem>(this.apiUrl, {...newItem, id: newItem.id.toString()}).pipe(
            takeUntilDestroyed(this.destroyRef), 
            delay(500),
            map((item) => !!item),
        );
    }

    public changeItem(item: IToDoItem): Observable<boolean> {
        return this.http.put<IToDoItem>(`${this.apiUrl}/${item.id}`, item).pipe(
            takeUntilDestroyed(this.destroyRef), 
            delay(500),
            map((item) => !!item),
        );
    }

    public changeItemStatus(id: number, status: TStatus): Observable<boolean> {
        return this.http.patch<IToDoItem>(`${this.apiUrl}/${id}`, {status}).pipe(
            takeUntilDestroyed(this.destroyRef), 
            delay(500),
            map((item) => !!item),
        );
    }
}