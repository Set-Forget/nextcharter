import { BehaviorSubject } from "rxjs";

export const dialogState$ = new BehaviorSubject({
    open: false,
    title: "",
    description: "",
    onConfirm: () => { },
});

export function setDialogState(state) {
    dialogState$.next(state);
}

export function getDialogState() {
    return dialogState$.getValue();
}

export function closeDialog() {
    setDialogState({
        open: false,
        title: getDialogState().title,
        description: getDialogState().description,
        onConfirm: () => { },
    });
}
