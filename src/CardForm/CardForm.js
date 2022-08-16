import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  TreeSelect,
} from 'antd';
import React, { useState, useContext } from 'react';
import 'antd/dist/antd.css';
import './CardForm.css';
import moment from 'moment'
import Context from '../context';
import { default as NumberFormat } from 'react-number-format';

// import moment from 'moment';

const CardFormEl = ({children}) => {
  return <div className="CardForm">{children}</div>
} 

export default function Cardform({details,handleFormChange }) {

  const [componentSize, setComponentSize] = useState('default');

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

    return (
        <CardFormEl>
          <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 18,
          }}
          layout="horizontal"
          initialValues={{
            size: componentSize,
          }}
          onValuesChange={onFormLayoutChange}
          size={componentSize}
        >
          <Form.Item label={<label style={{ color: "#fff" }}>Name</label>} rules={[{required: true,message: "Please input your username!"}]}>
            <Input style={{ width: 'calc(50% - 5px)' , margin: '0 5px 0 0' }}  value={details.first_name || ''} onChange={e => handleFormChange(e, 'first_name')}/>
            <Input style={{ width: 'calc(50% - 5px)' , margin: '0 0 0 5px' }}   value={details.last_name || ''} onChange={e => handleFormChange(e, 'last_name')}/>
          </Form.Item>
          <Form.Item label={<label style={{ color: "#fff" }}>Number</label>} rules={[{required: true,message: "Please input your username!"}]}>
            <Input style={{ width: '100%' }} value={details.card_number || ''} onChange={e => handleFormChange(e, 'card_number')}/>
          </Form.Item>
          <Form.Item label={<label style={{ color: "#fff" }}>Valid date</label>} rules={[{required: true,message: "Please input your username!"}]}>
            <DatePicker style={{ width: '100%' }}  value={moment(details.card_exp)  || ''} onChange={e => handleFormChange(e, 'card_exp')}/>
          </Form.Item>
          <Form.Item label={<label style={{ color: "#fff" }}>Sectret</label>} rules={[{required: true,message: "Please input your username!"}]}>
            <InputNumber style={{ width: '100%' }}  value={details.card_secure || ''} onChange={e => handleFormChange(e, 'card_secure')}/>
          </Form.Item>
        </Form>
        </CardFormEl>
  );
  }