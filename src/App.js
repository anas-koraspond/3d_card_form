import './App.css';
import CardForm from './CardForm/CardForm';
import Card from './Card/Card';
import { storage } from './storage';
import { useState } from 'react';
import moment from 'moment';
import { ReloadOutlined } from '@ant-design/icons';
import {
  Button
} from 'antd';
import {onReturnClick} from './CardForm/CardForm'
function App() {
  const [details, setDetails] = useState({...storage})

  const handleFormChange =(e, attr) => {
    let data = {}

    if (attr === 'card_exp') {
      console.log(e, moment(e).format('DD/MM/YYYY'))
      data = e
    }else {
      console.log(e.target)
      data = e.target.value;
    }
    const copy = {...details}
    copy[attr] = data;
    setDetails(copy)
  }

  
  return (
    <div className="App">
        <CardForm details={{...details}} handleFormChange={(e, attr) => {handleFormChange(e, attr)}}/>
       <div className="App_Background">
        <Card card={{...details}}/>
        <Button ghost={true} className="App_Button" shape="circle"   onClick={e => onReturnClick(e)}icon={<ReloadOutlined />} />
      </div>
    </div>
  );
}

export default App;
