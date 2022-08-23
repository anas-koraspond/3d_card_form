import {
  Button,
  Col,
  Cascader,
  DatePicker,
  Form,
  Input,
  Row,
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
          // labelCol={{
          //   span: 4,
          // }}
          // wrapperCol={{
          //   span: 18,
          // }}
          labelAlign="left"
          layout="horizontal"
          initialValues={{
            size: componentSize,
          }}
          onValuesChange={onFormLayoutChange}
          size={componentSize}
        >
          <Row >
  <Col span={12} > 
    <Form.Item label={'Name'} labelCol={{ span:8 }}
          wrapperCol={{ span: 14 }}><Input   value={details.first_name || ''} onChange={e => handleFormChange(e, 'first_name')}/></Form.Item>
  </Col>
  <Col span={12}>
  <Form.Item label={'Surname'} labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}>
    <Input  value={details.last_name || ''} onChange={e => handleFormChange(e, 'last_name')}/>
  </Form.Item>
  </Col>
</Row>
<Row >
  <Col span={24} >
  <Form.Item labelCol={{ span: 4 }}
          wrapperCol={{ span: 19 }}label={'Number'} rules={[{required: true,message: "Please input your username!"}]} format="#### #### #### ####">
            <Input value={details.card_number || ''} onChange={e => handleFormChange(e, 'card_number')}/>
          </Form.Item>

  </Col>
</Row>
<Row>
  <Col span={16}>
  <Form.Item labelCol={{ span: 6 }}
          wrapperCol={{ span: 14}} label={'Valid date'} rules={[{required: true,message: "Please input your username!"}]}>
            <DatePicker   style={{width: '100%'}} value={moment(details.card_exp)  || ''} onChange={e => handleFormChange(e, 'card_exp')} format="DD/MM/YYYY"/>
          </Form.Item>
  </Col>
  <Col span={8}>
  <Form.Item labelCol={{ span: 11 }}
          wrapperCol={{ span: 10 }} label={'Sectret'} rules={[{required: true,message: "Please input your username!"}]}>
            <InputNumber style={{width: '100%'}} value={details.card_secure || ''} onChange={e => handleFormChange(e, 'card_secure')} format="###"/>
          </Form.Item>
  </Col>
</Row>
        </Form>
        </CardFormEl>
  );
  }