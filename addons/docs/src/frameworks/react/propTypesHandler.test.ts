import { extractProp } from '../../lib2/extractDocgenProps';
import { DocgenInfo } from '../../lib2/types';
import { enhancePropTypesProp } from './propTypesHandler';
import { javaScriptFactory } from '../../lib2/createDocgenPropDef';

const PROP_NAME = 'propName';

function createType(typeName: string, others: Record<string, any> = {}): Record<string, any> {
  return {
    type: {
      name: typeName,
      ...others,
    },
  };
}

function createDocgenInfo(overrides: Record<string, any> = {}): DocgenInfo {
  return {
    type: null,
    required: true,
    description: 'description',
    defaultValue: {
      value: 'default string',
    },
    ...overrides,
  };
}

describe('enhancePropTypesProp', () => {
  describe('custom', () => {
    it("should render raw value when it's available", () => {
      const docgenInfo = createDocgenInfo({
        ...createType('custom', { raw: 'MY_TYPE' }),
        description: undefined,
      });

      const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
      const propDef = enhancePropTypesProp(extractedProp);

      expect(propDef.type).toBe('MY_TYPE');
    });

    it("should render 'custom' when there is no raw value", () => {
      const docgenInfo = createDocgenInfo({
        ...createType('custom'),
        description: undefined,
      });

      const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
      const propDef = enhancePropTypesProp(extractedProp);

      expect(propDef.type).toBe('custom');
    });
  });

  it("should render 'any' when type is any", () => {
    const docgenInfo = createDocgenInfo({
      ...createType('any'),
      description: undefined,
    });

    const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
    const propDef = enhancePropTypesProp(extractedProp);

    expect(propDef.type).toBe('any');
  });

  it("should render 'bool' when type is bool", () => {
    const docgenInfo = createDocgenInfo({
      ...createType('bool'),
      description: undefined,
    });

    const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
    const propDef = enhancePropTypesProp(extractedProp);

    expect(propDef.type).toBe('bool');
  });

  it("should render 'string' when type is string", () => {
    const docgenInfo = createDocgenInfo({
      ...createType('string'),
      description: undefined,
    });

    const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
    const propDef = enhancePropTypesProp(extractedProp);

    expect(propDef.type).toBe('string');
  });

  it("should render 'number' when type is number", () => {
    const docgenInfo = createDocgenInfo({
      ...createType('number'),
      description: undefined,
    });

    const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
    const propDef = enhancePropTypesProp(extractedProp);

    expect(propDef.type).toBe('number');
  });

  it("should render 'object' when type is object", () => {
    const docgenInfo = createDocgenInfo({
      ...createType('object'),
      description: undefined,
    });

    const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
    const propDef = enhancePropTypesProp(extractedProp);

    expect(propDef.type).toBe('object');
  });

  it("should render 'symbol' when type is symbol", () => {
    const docgenInfo = createDocgenInfo({
      ...createType('symbol'),
      description: undefined,
    });

    const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
    const propDef = enhancePropTypesProp(extractedProp);

    expect(propDef.type).toBe('symbol');
  });

  it("should render 'element' when type is element", () => {
    const docgenInfo = createDocgenInfo({
      ...createType('element'),
      description: undefined,
    });

    const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
    const propDef = enhancePropTypesProp(extractedProp);

    expect(propDef.type).toBe('element');
  });

  it("should render 'elementType' when type is elementType", () => {
    const docgenInfo = createDocgenInfo({
      ...createType('elementType'),
      description: undefined,
    });

    const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
    const propDef = enhancePropTypesProp(extractedProp);

    expect(propDef.type).toBe('elementType');
  });

  it('should render the instance type when type is instanceOf', () => {
    const docgenInfo = createDocgenInfo({
      ...createType('instanceOf', { value: 'Set' }),
      description: undefined,
    });

    const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
    const propDef = enhancePropTypesProp(extractedProp);

    expect(propDef.type).toBe('Set');
  });

  describe('enum', () => {
    it('should render the enumerated string values', () => {
      const docgenInfo = createDocgenInfo({
        ...createType('enum', {
          value: [
            {
              value: "'News'",
              computed: false,
            },
            {
              value: "'Photos'",
              computed: false,
            },
          ],
        }),
      });

      const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
      const propDef = enhancePropTypesProp(extractedProp);

      expect(propDef.type).toBe("'News' | 'Photos'");
    });
  });

  describe('func', () => {
    it("should have func as type when the props doesn't have a description", () => {
      const docgenInfo = createDocgenInfo({
        ...createType('func'),
        description: undefined,
      });

      const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
      const propDef = enhancePropTypesProp(extractedProp);

      expect(propDef.description).toBeUndefined();
      expect(propDef.type).toBe('func');
    });

    it('should have func as type when the prop have a description without JSDoc', () => {
      const docgenInfo = createDocgenInfo({
        ...createType('func'),
        description: 'onClick description',
      });

      const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
      const propDef = enhancePropTypesProp(extractedProp);

      expect(propDef.type).toBe('func');
      expect(propDef.description).toBe('onClick description');
    });

    it('should have an empty description when the description only contains JSDoc', () => {
      const docgenInfo = createDocgenInfo({
        ...createType('func'),
        description: '@param event',
      });

      const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
      const propDef = enhancePropTypesProp(extractedProp);

      expect(propDef.description).toBe('');
    });

    describe('when the description contains a @param tag', () => {
      it('should have func as type when it is an invalid @param tag', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@param',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('func');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a func signature with a single arg as type when it is a @param tag with a name', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@param event',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a func signature with a single arg as type when it is a @param tag with a name and a type', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@param {SyntheticEvent} event',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: SyntheticEvent)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a func signature with a single arg as type when it is a @param tag with a name, a type and a desc', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description:
            'onClick description\n@param {SyntheticEvent} event - Original SyntheticEvent',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: SyntheticEvent)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have func as type when it is @param tag without a name 1', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@param - Original SyntheticEvent',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('func');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have func as type when it is @param tag without a name 2', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@param {SyntheticEvent} - Original SyntheticEvent',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('func');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of record type with a single field', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@param {{a: number}} event',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: ({a: number}))');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of record type with multiple fields', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@param {{a: number, b: string}} event',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: ({a: number, b: string}))');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of record type with a field having only a name', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@param {{a}} event',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: ({a}))');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of union type', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@param {(number|boolean)} event',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: (number|boolean))');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of array type', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@param {number[]} event',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: number[])');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of untyped array type', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@param {[]} event',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: [])');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param with a nullable type', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@param {?number} event',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: number)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param with a non nullable type', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@param {!number} event',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: number)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support optional param 1', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@param {number} [event]',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: number)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support optional param 2', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@param {number=} event',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: number)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of type any', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@param {*} event',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: any)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support multilines description when there is a @param', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\nis a\nmulti-lines\ndescription\n@param event',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event)');
        expect(propDef.description).toBe('onClick description\nis a\nmulti-lines\ndescription');
      });

      it('should support multilines @param description', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description:
            'onClick description\n@param event - This is my param\nmultiline description\n@param customData',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event, customData)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should autofix missing space between the param name and the description separator', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description:
            'onClick description\n@param {SyntheticEvent} event- Original SyntheticEvent',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: SyntheticEvent)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should autofix param name ending with . followed by a @returns tag', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@param {SyntheticEvent} event.\n',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: SyntheticEvent)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should provide raw @param tags', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description:
            'onClick description\n@param {SyntheticEvent} event - Original event.\n@param {string} value',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.description).toBe('onClick description');
        expect(propDef.jsDocTags).toBeDefined();
        expect(propDef.jsDocTags.params).toBeDefined();
        expect(propDef.jsDocTags.params[0].name).toBe('event');
        expect(propDef.jsDocTags.params[0].description).toBe('Original event.');
        expect(propDef.jsDocTags.params[1].name).toBe('value');
        expect(propDef.jsDocTags.params[1].description).toBeNull();
      });
    });

    describe('when the description contains multiple @param tags', () => {
      it('should have a func signature with multiple args as type', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description:
            'onClick description\n@param {SyntheticEvent} event\n@param {string} customData',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: SyntheticEvent, customData: string)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should ignore invalid @param tags', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description:
            'onClick description\n@param {SyntheticEvent} event\n@param {string} customData\n@param {SyntheticEvent} - Original event',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: SyntheticEvent, customData: string)');
        expect(propDef.description).toBe('onClick description');
      });
    });

    it('should support @arg alias', () => {
      const docgenInfo = createDocgenInfo({
        ...createType('func'),
        description: 'onClick description\n@arg event',
      });

      const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
      const propDef = enhancePropTypesProp(extractedProp);

      expect(propDef.type).toBe('(event)');
      expect(propDef.description).toBe('onClick description');
    });

    it('should support @argument alias', () => {
      const docgenInfo = createDocgenInfo({
        ...createType('func'),
        description: 'onClick description\n@argument event',
      });

      const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
      const propDef = enhancePropTypesProp(extractedProp);

      expect(propDef.type).toBe('(event)');
      expect(propDef.description).toBe('onClick description');
    });

    describe('when the description contains a @returns tag', () => {
      it('should have func as type when it is an invalid @returns tag', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@returns',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('func');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a func signature with a return type as type when it is a @returns tag with a type', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@returns {string}',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('() => string');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a func signature with a return type as type when it is a @returns tag with a type and a description', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@returns {string} - A custom return type',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('() => string');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have func as type when it is a @returns tag without a type and there is no params.', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@returns - A custom return type',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('func');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have no return type when it is a @returns tag without a type and there is params.', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@param event\n@returns - A custom return type',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a full signature as type when there is a @param and a @returns tag 1', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description:
            'onClick description\n@param {SyntheticEvent} event - Original event.\n@returns {string}',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: SyntheticEvent) => string');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a full signature as type when there is a @param and a @returns tag 2', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description:
            'onClick description\n@param {SyntheticEvent} event - Original event.\n@param {string} customData\n@returns {string}',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('(event: SyntheticEvent, customData: string) => string');
        expect(propDef.description).toBe('onClick description');
      });

      it('should only consider the last @returns tag when there is more than one', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@returns {string}\n@returns {integer}',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('() => integer');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support returns of record type', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@returns {{a: number, b: string}}',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('() => ({a: number, b: string})');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support returns of array type', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@returns {integer[]}',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('() => integer[]');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support returns of union type', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@returns {(number|boolean)}',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('() => (number|boolean)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support returns of type any', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@returns {*}',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('() => any');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support returns of type void', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description: 'onClick description\n@returns {void}',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.type).toBe('() => void');
        expect(propDef.description).toBe('onClick description');
      });

      it('should provide raw @returns tags when a description is defined', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description:
            'onClick description\n@param {SyntheticEvent} event - Original event.\n@returns {string} - An awesome string.',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.description).toBe('onClick description');
        expect(propDef.jsDocTags).toBeDefined();
        expect(propDef.jsDocTags.returns).toBeDefined();
        expect(propDef.jsDocTags.returns.description).toBe('An awesome string.');
      });

      it('should provide raw @returns tags when there is no description', () => {
        const docgenInfo = createDocgenInfo({
          ...createType('func'),
          description:
            'onClick description\n@param {SyntheticEvent} event - Original event.\n@returns {string}',
        });

        const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
        const propDef = enhancePropTypesProp(extractedProp);

        expect(propDef.description).toBe('onClick description');
        expect(propDef.jsDocTags).toBeDefined();
        expect(propDef.jsDocTags.returns).toBeDefined();
        expect(propDef.jsDocTags.returns.description).toBeNull();
      });
    });

    it('should remove extra newline characters between tags', () => {
      const docgenInfo = createDocgenInfo({
        ...createType('func'),
        description:
          'onClick description\n@param {SyntheticEvent} event - Original event.\n     \n     \n     \n@returns {string}',
      });

      const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
      const propDef = enhancePropTypesProp(extractedProp);

      expect(propDef.type).toBe('(event: SyntheticEvent) => string');
      expect(propDef.description).toBe('onClick description');
    });

    it('should ignore unsupported JSDoc tags', () => {
      const docgenInfo = createDocgenInfo({
        ...createType('func'),
        description:
          'onClick description\n@param {SyntheticEvent} event\n@type {number}\n@returns {string}\n@version 2',
      });

      const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
      const propDef = enhancePropTypesProp(extractedProp);

      expect(propDef.type).toBe('(event: SyntheticEvent) => string');
      expect(propDef.description).toBe('onClick description');
    });
  });
});