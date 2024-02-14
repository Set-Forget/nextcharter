import { BehaviorSubject } from "rxjs";

export const toastState$ = new BehaviorSubject({
    open: false,
    title: "",
    subtitle: "",
    type: "",
});

export function setToastState(state) {
    toastState$.next(state);
}

export function getToastState() {
    return toastState$.getValue();
}

export function closeToast() {
    setToastState({
        open: false,
        title: getToastState().title,
        subtitle: getToastState().subtitle,
        type: getToastState().type,
    });
}
