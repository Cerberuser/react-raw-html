// tslint:disable:no-console

import { html } from "common-tags";
import "jasmine";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { HTMLComponent } from "../src";

function container() {
    return document.querySelector("#container")!;
}

const render = (rawHTML: string) => ReactDOM.render(
    <HTMLComponent rawHTML={rawHTML}/>,
    container(),
);

function checkNode<T, C extends new (...args: any[]) => T>(
    node: T,
    klass: C,
    props: {[K in keyof InstanceType<C>]?: InstanceType<C>[K]},
) {
    expect(node.constructor).toBe(klass);
    Object.entries(props).forEach(([name, value]) => expect(node[name as keyof T]).toBe(value));
}

describe("General tests", () => {
    beforeEach(() => document.body.innerHTML = '<div id="container"></div>');

    it("should shallowly render raw HTML", () => {
        render(html`
            <div>Text in div</div>
            <span>Text in span</span>
        `);
        const nodes = container().children;
        checkNode(nodes[0], HTMLDivElement, {textContent: "Text in div"});
        checkNode(nodes[1], HTMLSpanElement, {textContent: "Text in span"});
    });

    it("should render HTML elements with attributes", () => {
        render(html`
            <div align="right">Text in div</div>
            <span draggable="false">Text in span</span>
            <a href="http://google.com/">Link to Google</a>
        `);
        const nodes = container().children;
        checkNode(nodes[0], HTMLDivElement, {align: "right"});
        checkNode(nodes[1], HTMLSpanElement, {draggable: false});
        checkNode(nodes[2], HTMLAnchorElement, {href: "http://google.com/"});

        // note the difference (trailing slash)
        expect((nodes[2] as HTMLAnchorElement).href).not.toBe("http://google.com");
    });

    it("should render raw HTML two levels deep", () => {
        render(html`
            <div>
                <div id="inner">
                    Text in inner div
                </div>
            </div>
        `);
        const inner = container().querySelector("#inner");
        expect(inner).not.toBeNull();
        expect(inner!.textContent!.trim()).toBe("Text in inner div");
    });

    it("should render raw HTML deeply", () => {
        render(html`
            <div>
                <a id="link" href="https://github.com/Cerberuser/react-raw-html">
                    <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png"/>
                    Raw HTML React renderer on GitHub
                </a>
                <div id="inner">
                    <span style="visibility: hidden;">
                        Hidden text, not for customers' use
                    </span>
                    <b>
                        <i>
                            Highly emphasized text
                        </i>
                    </b>
                </div>
            </div>
        `);
        const inner = container().querySelector("#inner");
        expect(inner).not.toBeNull();
        // TODO write full test
    });

    it("should execute inline scripts", () => {
        render(html`
            <script>window.__testVar__ = 1;</script>
        `);
        expect((window as any).__testVar__).toBe(1);
    });

});
