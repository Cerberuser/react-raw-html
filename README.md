# react-raw-html

## How to?

Simply:

```typescript jsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HTMLComponent } from 'react-raw-html';

const html = `
    <div align="right">Text in div</div>
    <span draggable="false">Text in span</span>
    <a href="http://google.com/">Link to Google</a>
`;
const container = document.querySelector('#container');

ReactDOM.render(<HTMLComponent rawHTML={html}/>, container);
```

## Why?

Because sometimes it is entirely correct to use the server-side rendering to generate pure HTML without any React at all (think Python libraries like [Plotly] or [Bokeh], for example). But the output of these libraries, when used directly in React app, forces one to jump through hoops just to render it *somehow* with all those inline scripts, and even more - to render it correctly and efficiently. This package is intended to incapsulate these "hoops" inside it.

## How?

The approach is fairly simple:
- insert the raw HTML string into DOM object (for example, `<div>`);
- traverse the children of this object;
- convert each child into React element.

### That's all, really?!

Well, there were two main caveats:
- we have to manually convert DOM properties to React ones;
- and what is sometimes more important: the scripts, when inserted by React `<script>` component, won't run automatically.

Although, you shouldn't worry about these cases. I should.

### Will it work in any possible case? Is it production-ready?

It needs to be thoroughly tested, I can't guarantee this for now. And furthermore, there is **no protection from arbitrary scripts execution** yet - it will be added in the stable version. 

[Plotly]: [https://plot.ly/python/]
[Bokeh]: [https://bokeh.pydata.org/en/latest/]