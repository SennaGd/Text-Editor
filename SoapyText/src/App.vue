<script setup lang="ts">
// local imports
import "./style.css";
import { RemoveDoubleNewLines } from "./StringParser.ts"

// package imports
import { register } from "@tauri-apps/plugin-global-shortcut";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

</script>

<template>
  <main class="main">
    <div><button @click="openfile">Open File</button></div>
    <p id="textarea" contenteditable spellCheck="false" />
  </main>
</template>

<script lang="ts">
  let innerText: string = ""            // text fetched from htmlElement 
  let text: string = "";                // text inside input field
  let prevText: string = "";            // previous text (prevent multiple prints)         
  let field_text: string = "";          // text of the input field
  let previous_field_text: string = ""  // previous text of input field

  let newText: string = "";             // parsed text for writing to file
  let raw_text: string = "";            // raw var 'field_text' contents
  let saveCommandRan: boolean = false;  // save-command status
  let windowFocused: boolean = false;     // window focused status
  let openedFile: boolean = false;      // used for reading the file | if filepath is determined

  let filepath: string | null;          // func -> openfile (writes) to var 'filepath'
  
  // fetches the filepath.
  async function openfile() {
    // open file explorer | fetch filepath 
    filepath = await open({
      multiple: false,
      directory: false,
    });

    // fetch file contents | read file
    let fetched_file_data: Promise<string | null> = invoke("read_file", {
      filepath: filepath,
    });

    // insert text into 'contentEditable' | 
    fetched_file_data.then((fileContents) => {
      if (fileContents != null) {
        console.log("fetched data from: ", filepath);
        console.log("fetched data from: ", fileContents);
        
        // prevText = fileContents;
      }
    });

    openedFile = true;  
  }

  function checkHTMLElement(idName: string) {
    if (document.getElementById(idName) != null){
      return true
    } else {
      return false
    }
  }

  // CTRL + S = SAVE | Write to file
  await register("CONTROL + KEYS", (event) => {
    // if windowFocused | allow shortcut action
    if (windowFocused && filepath != null) {
      // overwrite file
      invoke("overwrite_file", {
        filepath: filepath,
        text: text,
      });
      
      // saveCommandRan = true;
  }});

  // runs every 100 updates.
  setInterval(() => {
    const focused = getCurrentWindow().isFocused();

    // if window is focused : enabled save keybind.
    focused.then((isFocused) => {
      if (isFocused) {
        if (windowFocused == false) {
          windowFocused = true;
          console.log("focused", isFocused);
        }
      } else {
        windowFocused = false;
      }
    });



    const contentEditable = document.getElementById("textarea")

    if (contentEditable != null) {
      field_text = contentEditable.innerHTML
      
      raw_text = JSON.stringify(field_text);
      raw_text = raw_text.slice(1, raw_text.length-1) 
      raw_text = raw_text.replaceAll("<br>", "")
      raw_text = raw_text.replaceAll("<br>", "")
      
      field_text = JSON.parse(raw_text)            // Parsed text
    }

    // check if contentEditable exists
    if (contentEditable != null) {
      innerText = contentEditable.innerText // assinging 'innertText' to contents innerText
    }
    
    // if file selected
<<<<<<< HEAD
    if (openedFile) {
=======
    if (contentEditable != null && openedFile) {
      contentEditable.innerText = field_text;
>>>>>>> 2c3fbb7f9cc22a816d69113ba2870f51b95103d5
      console.log("File Openened")
      innerText = prevText;
      openedFile = false
    }
    
<<<<<<< HEAD
    // update prevText
    // if (saveCommandRan == false) {
      text = RemoveDoubleNewLines(innerText);
    // } 


    console.log("Text:" + JSON.stringify(text)); // current text

  }, 500);
=======

    
  }, 100);
>>>>>>> 2c3fbb7f9cc22a816d69113ba2870f51b95103d5
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
