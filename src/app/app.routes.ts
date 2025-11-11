import { Routes } from '@angular/router';

const ROUTE_CONFIG = {
    MAIN: '',
    BACKLOG: 'backlog',
    BOARD: 'board',
    NO_PATH: '**',
    TASK_ID: ':id',
} as const;

export const routes: Routes = [
    {
        path: ROUTE_CONFIG.MAIN,
        loadComponent: () => import('./components/home/home').then((c) => c.Home),
        children: [
            {
                path: ROUTE_CONFIG.MAIN,
                pathMatch: 'full',
                redirectTo: ROUTE_CONFIG.BACKLOG,
            },
            {
                path: ROUTE_CONFIG.BACKLOG,
                loadComponent: () => import('./components/backlog/backlog').then((c) => c.Backlog),
                title: 'Backlog',
                children: [
                    {
                        path: ROUTE_CONFIG.TASK_ID,
                        loadComponent: () => import('./components/to-do-item-view/to-do-item-view').then((c) => c.ToDoItemView),
                    }
                ],
            },
            {
                path: ROUTE_CONFIG.BOARD,
                loadComponent: () => import('./components/board/board').then((c) => c.Board),
                title: 'Board',
            }
        ]
    },
    {
        path: ROUTE_CONFIG.NO_PATH,
        redirectTo: ROUTE_CONFIG.BACKLOG,
    }
];
