export enum EStatus {
    InProgress = 'InProgress',
    Completed = 'Completed',
    All = 'All',
}

export const EStatusInfo = {
    [EStatus.All]: {text: "All", value: null},
    [EStatus.Completed]: {text: "Completed", value: true},
    [EStatus.InProgress]: {text: "InProgress", value: false},
}