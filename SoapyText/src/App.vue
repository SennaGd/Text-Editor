<script setup lang="ts">
// local imports
import "./style.css";
import { unraw } from "./unraw.ts";

// package imports
import { getCurrentWindow } from "@tauri-apps/api/window";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

let textareas = document.getElementsByTagName("textarea"); // Tag textarea EVERY TEXTAREA
let count = textareas.length; // length of textarea's text
</script>

<template>
  <main class="main">
    <div id="header">
      <button id="headerButton" @click="openFile()">Open</button>  
    </div>

    <div id="container">
      <p name="linecount" id="linecount">1 <br>2</p>
      <textarea id="textarea"></textarea>


    </div>

    <div id="footer">
      <p id="selectedFile">No file opened.</p>
    </div>
  </main>
</template>

<script lang="ts">
  //-------------------------------------------- Variables -------------------------------------------\\
  // file vars
  let filepath: string | null;                                  // func -> openfile (writes) to var 'filepath'

  // window vars | unused currently
  const focused = getCurrentWindow().isFocused();               // window focused state
  let window_focused: boolean = false;                          // window focused status

  // input vars | eventlisteners
  let prev_key: string = ""                                     // previous key value | used to check new_key -> prev_key


  //--------------------------------------------- Logic ---------------------------------------------\\
  
  // puts file-contents to window
  async function openFile() {
    let selectedFile = document.getElementById("selectedFile")
    let textarea = (<HTMLInputElement>document.getElementById("textarea"));
    // assign filepath
    try {
      filepath = await getFilepath()

      if (selectedFile && filepath != null) {
        let fetched_file_data: Promise<string | null> = invoke("read_file", {
          filepath: filepath,
        });
        selectedFile.innerText = `Opened: ${filepath}.`
        
        fetched_file_data.then((retrieved_text) => {
      
        // check if opened file's text is valid
        if (retrieved_text != null && textarea) {
          textarea.value = retrieved_text;
        }
      });
      } 
    } 

    catch(error){
      console.error("")
    }
  } 

  async function getFilepath(): Promise<string | null> {
    // open file explorer | fetch filepath
    let fetchedFilepath = await open({
      multiple: false,
      directory: false,
    });
    return fetchedFilepath
  }


  function writeToFile(path: string, contents: string) {
    invoke("overwrite_file", {
      "filepath": path,
      "text": contents,
    })
  }

  async function saveContents(file_contents: string) {
    let selectedFile = document.getElementById("selectedFile")

    if (selectedFile && filepath != null) {
      writeToFile(filepath, file_contents)
      selectedFile.innerText = `Written to: ${filepath}.`
    }
    else {
      try {
        filepath = await getFilepath()
        if (selectedFile && filepath != null) {
          writeToFile(filepath, file_contents)
          selectedFile.innerText = `Written to: ${filepath}.`
        }
      } 
      
      catch(error) {
        if (selectedFile){
          selectedFile.innerText = `Failed to write to: ${filepath}! Please select an existing file.`
        }
      }
    }
  }


  // Reset keys for shortcuts
  onkeyup = (key) => {
    if (key.key == prev_key){
      prev_key = ""
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
    
      textareas.value = behind + "    " + infront
      textareas.selectionStart = textareas.value.length - infront.length
      textareas.selectionEnd = textareas.value.length - infront.length
    };

    // keycode ctrl + s 
    if (key.keyCode == 83 && prev_key == "Control"){   
      console.log("save") 
      saveContents(textareas.value)
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
