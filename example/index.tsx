import 'react-app-polyfill/ie11';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Builder, BuilderFieldProps } from '../src';
import { colors } from '../src/constants/colors';

const Code = styled.pre`
  margin: 1rem 0;
  padding: 1rem;
  font-size: 0.7rem;
  background: ${colors.light};
  border: 1px solid ${colors.darker};
`;

export const queryTree = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        field: 'IS_IN_CZ',
        value: false,
      },
    ],
  },
];

const App = () => {
  const [output, setOutput] = React.useState(queryTree);
  const [readOnly, setReadOnly] = React.useState(false);

  return (
    <>
      <a href="#" onClick={() => setReadOnly(!readOnly)}>
        Read Only
      </a>
      <Builder data={queryTree} readOnly={readOnly} onChange={setOutput} />

      <h3>Output</h3>
      <Code>{JSON.stringify(output, null, 4)}</Code>
    </>
  );

  // return <div />
};

ReactDOM.render(<App />, document.getElementById('root'));
