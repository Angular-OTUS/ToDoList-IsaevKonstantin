export enum EStatus {
    InProgress = 'InProgress',
    Completed = 'Completed',
    All = 'All',
}

export const EStatusInfo = {
    [EStatus.All]: {textKey: 'STATUS.ALL', value: null},
    [EStatus.Completed]: {textKey: 'STATUS.COMPLETED', value: true},
    [EStatus.InProgress]: {textKey: 'STATUS.IN_PROGRESS', value: false},
}