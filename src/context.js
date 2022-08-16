import React from 'react';
import { storage } from './storage';

const Context = React.createContext({...storage});

export default Context;