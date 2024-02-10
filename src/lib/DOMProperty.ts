import invariant from './invariant';

function checkMask(value: number, bitmask: number): boolean {
  return (value & bitmask) === bitmask;
}

interface DOMPropertyConfig {
  Properties?: Record<string, number>;
  DOMAttributeNamespaces?: Record<string, string | null>;
  DOMAttributeNames?: Record<string, string>;
  DOMPropertyNames?: Record<string, string>;
  DOMMutationMethods?: Record<string, ((node: Element, value: any) => void) | null>;
  isCustomAttribute?: (attributeName: string) => boolean;
}
type PropertyAttributeInfo = {
  attributeName: string;
  attributeNamespace: string | null; // Update type to allow null values
  propertyName: string;
  mutationMethod: any; // Update with appropriate type
  mustUseProperty: boolean;
  hasBooleanValue: boolean;
  hasNumericValue: boolean;
  hasPositiveNumericValue: boolean;
  hasOverloadedBooleanValue: boolean;
};
type IsCustomAttributeFunction = (attributeName: string) => boolean;
interface DOMPropertyInfo {
  attributeName: string;
  attributeNamespace: string | null;
  propertyName: string;
  mutationMethod: any; // Update this with the correct type
  mustUseProperty: boolean;
  hasBooleanValue: boolean;
  hasNumericValue: boolean;
  hasPositiveNumericValue: boolean;
  hasOverloadedBooleanValue: boolean;
  properties: DOMProperties
}

interface DOMProperties {
  [key: string]: DOMPropertyInfo;
}

const DOMPropertyInjection = {
  MUST_USE_PROPERTY: 0x1,
  HAS_BOOLEAN_VALUE: 0x4,
  HAS_NUMERIC_VALUE: 0x8,
  HAS_POSITIVE_NUMERIC_VALUE: 0x10 | 0x8,
  HAS_OVERLOADED_BOOLEAN_VALUE: 0x20,
  injectDOMPropertyConfig: (domPropertyConfig: DOMPropertyConfig): void => {
    const Injection = DOMPropertyInjection;
    const Properties = domPropertyConfig.Properties || {};
    const DOMAttributeNamespaces = domPropertyConfig.DOMAttributeNamespaces || {};
    const DOMAttributeNames = domPropertyConfig.DOMAttributeNames || {};
    const DOMPropertyNames = domPropertyConfig.DOMPropertyNames || {};
    const DOMMutationMethods = domPropertyConfig.DOMMutationMethods || {};

    if (domPropertyConfig.isCustomAttribute) {
      DOMProperty._isCustomAttributeFunctions.push(domPropertyConfig.isCustomAttribute as never);
    }

    for (const propName in Properties) {
      if (DOMProperty.properties.hasOwnProperty(propName)) {
        invariant(false, `injectDOMPropertyConfig(...): You're trying to inject DOM property '${propName}' which has already been injected. You may be accidentally injecting the same DOM property config twice, or you may be injecting two configs that have conflicting property names.`);
      }

      const lowerCased = propName.toLowerCase();
      const propConfig = Properties[propName];
      if (propConfig === undefined) {
        throw new Error(`Property configuration is missing for ${propName}`);
      }

      const propertyInfo: PropertyAttributeInfo = {
        attributeName: lowerCased,
        attributeNamespace: null,
        propertyName: propName,
        mutationMethod: null,

        mustUseProperty: checkMask(propConfig, Injection.MUST_USE_PROPERTY),
        hasBooleanValue: checkMask(propConfig, Injection.HAS_BOOLEAN_VALUE),
        hasNumericValue: checkMask(propConfig, Injection.HAS_NUMERIC_VALUE),
        hasPositiveNumericValue: checkMask(propConfig, Injection.HAS_POSITIVE_NUMERIC_VALUE),
        hasOverloadedBooleanValue: checkMask(propConfig, Injection.HAS_OVERLOADED_BOOLEAN_VALUE)
      };

      const totalBooleanValues = Number(propertyInfo.hasBooleanValue) + Number(propertyInfo.hasNumericValue) + Number(propertyInfo.hasOverloadedBooleanValue);
      invariant(
        totalBooleanValues <= 1,
        `DOMProperty: Value can be one of boolean, overloaded boolean, or numeric value, but not a combination: ${propName}`
      );

      if (DOMAttributeNames.hasOwnProperty(propName)) {
        const attributeName = DOMAttributeNames[propName];
        propertyInfo.attributeName = attributeName as string;
      }

      if (DOMAttributeNamespaces.hasOwnProperty(propName)) {
        propertyInfo.attributeNamespace = DOMAttributeNamespaces[propName] as string;
      }

      if (DOMPropertyNames.hasOwnProperty(propName)) {
        propertyInfo.propertyName = DOMPropertyNames[propName] as string;
      }

      if (DOMMutationMethods.hasOwnProperty(propName)) {
        propertyInfo.mutationMethod = DOMMutationMethods[propName]!;
      }

      (DOMProperty.properties as { [key: string]: PropertyAttributeInfo })[propName] = propertyInfo;
    }
  }

};

const ATTRIBUTE_NAME_START_CHAR = ':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';

const isDev = (process['env']['NODE_ENV'] as string) !== 'production';

interface DOMProperty {
  ID_ATTRIBUTE_NAME: string;
  ROOT_ATTRIBUTE_NAME: string;
  ATTRIBUTE_NAME_START_CHAR: string;
  ATTRIBUTE_NAME_CHAR: string;
  properties: Record<string, PropertyAttributeInfo>;
  getPossibleStandardName: Record<string, string> | null;
  _isCustomAttributeFunctions: IsCustomAttributeFunction[];
  isCustomAttribute(attributeName: string): boolean;
  injection: typeof DOMPropertyInjection;
}

const DOMProperty: DOMProperty = {
  ID_ATTRIBUTE_NAME: 'data-reactid',
  ROOT_ATTRIBUTE_NAME: 'data-reactroot',
  ATTRIBUTE_NAME_START_CHAR: ATTRIBUTE_NAME_START_CHAR,
  ATTRIBUTE_NAME_CHAR: ATTRIBUTE_NAME_START_CHAR + '\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040',
  properties: {},
  getPossibleStandardName: isDev ? { autofocus: 'autoFocus' } : null,
  _isCustomAttributeFunctions: [],
  isCustomAttribute(attributeName: string): boolean {
    for (let i = 0; i < this._isCustomAttributeFunctions.length; i++) {
      const isCustomAttributeFn = this._isCustomAttributeFunctions[i];
      if (typeof isCustomAttributeFn === 'function' && isCustomAttributeFn(attributeName)) {
        return true;
      }
    }
    return false;
  },
  injection: DOMPropertyInjection
};


export default DOMProperty;
