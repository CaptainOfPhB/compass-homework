import React, {FC, PropsWithChildren} from 'react';

type Props = {
  label: string,
}

// NOTE: Don't modify this file
export const LabelValue: FC<PropsWithChildren<Props>> = ({label, children}) => {
  return <div>
    <span style={{
      display: 'inline-block',
      width: 200,
      textAlign: 'right',
      marginRight: 5,
      fontWeight: 'bold'
    }}>{label}:</span>
    <span>{children}</span>
  </div>
}
