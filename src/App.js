import logo from './logo.svg';
import './App.css';
import CardForm from './CardForm/CardForm';
import Card from './Card/Card';
import { storage } from './storage';
import { useState } from 'react';
import Context from './context';

// const def = {
//   first_name: 'test',
//   last_name: 'test',
//   card_number: '0000 0000 0000 0000',
//   card_exp: '00/00/0000',
//   card_secure: '000',
//   theme: 1,
// }

function App() {
  const [details, setDetails] = useState({...storage})

  console.log('Details', details)

  const handleFormChange =(e, attr) => {
    console.log(e.target.value, attr)
    const copy = {...details}
    copy[attr] = e.target.value
    setDetails(copy)
  }
  return (
    <div className="App">
      {details ?
       <>
        <Card card={{...details}}/>
        <CardForm details={{...details}} handleFormChange={(e, attr) => {handleFormChange(e, attr)}}/>
      </> : 
      <></>}
    </div>
  );
}

export default App;
