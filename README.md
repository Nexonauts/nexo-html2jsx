

#  Nexo html2jsx

The **Nexo html2jsx** Converter is an npm package designed to facilitate the conversion of HTML strings into JSX syntax. It provides a versatile toolset for developers working with HTML-based content who need to integrate it seamlessly into React applications.

## Features

- **Conversion**: Convert HTML strings into JSX syntax, preserving structure and attributes.
- **Customization**: Configure the conversion process with options for component creation, indentation, and comment handling.
- **Style Parsing**: Automatically convert CSS styles into JSX-compatible format.
- **DOM Environment**: Utilize the `JSDOM` package to create a lightweight DOM environment in Node.js for conversion.

## Installation

To install the  Nexo html2jsx, simply run:

```
npm i nexo-html2jsx
```

## Usage

```typescript
import HTMLtoJSX, { configType } from 'nexo-html2jsx';

// Configure conversion options
const config: configType = {
    createClass: true,
    outputComponentName: 'MyComponent',
    indent: '\t',
    hideComment: false,
    createFunction: false
};
    
// Initialize HTML to JSX converter
const converter = htmlToJsx(createElement);

// Convert HTML string to JSX
const jsxString = converter(config).convert('<div class="example">Hello, World!</div>');

console.log(jsxString);
```

## Configuration Options

- **createClass**: Set to `true` to create a React class component, or `false` to create a function component. Default is `false`.
- **outputComponentName**: Specify the name of the output component. Default is `'MyNexoComponent'`.
- **indent**: Choose the indentation style for the generated JSX code. Default is `'\t'`.
- **hideComment**: Set to `true` to hide HTML comments in the converted JSX. Default is `false`.
- **createFunction**: Set to `true` to create a function component, or `false` to create a class component. Default is `true`.


## Issues

If you encounter any issues or have suggestions for improvement, please [open an issue](https://github.com/Nexonauts/nexo-html2jsx/issues) on GitHub.




  

