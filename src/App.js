import './App.css';
import CardForm from './CardForm/CardForm';
import Card from './Card/Card';
import { storage } from './storage';
import { useState } from 'react';
import moment from 'moment';

function App() {
  const [details, setDetails] = useState({...storage})

  const handleFormChange =(e, attr) => {
    let data = {}

    if (attr === 'card_exp') {
      data = moment(e).format('DD/MM/YYYY');
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
       <>
        <Card card={{...details}}/>
        <CardForm details={{...details}} handleFormChange={(e, attr) => {handleFormChange(e, attr)}}/>
      </>
    </div>
  );
}

export default App;
