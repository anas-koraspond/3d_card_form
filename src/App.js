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
import useDeviceDetect from './utils/useDeviceDetect';
function App() {
  const [details, setDetails] = useState({...storage})
  const [collapse, setCollapse] = useState(false);
  const [isMobile, setIsMobile] = useState(useDeviceDetect().isMobile);
  console.log("🚀 ~ file: App.js ~ line 18 ~ App ~ isMobile", isMobile)


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


  const handleCollapse =(show) => {
    isMobile && setCollapse(show);

  }
  
  return (
    <div className="App">
        <Gui className="App_Form"details={{...details}} handleFormChange={(e, attr) => {handleFormChange(e, attr)}} handleCollapse={(show) => {handleCollapse(show)}} collapse={collapse}/>
       <div className="App_Frame">
        <Card className="App_Card" card={{...details}} collapse={collapse}/>
        <Button ghost={true} className="App_Button App_Button--Return" shape="circle" onClick={e => onReturnClick(e)}icon={<ReloadOutlined />} />
      </div>
    </div>
  ); 
}

export default App;
