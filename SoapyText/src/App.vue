<script setup lang="ts">
import "./style.css";
import "./test/StringParser.ts"

import { register } from "@tauri-apps/plugin-global-shortcut";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
</script>

<template>
  <main class="main">
    <div><button @click="openfile">Open File</button></div>
    <p id="textarea" contenteditable="true" spellCheck="false" />
  </main>
</template>

<script lang="ts">
  let text: string = "";                // text inside input field
  let prevText: string = "";            // previous text (prevent multiple prints)         

  let saveCommandRan: boolean = false;  // save-command status
  let prevFocused: boolean = false;     // window focused status
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


  // CTRL + S = SAVE | Write to file
  await register("CONTROL + KEYS", (event) => {
    // if focused allow shortcut action!
    if (prevFocused) {
      console.log(String.raw ``+ text + ``)

      if (filepath != null) {
        invoke("overwrite_file", {
          filepath: filepath,
          text: text,
        });

        console.log("Text: "+text)
        
        saveCommandRan = true;
      }
    }
  });

  // runs every 100 updates.
  setInterval(() => {
    const focused = getCurrentWindow().isFocused();

    // if window is focused : enabled save keybind.
    focused.then((isFocused) => {
      if (isFocused) {
        if (prevFocused == false) {
          prevFocused = true;
          console.log("focused", isFocused);
        }
      } else {
        prevFocused = false;
      }
    });

    // fetch text from text area. 
    const contentEditable = document.getElementById("textarea");

    // if file selected
    if (contentEditable != null && openedFile) {
      contentEditable.innerText = prevText;
      console.log("File Openened")

      openedFile = false
    }
    
    // update prevText
    if (contentEditable != null && saveCommandRan == false) {
      prevText = contentEditable.innerText;
    } 

    if (text != prevText) {
      text = prevText;

      console.log("Text:" + text);
    }
  }, 100);
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
