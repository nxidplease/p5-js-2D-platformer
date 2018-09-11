let keyMap;

function initKeyMap(){
    keyMap = [];
    keyMap[KeyInput.Left] = LEFT_ARROW;
    keyMap[KeyInput.Right] = RIGHT_ARROW;
    keyMap[KeyInput.Jump] = UP_ARROW;
    keyMap[KeyInput.Down] = DOWN_ARROW;
  }
  
  function getkeyInputs(){
  
    let inputs = []
  
    for(let i = 0; i < KeyInput.InputsAmount; i++){
      let isDown = keyIsDown(keyMap[i]);
      /**
       * Before a key is pressed for the first time keyIsDown returns undefined 
       * when it should be false. This if fixes it, if the function returns false 
       * isDown will be set to false anyway so it doesn't break any logic
       */
      if(!isDown){
        isDown = false;
      }
      inputs[i] = isDown;
    }
  
    return inputs;
  }