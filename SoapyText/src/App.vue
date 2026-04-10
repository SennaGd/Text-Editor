<script setup lang="ts">
// local imports
import "./style.css";
import {saveContents, openFile, getWordCount, getLineCount, shiftTab, openFolder} from "./file.ts";

// package imports
import { getCurrentWindow } from "@tauri-apps/api/window";

</script>

<template>
  <main class="main">
    <div id="header">
      <button id="headerButton" @click="openFile()">Open</button>  
      <button id="headerButton" @click="openFolder()">Folder</button>  
    </div>

    <div id="container">
      <p name="linecount" id="linecount"></p>
      <textarea id="textarea" spellCheck="false">Hello there
  a     e</textarea>


    </div>

    <div id="footer">
      <p id="selectedFile">No file opened.</p>
      <p id="wordCount">0</p>
    </div>
  </main>
</template>

<script lang="ts">




  //----------------------------------------------- TODO ---------------------------------------------\\

  // shift-tab (back-tab) 

  //-------------------------------------------- Variables -------------------------------------------\\
  // window vars | unused currently
  const focused = getCurrentWindow().isFocused();             // window focused state
  let window_focused: boolean = false;                        // window focused status

  // input vars | eventlisteners
  let prev_key: string = ""                                   // previous key value rests after release
  let toggled_shift = false; 


  //----------------------------------------------- INIT ---------------------------------------------\\
  

  //--------------------------------------------- Logic ---------------------------------------------\\

  // Reset keys for shortcuts
  onkeyup = (key) => {
    // prevent accidental shortcuts
    if (key.key == prev_key){
      prev_key = ""
    }
    // toggle shift
    if (key.key == "Shift") {
      toggled_shift = false
    }
    // fetch newlines
    if (key.key == "Enter" || "Backspace"|| "Delete") {
      getLineCount()
    }

    // only fetch word count on "space", "tab", "enter" or "delete"
    if (key.key == "Space" || "Tab"|| "Enter" || "Delete") {
      getWordCount()
    }
  }


  onkeydown = (key) => {
    let textareas = document.querySelector('textarea');
    if (textareas == null) {
      console.error("textarea is null!")
      return;
    }

    let cursorPos = textareas.selectionStart

    // keycode tab
    if (key.keyCode == 9 || key.which == 9) {
      key.preventDefault();
      
      let behind: string = textareas.value.slice(0, cursorPos)
      let infront: string = textareas.value.slice(cursorPos,  textareas.value.length)
      let indices = []
      
      // if not shift + tab | normal tab
      if (toggled_shift == false) {
        textareas.value = behind + "    " + infront
        textareas.selectionStart = textareas.value.length - infront.length
        textareas.selectionEnd = textareas.value.length - infront.length
      } else {
        shiftTab(textareas)
      }
    };

    // keycode ctrl + s 
    if (key.keyCode == 83 && prev_key == "Control"){   
      console.log("save") 
      saveContents(textareas.value)
    }

    if (key.key == "Shift") {
      toggled_shift = true
    }
    prev_key = key.key
    
    

  }

  
</script>



<style>
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;
  background-color: #f6f6f6;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

h1 {
  text-align: center;
}

input,
button {
  border-radius: 8px;
  border: 1px solid transparent;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: #0f0f0f;
  background-color: #ffffff;
  transition: border-color 0.25s;
}

button {
  cursor: pointer;
}

button:hover {
  border-color: #396cd8;
}
button:active {
  border-color: #396cd8;
  background-color: #e8e8e8;
}

input,
button {
  outline: none;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #2f2f2f;
  }

  a:hover {
    color: #24c8db;
  }

  input,
  button {
    color: #ffffff;
    background-color: #0f0f0f98;
  }
  button:active {
    background-color: #0f0f0f69;
  }
}
</style>
