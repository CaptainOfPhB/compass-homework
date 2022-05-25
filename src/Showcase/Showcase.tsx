import React, {FC, useCallback, useState} from 'react';
import {Button, Space, Card, message} from 'antd';
import {Props as MultiCheckProps, Option} from '../MultiCheck';
import 'antd/dist/antd.css';
import {LabelValue} from './LabelValue';
import {sampleSize, sample} from 'lodash';

type FormData = MultiCheckProps & { version: number };

type Props = {
  allOptions: Option[],
  children: (props: MultiCheckProps) => React.ReactNode
}

// NOTE: Don't modify this file
export const Showcase: FC<Props> = ({allOptions, children}) => {
  console.log('### > Showcase')

  const [childrenRenderCount, setChildrenRenderCount] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    options: allOptions,
    version: 0,
    onRender: () => setChildrenRenderCount(n => n + 1)
  });
  const [callbackOptions, setCallbackOptions] = useState<Option[]>();

  function updateFormData(newData: Partial<FormData>): void {
    setFormData(data => ({...data, ...newData, version: data.version + 1}))
  }

  const onChange = useCallback((options: Option[]) => {
    if (formData.onChange) {
      setCallbackOptions(options);
      formData.onChange(options);
    }
  }, [formData]);

  return <Space>
    <Space direction="vertical">
      <Card title={"Adjust properties"}>
        <Space direction="vertical">
          <LabelValue label="label">
            <Button
              onClick={() => updateFormData({label: sample([undefined, '', `MultiCheck-${Date.now()}`])})}>Generate</Button>
          </LabelValue>
          <LabelValue label="options">
            <Button
              onClick={() => updateFormData({options: allOptions.slice(0, Math.max(formData.options.length - 1, 0))})}>-</Button>
            <Button
              onClick={() => updateFormData({options: allOptions.slice(0, formData.options.length + 1)})}>+</Button>
          </LabelValue>
          <LabelValue label="columns">
            <Button onClick={() => updateFormData({columns: undefined})}>undefined</Button>
            <Button onClick={() => updateFormData({columns: (formData.columns ?? 1) - 1})}>-</Button>
            <Button onClick={() => updateFormData({columns: (formData.columns ?? -1) + 1})}>+</Button>
          </LabelValue>
          <LabelValue label="values">
            <Button onClick={() => updateFormData({values: undefined})}>undefined</Button>
            <Button
              onClick={() => updateFormData({values: sampleSize(allOptions.map(it => it.value), (formData.values?.length ?? 1) - 1)})}>-</Button>
            <Button
              onClick={() => updateFormData({values: sampleSize(allOptions.map(it => it.value), (formData.values?.length ?? 1) + 1)})}>+</Button>
          </LabelValue>
          <LabelValue label="onChange">
            <Button onClick={() => updateFormData({onChange: undefined})}>undefined</Button>
            <button onClick={() => updateFormData({
              onChange: (options: Option[]) => {
                updateFormData({values: options.map(it => it.value)});
                message.info(`FormData version when this function was created: ${formData.version}`).then(() => undefined);
              }
            })}>Store selected options
            </button>
          </LabelValue>
          <LabelValue label="FormData version">{formData.version}</LabelValue>
          <LabelValue label="Children render count">{childrenRenderCount} (Should avoid infinite re-rendering)</LabelValue>
        </Space>
      </Card>
      <Card title={'Real properties'}>
        <Space direction="vertical">
          <LabelValue label="label">{String(JSON.stringify(formData.label))}</LabelValue>
          <LabelValue label="options">{String(JSON.stringify(formData.options))}</LabelValue>
          <LabelValue label="columns">{String(JSON.stringify(formData.columns))}</LabelValue>
          <LabelValue label="values">{String(JSON.stringify(formData.values))}</LabelValue>
          <LabelValue label="onChange">{String(JSON.stringify(formData.onChange?.toString()))}</LabelValue>
          <LabelValue label="onRender">{String(JSON.stringify(formData.onRender.toString()))}</LabelValue>
        </Space>
      </Card>
      <Card title={'MultiCheck'}>
        {children({
          ...formData, onChange: onChange
        })}
      </Card>
      <Card title={'Callback options'}>
        {JSON.stringify(callbackOptions)}
      </Card>
    </Space>

  </Space>
}
