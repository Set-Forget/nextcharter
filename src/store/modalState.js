import { BehaviorSubject } from "rxjs";

export const modalState$ = new BehaviorSubject({
    open: false,
    payload: null,
    view: null,
    title: "",
    subtitle: "",
    previous: null
});

export function setModalState(state) {
    modalState$.next(state);
}

export function getModalState() {
    return modalState$.getValue();
}

export function closeModal() {
    setModalState({
        open: false,
        payload: getModalState().payload,
        view: getModalState().view,
        title: getModalState().title,
        subtitle: getModalState().subtitle,
        previous: getModalState().previous
    });
}
