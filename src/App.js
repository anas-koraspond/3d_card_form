import './App.css';
import Gui from './Gui/Gui';
import Card from './Card/Card';
import { storage } from './storage';
import { useState } from 'react';
import { ReloadOutlined } from '@ant-design/icons';
import {
  Button
} from 'antd';
import {onReturnClick} from './Gui/Gui';

function App() {
  const [details, setDetails] = useState({...storage})

  const handleFormChange =(e, attr) => {
    let data = {}

    if (attr === 'card_exp') {
      data = e;
    }else {
      data = e.target.value;
    }
    const copy = {...details};
    copy[attr] = data;
    setDetails(copy);
  }

  
  return (
    <div className="App">
        <Gui className="App_Form"details={{...details}} handleFormChange={(e, attr) => {handleFormChange(e, attr)}}/>
       <div className="App_Frame">
        <Card className="App_Card" card={{...details}}/>
        <Button ghost={true} className="App_Button App_Button--Return" shape="circle" onClick={e => onReturnClick(e)}icon={<ReloadOutlined />} />
      </div>
    </div>
  ); 
}

export default App;
