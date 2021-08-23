import React, { useContext } from 'react';
import uniqid from 'uniqid';
import { clone } from '../../utils/clone';
import { BuilderGroupValues } from '../Builder';
import { BuilderContext } from '../Context';
import { Menu, Dropdown, Button, Radio } from 'antd';
import {
  PlusOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css';

export interface GroupProps {
  value?: BuilderGroupValues;
  isNegated?: boolean;
  children?: React.ReactNode | React.ReactNodeArray;
  id: string;
  isRoot: boolean;
}

export const Group: React.FC<GroupProps> = ({
  value,
  isNegated,
  children,
  id,
  isRoot,
}) => {
  const { components, data, setData, onChange, strings } = useContext(
    BuilderContext
  );
  const { Group: GroupContainer } = components;
  const relationOptions = ['AND', 'OR'];

  const findIndex = () => {
    const clonedData = clone(data);
    const parentIndex = clonedData.findIndex((item: any) => item.id === id);
    let insertAfter = parentIndex;

    if (data[parentIndex].children && data[parentIndex].children.length > 0) {
      const lastChildren = clonedData[parentIndex].children.slice(-1)[0];
      insertAfter = clonedData.findIndex(
        (item: any) => item.id === lastChildren
      );
    }

    return { insertAfter, parentIndex, clonedData };
  };

  const addItem = (payload: any) => {
    const { insertAfter, parentIndex, clonedData } = findIndex();

    if (!clonedData[parentIndex].children) {
      clonedData[insertAfter].children = [];
    }

    clonedData[parentIndex].children.push(payload.id);
    clonedData.splice(Number(insertAfter) + 1, 0, payload);

    setData(clonedData);
    onChange(clonedData);
  };

  const handleAddGroup = () => {
    const EmptyGroup: any = {
      type: 'GROUP',
      value: 'AND',
      isNegated: false,
      id: uniqid(),
      parent: id,
      children: [],
    };

    addItem(EmptyGroup);
  };

  const handleAddRule = () => {
    const EmptyRule: any = {
      field: '',
      id: uniqid(),
      parent: id,
    };

    addItem(EmptyRule);
  };

  // Add item dropdown menu
  const AddItemMenu = (
    <Menu>
      <Menu.Item onClick={handleAddRule} key="1">
        Key Word
      </Menu.Item>
    </Menu>
  );

  const handleChangeGroupType = (e: { target: { value: any } }) => {
    const { clonedData, parentIndex } = findIndex();
    clonedData[parentIndex].value = e.target.value;

    setData(clonedData);
    onChange(clonedData);
  };

  // const handleChangeRelation = (e: { target: { value: object } }) => {
  //   console.log('radio1 checked', e.target.value);
  // };

  const handleToggleNegateGroup = (nextValue: boolean) => {
    const { clonedData, parentIndex } = findIndex();
    clonedData[parentIndex].isNegated = nextValue;

    setData(clonedData);
    onChange(clonedData);
  };

  const handleDeleteGroup = () => {
    let clonedData = clone(data).filter((item: any) => item.id !== id);

    clonedData = clonedData.map((item: any) => {
      if (item.children && item.children.length > 0) {
        item.children = item.children.filter(
          (childId: string) => childId !== id
        );
      }

      return item;
    });

    setData(clonedData);
    onChange(clonedData);
  };

  if (strings.group) {
    return (
      <GroupContainer
        controlsLeft={
          <>
            {/* <Option
              isSelected={!!isNegated}
              value={!isNegated}
              disabled={readOnly}
              onClick={handleToggleNegateGroup}
              data-test="Option[not]"
            >
              {strings.group.not}
            </Option> */}
            <Radio.Group
              options={relationOptions}
              onChange={handleChangeGroupType}
              value={value}
              optionType="button"
              buttonStyle="solid"
            />
            {/* <Option
              isSelected={value === 'AND'}
              value="AND"
              disabled={readOnly}
              onClick={handleChangeGroupType}
              data-test="Option[and]"
            >
              {strings.group.and}
            </Option>
            <Option
              isSelected={value === 'OR'}
              value="OR"
              disabled={readOnly}
              onClick={handleChangeGroupType}
              data-test="Option[or]"
            >
              {strings.group.or}
            </Option> */}
          </>
        }
        controlsRight={
          <>
            <Dropdown
              overlay={AddItemMenu}
              trigger={['click']}
              placement="bottomCenter"
              arrow
            >
              <Button
                type="primary"
                shape="round"
                size="middle"
                icon={<PlusOutlined />}
              >
                Add Item
              </Button>
            </Dropdown>
            <Button
              type="primary"
              onClick={handleAddGroup}
              shape="round"
              size="middle"
              icon={<PlusCircleOutlined />}
            >
              Add Group
            </Button>

            {!isRoot && (
              <Button
                type="primary"
                danger
                onClick={handleDeleteGroup}
                shape="round"
                icon={<DeleteOutlined />}
                size="middle"
              />
            )}
          </>
        }
      >
        {children}
      </GroupContainer>
    );
  }

  return null;
};
