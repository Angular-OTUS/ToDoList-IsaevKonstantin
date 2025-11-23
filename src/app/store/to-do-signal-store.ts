import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { EStatus } from "../enums/status";
import { IChStatusToDoItem, INewToDoItem, ISaveToDoItem, IToDoItem } from "../interfaces/interfaces";
import { ToDoListService } from "../services/to-do-list-service";
import { catchError, EMPTY, of, pipe, switchMap, tap } from "rxjs";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ToastService } from "../services/toast";

interface ToDoListState {
    isLoad: boolean,
    list: IToDoItem[],
    isEdit: boolean,
    isAdd: boolean,
    isDelete: boolean,
    isChange: boolean,
    filterStatus: EStatus.All | EStatus.Completed | EStatus.InProgress,
    newDescription: string;
}

const initialState: ToDoListState = {
    isLoad: false,
    list: [],
    isEdit: false,
    isAdd: false,
    isDelete: false,
    isChange: false,
    filterStatus: EStatus.InProgress,
    newDescription: "",
}

export const toDoStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withMethods((store, toDoService = inject(ToDoListService), toast = inject(ToastService)) => {
    const getListData = () => 
      toDoService.getList().pipe(
        tap((list) => {
          toast.showToast("Дела насущнные получены!");
          patchState(store, { 
            isLoad: false,
            list: [...list].sort((a, b) => a.id - b.id),
          });
        }),
        catchError(() => {
          toast.showToast("Ошибка запроса списка дел!");
          patchState(store, {
            isLoad: false,
            list: [],
          });
          return EMPTY;
        }),
      );

    const updateList = rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { isLoad: true });
          toast.showToast("Обновление дел...");
        }),
        switchMap(() => {
          return getListData();
        }),
      ),
    );

    return {
      updateList,

      loadList: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoad: true })),
          switchMap(() => {
            return getListData();
          }),
        ),
      ),

      changeItemStatus: rxMethod<IChStatusToDoItem>(
        pipe(
          switchMap((item) => {
            if (store.list().find((listItem) => listItem.id === item.id)?.status === item.status) {
              toast.showToast("Статус не изменился!");
              return of(null);
            }
            return toDoService.changeItemStatus(item).pipe(
              tap((result) => {
                if (result) {
                  const newList = [...store.list()].map((listItem) => {
                    if (listItem.id === item.id) return {...listItem, status: item.status};
                    return listItem;
                  });
                  patchState(store, {
                    isEdit: false,
                    list: newList,
                  });
                }
                toast.showToast(result ? "Статус успешно изменен!" : "Не удалось изменить статус!");
              }),
              catchError(() => {
                toast.showToast("Ошибка запроса изменения статуса!");
                patchState(store, {
                  isEdit: false,
                });
                return EMPTY;
              }),
            );
          }),
        ),
      ),

      addItem: rxMethod<INewToDoItem>(
        pipe(
          tap(() => patchState(store, { isAdd: true })),
          switchMap((item) => {
            const nextId: number = store.list().length ? Math.max(...store.list().map(item => item.id)) + 1 : 0;
            return toDoService.addItem(item, nextId).pipe(
              tap((result) => {
                patchState(store, { isAdd: false });
                toast.showToast(result ? "Дело успешно добавлено!" : "Не удалось добавить дело!");
                if (result) {
                  updateList();
                }
              }),
              catchError(() => {
                toast.showToast("Ошибка запроса добавления дела!");
                patchState(store, { isAdd: false });
                return EMPTY;
              }),
            );
          }),
        ),
      ),

      deleteItem: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { isDelete: true })),
          switchMap((id) => {
            return toDoService.deleteItem(id).pipe(
              tap((result) => {
                patchState(store, {
                  isDelete: false,
                  isEdit: false,
                });
                toast.showToast(result ? "Дело успешно удалено!" : "Не удалось удалить дело!");
                if (result) {
                  updateList();
                }
              }),
              catchError(() => {
                toast.showToast("Ошибка запроса удааления дела!");
                patchState(store, { isDelete: false });
                return EMPTY;
              }),
            );
          }),
        ),
      ),

      changeItem: rxMethod<ISaveToDoItem>(
        pipe(
          tap(() => patchState(store, { isChange: true })),
          switchMap((item) => {
            return toDoService.changeItem({...item, description: store.newDescription()}).pipe(
              tap((result) => {
                patchState(store, {
                  isChange: false,
                  isEdit: false,
                });
                toast.showToast(result ? "Дело успешно сохранено!" : "Не удалось изменить дело!");
                if (result) {
                  updateList();
                }
              }),
              catchError(() => {
                toast.showToast("Ошибка запроса изменения дела!");
                patchState(store, { isChange: false });
                return EMPTY;
              }),
            );
          }),
        ),
      ),

      switchStatusFilter(status: EStatus) {
        patchState(store, {
          filterStatus: status,
          isEdit: false,
        });
      },

      isEditItem(isEdit: boolean) {
        patchState(store, { isEdit: isEdit });
      },

      updateDescription(description: string) {
        patchState(store, { newDescription: description });
      },
    }
  }),
  withComputed((store) => ({
    isLoading: computed(() => store.isLoad() || store.isAdd() || store.isChange() || store.isDelete()),

    filteredToDoList: computed(() => { 
      if (store.filterStatus() !== EStatus.All) return store.list().filter((item) => item.status === store.filterStatus());
      return store.list();
    }),
  })),
)

