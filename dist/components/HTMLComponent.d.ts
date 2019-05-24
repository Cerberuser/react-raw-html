import * as React from "react";
export interface HTMLComponentProps {
    rawHTML: string;
}
export declare class HTMLComponent extends React.Component<HTMLComponentProps> {
    render(): JSX.Element;
    private parseHTML;
    private mapChild;
    private mapAttributes;
}
