import * as React from "react";
export declare type ScriptBehaviour = "run" | "omit" | "asText" | "error";
export interface HTMLComponentProps {
    rawHTML: string;
    onScript: ScriptBehaviour;
}
export declare class HTMLComponent extends React.Component<HTMLComponentProps> {
    private scriptLoaders;
    static defaultProps: {
        onScript: string;
    };
    render(): JSX.Element;
    private parseHTML;
    private mapChild;
    private mapAttributes;
    private scriptRender;
}
