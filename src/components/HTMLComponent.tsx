import * as React from "react";
import { unreachable } from "unreachable-ts";
import { Script } from "./Script";

export type ScriptBehaviour = "run" | "omit" | "asText" | "error";

export interface HTMLComponentProps {
    rawHTML: string;
    onScript: ScriptBehaviour;
}

interface IDefer {
    callback: () => void;
    promise: Promise<void>;
}

export class HTMLComponent extends React.Component<HTMLComponentProps> {

    private scriptLoaders: IDefer[] = [];

    static defaultProps = {
        onScript: "asText",
    };

    render() {
        this.scriptLoaders = [];
        return <React.Fragment>{this.parseHTML()}</React.Fragment>;
    }

    private parseHTML() {
        const div = document.createElement("div");
        div.innerHTML = this.props.rawHTML;
        return Array.from(div.childNodes).map(this.mapChild);
    }

    private mapChild = (child: ChildNode, index: number): React.ReactNode => {
        if (child instanceof Element) {
            if (child instanceof HTMLScriptElement) {
                return this.scriptRender(index, child);
            }
            let childComponent;
            switch (child.constructor) {
                case HTMLHtmlElement:
                case HTMLHeadElement:
                case HTMLBodyElement:
                    childComponent = React.Fragment;
                    break;
                case HTMLTitleElement:
                    return null; // don't use it at all
                default:
                    childComponent = child.tagName.toLowerCase();
            }
            const props = {
                children: child.childNodes.length > 0 ? Array.from(child.childNodes).map(this.mapChild) : null,
                key: child.tagName + "-" + index,
                ...this.mapAttributes(child),
            };
            return React.createElement(childComponent, props);
        } else if (child instanceof Text) {
            const text = child.textContent;
            return !text || text.trim() === "" ? null : text;
        } else {
            return "Unknown node";
        }
    };

    private mapAttributes = (child: Element) => {
        const mapAttr = (attr: Attr) => {
            switch (attr.name) {
                case "style":
                    const styleDeclaration = (child as HTMLElement).style;
                    const style = Array.from(styleDeclaration)
                        .reduce((obj, key) => {
                            const newKey = key.replace((/-(.)/g), (match) => match[1].toUpperCase());
                            return ({
                                ...obj,
                                [newKey]: styleDeclaration[key as keyof CSSStyleDeclaration],
                            });
                        }, {});
                    return {style};
                case "class":
                    return {className: attr.value};
                default:
                    return {[attr.name]: attr.value};
            }
        };
        return Array.from(child.attributes).reduce((obj, prop) => ({
            ...obj,
            ...mapAttr(prop),
        }), {});
    };

    private scriptRender = (index: number, script: HTMLScriptElement) => {
        switch (this.props.onScript) {
            case "run":
                const existingLoaders = this.scriptLoaders.map((item) => item.promise);
                const defer = {} as IDefer;
                defer.promise = new Promise((ok) => defer.callback = ok);
                this.scriptLoaders.push(defer);
                return (
                    <Script
                        loaders={existingLoaders}
                        defer={defer}
                        key={"script-" + index}
                        rawTag={script}
                    />
                );
            case "asText":
                return script.outerHTML;
            case "omit":
                return null;
            case "error":
                throw new Error("Script tags are not allowed here");
            default:
                return unreachable(
                    this.props.onScript,
                    "onScript prop value is unexpected: " + JSON.stringify(this.props.onScript),
                );
        }
    };

}
