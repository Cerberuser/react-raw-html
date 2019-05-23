// tslint:disable:no-console

import { html } from "common-tags";
import "jasmine";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { HTMLComponent } from "../src";

describe("General tests", () => {
    it("should render raw HTML", () => {
        const comp = (
            <HTMLComponent
                rawHTML={html`
                <span>Text</span>
                Text
                <!--Comment-->
                <script>window.__testVar__ = 1;</script>
            `}
            />
        );
        ReactDOM.render(comp, document.body);
        expect((window as any).__testVar__).toBe(1);
    });

});
