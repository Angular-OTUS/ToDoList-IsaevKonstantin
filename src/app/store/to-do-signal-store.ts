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
          toast.showToast('TOAST.LOADED_TO_DO_LIST');
          patchState(store, { 
            isLoad: false,
            list: [...list].sort((a, b) => a.id - b.id),
          });
        }),
        catchError(() => {
          toast.showToast('TOAST.LOADED_TO_DO_LIST_ERR');
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
          toast.showToast('TOAST.UPDATING_TO_DO_LIST');
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
              toast.showToast('TOAST.STATUS_NO_CHANGE');
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
                toast.showToast(result ? 'TOAST.STATUS_CHANGES_SUCCESS' : 'TOAST.STATUS_CHANGES_FAILED');
              }),
              catchError(() => {
                toast.showToast('TOAST.STATUS_CHANGES_ERR');
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
                toast.showToast(result ? 'TOAST.ADDED_NEW_TO_DO_SUCCESS' : 'TOAST.ADDED_NEW_TO_DO_FAILED');
                if (result) {
                  updateList();
                }
              }),
              catchError(() => {
                toast.showToast('TOAST.ADDED_NEW_TO_DO_ERR');
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
                toast.showToast(result ? 'TOAST.DELETED_TO_DO_SUCCESS' : 'TOAST.DELETED_TO_DO_FAILED');
                if (result) {
                  updateList();
                }
              }),
              catchError(() => {
                toast.showToast('TOAST.DELETED_TO_DO_ERR');
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
                toast.showToast(result ? 'TOAST.SAVING_TO_DO_SUCCESS' : 'TOAST.SAVING_TO_DO_FAILED');
                if (result) {
                  updateList();
                }
              }),
              catchError(() => {
                toast.showToast('TOAST.SAVING_TO_DO_ERR');
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

