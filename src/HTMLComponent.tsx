import * as React from "react";

export interface HTMLComponentProps {
    rawHTML: string;
}

export class HTMLComponent extends React.Component<HTMLComponentProps> {

    render() {
        this.parseHTML();
        return <div dangerouslySetInnerHTML={{__html: this.props.rawHTML}}/>;
    }

    parseHTML() {
        const div = document.createElement("div");
        div.innerHTML = this.props.rawHTML;
        return div.childNodes;
    }

}
