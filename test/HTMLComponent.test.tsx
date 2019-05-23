// tslint:disable:no-console

import { html } from "common-tags";
import * as React from "react";
import { cleanup, render } from "react-testing-library";
// import renderer from "react-test-renderer";
import { HTMLComponent } from "../src";

beforeEach(() => {
    window.console.log = jest.fn();
});

afterEach(cleanup);

test("Raw HTML renders correctly", () => {
    const comp = (
        <HTMLComponent
            rawHTML={html`
                <span>Text</span>
                Text
                <!--Comment-->
                <script>console.log("Scripted");</script>
            `}
        />
    );

    // const component = renderer.create(comp);
    // const tree = component.toJSON();
    // expect(tree).toMatchSnapshot();

    const dom = render(comp);
    expect(dom.container.firstChild).not.toBeNull();
    expect(window.console.log).toHaveBeenCalledWith("Scripted");
});
