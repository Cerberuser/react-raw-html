import * as React from "react";
interface IScriptProps {
    rawTag: HTMLScriptElement;
    loaders: Array<Promise<any>>;
    defer: {
        callback: () => void;
    };
}
export declare class Script extends React.Component<IScriptProps> {
    render(): JSX.Element;
    componentDidMount(): Promise<void>;
}
export {};
