declare class Disposable {
    isDisposed: boolean;
    dispose(): void;
}
declare class Activatable {
    isActive: boolean;
    activate(): void;
}
declare class SmartObject implements Disposable, Activatable {
    isDisposed: boolean;
    dispose: () => void;
    isActive: boolean;
    activate: () => void;
}
declare function applyMixins(derivedCtor: any, baseCtors: any[]): void;
declare let smartObject: SmartObject;
