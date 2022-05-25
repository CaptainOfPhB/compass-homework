import React, {FC} from 'react';
import {MultiCheck, Option} from './MultiCheck';
import {Showcase} from './Showcase';

const options: Option[] = [
  {label: 'aaa', value: '111',},
  {label: 'bbb', value: '222',},
  {label: 'ccc', value: '333',},
  {label: 'ddd', value: '444',},
  {label: 'eee', value: '555',},
  {label: 'fff', value: '666',},
  {label: 'ggg', value: '777',},
  {label: 'hhh', value: '888',},
  {label: 'iii', value: '999',},
]

// NOTE: Don't modify this file
const App: FC = (): JSX.Element => {
  return <div>
    <h1>Multi Check Component</h1>
    <Showcase allOptions={options}>
      {({label, options, columns, values, onChange, onRender}) =>
        <MultiCheck label={label} options={options}
                    onChange={onChange}
                    values={values}
                    columns={columns}
                    onRender={onRender}
        />
      }
    </Showcase>
  </div>
}

export default App;
