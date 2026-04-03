<script setup lang="ts">
// local imports
import "./style.css";
import { unraw } from "./unraw.ts"

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
  const rawNewLines: string = JSON.stringify('\n\n').slice(1,5)
  const rawNewLine: string = JSON.stringify('\n').slice(1,3)

  let inner_text: string = ""            // text fetched from htmlElement 
  let field_text: string = "";          // text of the input field
  let retrieved_text: string = "";      // text retreived from opened_file
  let raw_text: string = "";            // raw var 'field_text' contents
  let opened_file: boolean = false;      // checks if file has been opened
  let window_focused: boolean = false;   // window focused status
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

    // assign file_contents to retrieved_text 
    fetched_file_data.then((file_contents) => {
      if (file_contents != null) {
        opened_file = true;
        retrieved_text = file_contents
      }
    });
  }

  // CTRL + S = SAVE | Write to file
  await register("CONTROL + KEYS", (event) => {
    // if windowFocused | allow shortcut action
    if (window_focused && filepath != null) {
      // overwrite file
      invoke("overwrite_file", {
        filepath: filepath,
        text: field_text,
      });
    }
  });

  // runs every 100 updates.
  setInterval(() => {
    const focused = getCurrentWindow().isFocused();

    // if window is focused : enabled save keybind.
    focused.then((is_focused) => {
      if (is_focused) {
        if (window_focused == false) {
          window_focused = true;
          console.log("focused", is_focused);
        }
      } else {
        window_focused = false;
      }
    });


    let contentEditable = document.getElementById("textarea");

    if (opened_file && contentEditable) {
      contentEditable.innerText = retrieved_text;
      opened_file = false;
    } 


    // set innerText to contentEditable text
    if (contentEditable != null) {
      
      inner_text = contentEditable.innerText // assinging 'innertText' to contents innerText
      
      field_text = inner_text

      raw_text = JSON.stringify(field_text);
      raw_text = raw_text.slice(1, raw_text.length-1) 
      raw_text = raw_text.replaceAll("<div>", "").replaceAll("</div>","")
      raw_text = raw_text.replaceAll(rawNewLines,rawNewLine)
      
    }  

    field_text = unraw(raw_text)


    console.log("Text:" + field_text); // current text


    
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
