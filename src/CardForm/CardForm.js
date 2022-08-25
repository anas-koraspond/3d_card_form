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
import './CardForm.css';
import moment from 'moment'
import Cleave from 'cleave.js/react';
import {setPreviewBoolean} from '../Card/Card'

const CardFormEl = ({children}) => {
  return <div className="CardForm">{children}</div>
} 

export const onReturnClick = () => {
  const App = document.querySelector('.App_Background');
  const Return = document.querySelector('.App_Button');
  const CardForm = document.querySelector('.CardForm');
  const Card = document.querySelector('.Card');

  Return.classList.remove('App_Button--Show');
  App.classList.add('App_Animate2');
  App.classList.remove('App_Animate');
  CardForm.classList.remove('CardForm_Animate');


  setTimeout(() => {
    CardForm.classList.remove('CardForm_Animate--Back');

    setPreviewBoolean(false);
    App.classList.remove('App_Animate2');
    Card.classList.remove('Center');
    App.classList.remove('Clear');


  }, 500)




}
export default function Cardform({details,handleFormChange }) {
  
  const [componentSize, setComponentSize] = useState('default');
  const [reset, setReset] = useState(false);

  
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const onFinish = (values) => {
    console.log('Success:', values);

    //make animation
    //take box under 3d
    const Card = document.querySelector('.Card');
    const App = document.querySelector('.App_Background');
    const Return = document.querySelector('.App_Button');
    const CardForm = document.querySelector('.CardForm');
    console.log("🚀 ~ file: CardForm.js ~ line 34 ~ onFinish ~ CardForm", CardForm)
    // CardForm.style.top = CardForm.style.top  + 30
    console.log("🚀 ~ file: CardForm.js ~ line 36 ~ onFinish ~ CardForm.style", CardForm.style)
    CardForm.classList.add('CardForm_Animate');
    App.classList.add('App_Animate');
    setTimeout(() => {
      CardForm.classList.add('CardForm_Animate--Back');
      setTimeout(() => {
      CardForm.classList.remove('CardForm_Animate');
      setPreviewBoolean(true);

      setTimeout(() => {
        Return.classList.add('App_Button--Show')
        Card.classList.add('Center');
        App.classList.add('Clear')
      }, 300)

      // CardForm.classList.remove('CardForm_Animate--Back');
      }, 500)
    }, 500)
    

  };


  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
    return (

        <CardFormEl>
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
          wrapperCol={{ span: 14 }}><Input   value={details.first_name || ''} onChange={e => handleFormChange(e, 'first_name')}/></Form.Item>
  </Col>
  <Col span={12}>
  <Form.Item label={'Surname'} labelCol={{ span: 8 }} name="last_name" rules={[{required: true,message: "Please input your last name!"}]}
          wrapperCol={{ span: 14 }}>
    <Input  value={details.last_name || ''} onChange={e => handleFormChange(e, 'last_name')}/>
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
        </CardFormEl>
  );
  }