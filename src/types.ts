declare module 'react-dom-core/lib/HTMLDOMPropertyConfig' {
    interface HTMLDOMPropertyConfig {
        // Define the structure of HTMLDOMPropertyConfig if known
        // For example:
        Properties: { [key: string]: string };
        DOMAttributeNames: { [key: string]: string };
        isCustomAttribute(attr: string): boolean;
    }
    const HTMLDOMPropertyConfig: HTMLDOMPropertyConfig;
    export default HTMLDOMPropertyConfig;
}

declare module 'react-dom-core/lib/SVGDOMPropertyConfig' {
    interface SVGDOMPropertyConfig {
        // Define the structure of SVGDOMPropertyConfig if known
        // For example:
        Properties: { [key: string]: string };
        DOMAttributeNames: { [key: string]: string };
        isCustomAttribute(attr: string): boolean;
    }
    const SVGDOMPropertyConfig: SVGDOMPropertyConfig;
    export default SVGDOMPropertyConfig;
}
