import {
  Col,
  DatePicker,
  Button,
  Form,
  Input,
  Row
} from 'antd';
import React, { useState } from 'react';
import 'antd/dist/antd.css';
import './Gui.css';
import moment from 'moment'
import Cleave from 'cleave.js/react';
import {setPreviewBoolean} from '../Card/Card'
import { onFinishAnimation } from '../Animations/onFinishAnimation';
import { onReturnAnimation } from '../Animations/onReturnAnimation';

const GuiElement = ({children}) => {
  return <div className="Gui">{children}</div>
} 


export const onReturnClick = () => onReturnAnimation(() => setPreviewBoolean(false));

export default function Gui({details,handleFormChange }) {
  
  const [componentSize, setComponentSize] = useState('default');

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };


  const onFinish = () => onFinishAnimation(() => setPreviewBoolean(true));

  const onFinishFailed = (errorInfo) => console.error('Failed:', errorInfo);

    return (

        <GuiElement>
          <Form
          labelAlign="left"
          layout="horizontal"
          initialValues={{
            size: componentSize,
            details: details,
          }}
          onValuesChange={onFormLayoutChange}
          size={componentSize}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          fields={[
            {
              name: ["first_name"],
              value: details.first_name
            },
            {
              name: ["last_name"],
              value: details.last_name
            },
            {
              name: ["card_number"],
              value: details.card_number
            },
            {
              name: ["card_exp"],
              value: moment(details.card_exp)
            },
            {
              name: ["card_secure"],
              value: details.card_secure
            },
          ]}
        >
          <Row >
            <Col span={12} > 
              <Form.Item label={'Name'} labelCol={{ span:8 }} name="first_name" rules={[{required: true,message: "Please input your first name!"}]}
                    wrapperCol={{ span: 14 }}><Input maxLength={18} value={details.first_name || ''} onChange={e => handleFormChange(e, 'first_name')}/></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={'Surname'} labelCol={{ span: 8 }} name="last_name" rules={[{required: true,message: "Please input your last name!"}]}
                      wrapperCol={{ span: 14 }}>
                <Input maxLength={18} value={details.last_name || ''} onChange={e => handleFormChange(e, 'last_name')}/>
              </Form.Item>
            </Col>
          </Row>
          <Row >
            <Col span={24} >
            <Form.Item labelCol={{ span: 4 }} name="card_number"  rules={[{required: true,message: "Please input your card number!"}]}
                    wrapperCol={{ span: 19 }} 
                    label={'Number'} >
                      <Cleave placeholder="Enter your credit card number"
                          options={{creditCard: true,     numericOnly: true}}
                          value={details.card_number || ''} 
                          className={'ant-input'}
                          onChange={e => handleFormChange(e, 'card_number')} />
                    </Form.Item>

            </Col>
          </Row>
          <Row>
            <Col span={16}>
            <Form.Item labelCol={{ span: 6 }} name="card_exp"
                    wrapperCol={{ span: 14}} label={'Valid date'} rules={[{required: true,message: "Please input your valid date!"}]}>
                      <DatePicker   style={{width: '100%'}} value={moment(details.card_exp)  || ''} onChange={e => handleFormChange(e, 'card_exp')} format="DD/MM/YYYY"/>
                    </Form.Item>
            </Col>
            <Col span={8}>
            <Form.Item labelCol={{ span: 11 }} name="card_secure"
                    wrapperCol={{ span: 10 }} label={'Sectret'} rules={[{required: true,message: "Please input your CVV!"}]}>
                      <Cleave placeholder="CVV"
                          options={{   blocks: [3],
                            numericOnly: true}}
                          value={details.card_secure || ''} 
                          className={'ant-input'}
                          onChange={e => handleFormChange(e, 'card_secure')} />
                    </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Button type={'primary'} htmlType="submit">CONFIRM </Button>  
            </Col>
          </Row>
        </Form>
        </GuiElement>
  );
  }