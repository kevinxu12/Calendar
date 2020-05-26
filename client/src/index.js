import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware} from 'redux';
import 'mdbreact/dist/css/mdb.css';
import thunk from 'redux-thunk';
import rootReducer from './reducers'
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage'
const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

let store = createStore(persistedReducer, applyMiddleware(thunk))
let persistor = persistStore(store);
ReactDOM.render(<Provider store = {store}> 
<PersistGate loading = {null} persistor = {persistor}>
<App/>
</PersistGate>
</Provider>,
  document.querySelector('#root')
);