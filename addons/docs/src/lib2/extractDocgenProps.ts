import { isNil } from 'lodash';
import { PropDef } from '@storybook/components';
import { Component } from '../blocks/shared';
import { ExtractedJsDoc, parseJsDoc } from './jsdocParser';
import { DocgenInfo, TypeSystem } from './types';
import { getDocgenSection, isValidDocgenSection } from './docgenUtils';
import { getPropDefFactory, PropDefFactory } from './createDocgenPropDef';

export interface ExtractedProp {
  propDef: PropDef;
  docgenInfo: DocgenInfo;
  jsDocTags: ExtractedJsDoc;
  typeSystem: TypeSystem;
}

export type ExtractProps = (component: Component, section: string) => ExtractedProp[];

const getTypeSystem = (docgenInfo: DocgenInfo): TypeSystem => {
  if (!isNil(docgenInfo.type)) {
    return TypeSystem.JavaScript;
  }

  if (!isNil(docgenInfo.flowType)) {
    return TypeSystem.Flow;
  }

  if (!isNil(docgenInfo.tsType)) {
    return TypeSystem.TypeScript;
  }

  return TypeSystem.Unknown;
};

export const extractPropsFromDocgen: ExtractProps = (component, section) => {
  const docgenSection = getDocgenSection(component, section);

  if (!isValidDocgenSection(docgenSection)) {
    return [];
  }

  const docgenPropsKeys = Object.keys(docgenSection);
  const typeSystem = getTypeSystem(docgenSection[docgenPropsKeys[0]]);
  const createPropDef = getPropDefFactory(typeSystem);

  return docgenPropsKeys
    .map(propName => {
      const docgenInfo = docgenSection[propName];

      return !isNil(docgenInfo)
        ? extractProp(propName, docgenInfo, typeSystem, createPropDef)
        : null;
    })
    .filter(x => x);
};

export function extractProp(
  propName: string,
  docgenInfo: DocgenInfo,
  typeSystem: TypeSystem,
  createPropDef: PropDefFactory
): ExtractedProp {
  const jsDocParsingResult = parseJsDoc(docgenInfo.description);
  const isIgnored = jsDocParsingResult.propHasJsDoc && jsDocParsingResult.ignore;

  if (!isIgnored) {
    const propDef = createPropDef(propName, docgenInfo, jsDocParsingResult);
    return {
      propDef,
      jsDocTags: jsDocParsingResult.extractedTags,
      docgenInfo,
      typeSystem,
    };
  }

  return null;
}