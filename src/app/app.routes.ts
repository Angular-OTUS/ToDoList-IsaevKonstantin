import { Routes } from '@angular/router';

const ROUTE_CONFIG = {
    MAIN: '',
    TASKS: 'tasks',
    NO_PATH: '**',
    TASK_ID: ':id',
} as const;

export const routes: Routes = [
    {
        path: ROUTE_CONFIG.MAIN,
        pathMatch: 'full',
        redirectTo: 'tasks',
    },
    {
        path: ROUTE_CONFIG.TASKS,
        loadComponent: () => import('./components/to-do-list/to-do-list').then((c) => c.ToDoList),
        title: 'main',
        children: [
            {
                path: ROUTE_CONFIG.TASK_ID,
                loadComponent: () => import('./components/to-do-item-view/to-do-item-view').then((c) => c.ToDoItemView),
            }
        ],
    },
    {
        path: ROUTE_CONFIG.NO_PATH,
        redirectTo: 'tasks'
    }
];
