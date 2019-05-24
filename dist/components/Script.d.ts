import * as React from "react";
interface IScriptProps {
    rawTag: HTMLScriptElement;
}
export declare class Script extends React.Component<IScriptProps> {
    render(): JSX.Element;
    componentDidMount(): void;
}
export {};
