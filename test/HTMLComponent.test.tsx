// tslint:disable:no-console

import { html } from "common-tags";
import "jasmine";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { HTMLComponent, ScriptBehaviour } from "../src";

function container() {
    return document.querySelector("#container")!;
}

const render = (rawHTML: string, scripts?: ScriptBehaviour) => ReactDOM.render(
    <HTMLComponent rawHTML={rawHTML} onScript={scripts}/>,
    container(),
);

function checkNode<T, C extends new (...args: any[]) => T>(
    node: T,
    klass: C,
    props: { [K in keyof InstanceType<C>]?: InstanceType<C>[K] },
) {
    expect(node.constructor).toBe(klass);
    Object.entries(props).forEach(([name, value]) => expect(node[name as keyof T]).toBe(value));
}

beforeEach(() => document.body.innerHTML = '<div id="container"></div>');

describe("Generally", () => {
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
                    <img
                        src="https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png"
                        alt="GitHub Logo"
                    />
                    Raw HTML React renderer on GitHub
                </a>
                <div id="inner">
                    <span style="align-content: baseline; display: none;">
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

});

describe("Rendering scripts", () => {
    it("should by default render inline scripts as text", () => {
        render(html`
            <script>window.__testVar__ = 1;</script>
        `);
        expect(container().textContent!.trim()).toBe("<script>window.__testVar__ = 1;</script>");
    });

    it("should render inline scripts as text when asked so", () => {
        render(html`
            <script>window.__testVarAsText__ = 1;</script>
        `, "asText");
        expect(container().textContent!.trim()).toBe("<script>window.__testVarAsText__ = 1;</script>");
    });

    it("should execute inline scripts when asked so", () => {
        render(html`
            <script>window.__testVarRun__ = 1;</script>
        `, "run");
        expect((window as any).__testVarRun__).toBe(1);
    });

    it("should omit inline scripts when asked so", () => {
        render(html`
            <script>window.__testVarOmit__ = 1;</script>
        `, "omit");
        expect((window as any).__testVarOmit__).not.toBe(1);
        expect(container().innerHTML.trim()).toBe("");
    });

    it("should error on inline scripts when asked so", () => {
        const renderer = () => render(html`
            <script>window.__testVarError__ = 1;</script>
        `, "error");
        expect(renderer).toThrow();
    });

});
