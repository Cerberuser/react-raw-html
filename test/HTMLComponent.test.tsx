// tslint:disable:no-console

import { html } from "common-tags";
import "jasmine";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { UnreachableError } from "unreachable-ts";
import { HTMLComponent, ScriptBehaviour } from "../src";
import { ErrorBoundary } from "./ErrorBoundary";

function container() {
    return document.querySelector("#container") as HTMLDivElement;
}

const render = (rawHTML: string, scripts?: ScriptBehaviour, onCatch?: (error: Error) => void) => ReactDOM.render(
    <ErrorBoundary onError={onCatch}><HTMLComponent rawHTML={rawHTML} onScript={scripts}/></ErrorBoundary>,
    container(),
);

const loadSelector = async (selector: string) => {
    let element = container().querySelector(selector);
    if (element === null) {
        await skipFrame();
        element = container().querySelector(selector);
    }
    expect(element).not.toBe(null);
    await new Promise((ok) => element!.addEventListener("load", ok));
};
const skipFrame = async () => await new Promise((ok) => setTimeout(ok, 1));

function checkNode<T, C extends new (...args: any[]) => T>(
    node: T,
    klass: C,
    props: { [K in keyof InstanceType<C>]?: InstanceType<C>[K] },
) {
    expect(node.constructor).toBe(klass);
    Object.entries(props).forEach(([name, value]) => expect(node[name as keyof T]).toBe(value));
}

beforeEach(() => {
    document.body.innerHTML = '<div id="container"></div>';
});

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

    it("should render entire page", () => {
        render(html`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Test page</title>
                    <link
                        href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                        rel="stylesheet"
                    />
                </head>
                <body>
                    <div style="width: 100px;">
                        <div id="inner" class="col-6"></div>
                    </div>
                </body>
            </html>
        `);
        const inner = container().querySelector("#inner") as HTMLDivElement;
        expect(inner).not.toBeNull();
        // expect(getComputedStyle(inner).getPropertyValue("width")).toBe("50px"); - TODO
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

describe("Script handling types", () => {
    beforeEach(() => window.onerror = () => {/**/
    });

    it("should by default render inline scripts as text", () => {
        render(html`
            <script>window.__testVar__ = 1;</script>
        `);
        expect((window as any).__testVar__).not.toBeDefined();
        expect(container().textContent!.trim()).toBe("<script>window.__testVar__ = 1;</script>");
    });

    it("should render inline scripts as text when asked so", () => {
        render(html`
            <script>window.__testVarAsText__ = 1;</script>
        `, "asText");
        expect((window as any).__testVarAsText__).not.toBeDefined();
        expect(container().innerText.trim()).toBe("<script>window.__testVarAsText__ = 1;</script>");
    });

    it("should execute inline scripts when asked so", async () => {
        render(html`
            <script id="script">window.__testVarRun__ = 1;</script>
        `, "run");
        await skipFrame();
        expect((window as any).__testVarRun__).toBe(1);
    });

    it("should omit inline scripts when asked so", () => {
        render(html`
            <script>window.__testVarOmit__ = 1;</script>
        `, "omit");
        expect((window as any).__testVarOmit__).not.toBeDefined();
        expect(container().innerHTML.trim()).toBe("");
    });

    it("should error on inline scripts when asked so", () => {
        const onError = jasmine.createSpy();
        render(html`
            <script>window.__testVarError__ = 1;</script>
        `, "error", onError);
        expect(onError).toHaveBeenCalledWith(new Error("Script tags are not allowed here"));
    });

    it("should error on inline scripts if don't know what to do", () => {
        const onError = jasmine.createSpy();
        render(html`
            <script>window.__testVarError__ = 1;</script>
        `, "gibberish" as any, onError);
        expect(onError).toHaveBeenCalledWith(new UnreachableError("onScript prop value is unexpected: \"gibberish\""));
    });

});

describe("Script running types", () => {

    beforeEach(() => {
        if ("$" in window) {
            delete (window as any).$;
        }
    });

    it("should fetch script from the CDN", async () => {
        render(html`
            <div id="test"></div>
            <script id="script" type="text/javascript" src="https://code.jquery.com/jquery-3.4.1.slim.min.js?test1">
            </script>
        `, "run");
        await loadSelector("#script");
        await skipFrame();
        expect((window as any).$).toBeDefined();
        expect((window as any).$("#test")[0]).toBe(container().querySelector("#test"));
    });

    it("should see script from the CDN in the consecutive script tags", async () => {
        render(html`
            <div id="test"></div>
            <script id="script" type="text/javascript" src="https://code.jquery.com/jquery-3.4.1.slim.min.js?test2">
            </script>
            <script id="second-script">$("#test")[0].innerText = "Test text";</script>
        `, "run");
        await loadSelector("#script");
        await skipFrame();
        expect((window as any).$).toBeDefined();
        expect((window as any).$("#test")[0].innerText).toBe("Test text");
    });

    it("should see script from the CDN in the consecutive script from the CDN", async () => {
        render(html`
            <div id="test"></div>
            <script id="script" type="text/javascript" src="https://code.jquery.com/jquery-3.4.1.slim.min.js?test3">
            </script>
            <script
                id="second-script"
                type="text/javascript"
                src="https://cdn.jsdelivr.net/npm/jquery-once@2.2.3/jquery.once.min.js"
            ></script>
            <script id="third-script">$("#test").once("test")[0].innerText = "Test text";</script>
        `, "run");
        await loadSelector("#script");
        await loadSelector("#second-script");
        await skipFrame();
        expect((window as any).$).toBeDefined();
        expect((window as any).$("#test").findOnce("test")[0].innerText).toBe("Test text");
    });

});
