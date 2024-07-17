import React from 'react';
import AddPlayerForm from './components/AddPlayerForm';
import PlayerList from "./components/PlayerList";


function App() {
  return (
      <div className="App">
        <AddPlayerForm />
        <PlayerList />
      </div>
  );
}

export default App;