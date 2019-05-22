import * as React from "react";
import renderer from "react-test-renderer";
import { HTMLComponent } from "../src";

test("Raw HTML renders correctly", () => {
    const component = renderer.create(<HTMLComponent rawHTML="<span>Text</span>"/>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
