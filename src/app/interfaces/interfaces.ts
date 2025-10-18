import { TStatus } from "../types/types";

export interface IToDoItem {
  id: number,
  text: string,
  description: string,
  status: TStatus,
}

export type INewToDoItem = Pick<IToDoItem, "text" | "description">;

export type ISaveToDoItem = Omit<IToDoItem, "description">;

export type IChStatusToDoItem = Pick<IToDoItem, "id" | "status">;
