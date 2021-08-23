import React, { useContext } from 'react';
import { clone } from '../../utils/clone';
import { BuilderFieldOperator } from '../Builder';
import { BuilderContext } from '../Context';

export interface ComponentProps {
  field: string;
  value?: string | string[] | boolean;
  operator?: BuilderFieldOperator;
  id: string;
}

export const Component: React.FC<ComponentProps> = ({
  field: fieldRef,
  value: selectedValue,
  operator,
  id,
}) => {
  const {
    fields,
    data,
    setData,
    onChange,
    components,
    strings,
    readOnly,
  } = useContext(BuilderContext);
  const { Component: ComponentContainer, Remove } = components;

  const handleDelete = () => {
    let clonedData = clone(data);
    const index = clonedData.findIndex((item: any) => item.id === id);
    const parentIndex = clonedData.findIndex(
      (item: any) => item.id === clonedData[index].parent
    );
    const parent = clonedData[parentIndex];

    parent.children = parent.children.filter((item: string) => item !== id);
    clonedData = clonedData.filter((item: any) => item.id !== id);

    setData(clonedData);
    onChange(clonedData);
  };

  if (strings.component) {
    if (fieldRef === '') {
      return (
        <ComponentContainer
          controls={!readOnly && <Remove label="删除" onClick={handleDelete} />}
        ></ComponentContainer>
      );
    } else {
      try {
        return (
          <ComponentContainer
            controls={
              !readOnly && (
                <Remove
                  label={strings.component.delete}
                  onClick={handleDelete}
                />
              )
            }
          >
            {console.log('data', data)}
          </ComponentContainer>
        );
      } catch (e) {
        // tslint:disable-next-line: no-console
        console.error(`Field "${fieldRef}" not found in fields definition.`);
      }
    }
  }

  return null;
};
