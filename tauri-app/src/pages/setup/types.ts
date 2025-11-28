export interface INavigate {
    next: () => void;
    back: () => void;
    to: (index: number) => void
}