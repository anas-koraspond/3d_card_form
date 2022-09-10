import {
  Col,
  DatePicker,
  Button,
  Form,
  Input,
  Row
} from 'antd';
import React, { useState } from 'react';
import './Gui.css';
import moment from 'moment'
import Cleave from 'cleave.js/react';
import { CheckOutlined } from '@ant-design/icons';
import { ReloadOutlined } from '@ant-design/icons';


const GuiElement = ({children, className}) => {
  return <div className={className}>{children}</div>
} 


export default function Gui({details, confirmed, handleFormChange, handleConfirmed}) {
  
  const [componentSize, setComponentSize] = useState('default');

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };


  const onFinish = () => console.log(true);

  const onFinishFailed = (errorInfo) => console.error('Failed:', errorInfo);

    return (

        <GuiElement className={'Gui'}>
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
  {confirmed ? <>
    <Row>
            <Col span={24} className="Gui_Confirmed">
              <div className={'Gui_Icon Gui_Icon--Check'}>
                <CheckOutlined style={{ fontSize: '30px', color: '#ffffff' }}  />
              </div>
              <h2 className="Gui_Header">THANK YOU!</h2>
              <p className="Gui_Info">We've added your card details</p>
            </Col>
          </Row>
          </> : <div className="Gui_Form">
          <Row >
            <Col span={12} > 
              <Form.Item label={'Name'} labelCol={{ span:12 }} name="first_name" rules={[{required: true,message: "Please input your first name!"}]}
                    wrapperCol={{ span: 13 }}><Input maxLength={18} value={details.first_name || ''} onChange={e => handleFormChange(e, 'first_name')}/></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={'Surname'} labelCol={{ span: 10 }} name="last_name" rules={[{required: true,message: "Please input your last name!"}]}
                      wrapperCol={{ span: 12 }}>
                <Input maxLength={18} value={details.last_name || ''} onChange={e => handleFormChange(e, 'last_name')}/>
              </Form.Item>
            </Col>
          </Row>
          <Row >
            <Col span={24} >
            <Form.Item labelCol={{ span: 6 }} name="card_number"  rules={[{required: true,message: "Please input your card number!"}]}
                    wrapperCol={{ span: 17 }} 
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
            <Form.Item labelCol={{ span: 9 }} name="card_exp"
                    wrapperCol={{ span: 14}} label={'Valid date'} rules={[{required: true,message: "Please input your valid date!"}]}>
                      <DatePicker   style={{width: '100%'}} value={moment(details.card_exp)  || ''} onChange={e => handleFormChange(e, 'card_exp')} format="DD/MM/YYYY"/>
                    </Form.Item>
            </Col>
            <Col span={8}>
            <Form.Item labelCol={{ span: 9 }} name="card_secure"
                    wrapperCol={{ span: 12 }} label={'CSV'} rules={[{required: true,message: "Please input your CVV!"}]}>
                      <Cleave placeholder="CVV"
                          options={{   blocks: [3],
                            numericOnly: true}}
                          value={details.card_secure || ''} 
                          className={'ant-input'}
                          onChange={e => handleFormChange(e, 'card_secure')} />
                    </Form.Item>
            </Col>
          </Row></div>}


          <Row>
            <Col span={24} className={'Gui_Actions'}>
              {confirmed ? 
              <>
                <Button type={'text'}size={'large'} block={true} htmlType="submit" onClick={() => handleConfirmed(false)}> <div className={'Gui_Icon Gui_Icon--Return'}>
                <ReloadOutlined  style={{ fontSize: '30px', color: '#000000' }}  />
              </div> </Button>  
              </> : <>
                <Button type={'primary'} size={'large'} block={true} className={"Gui_Confirm"} onClick={() => handleConfirmed(true)}>CONFIRM </Button>  
              </>}

            </Col>
          </Row>
        </Form>
        </GuiElement>
  );
  }