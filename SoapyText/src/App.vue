<script setup lang="ts">
import "./style.css";
import { register } from "@tauri-apps/plugin-global-shortcut";
import { getCurrentWindow } from "@tauri-apps/api/window";
// window successfully created
// import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";
</script>

<template>
  <main class="main">
    <div id="textarea" contenteditable="true" spellCheck="false"/>
  </main>
</template>

<script lang="ts">
let text: string = "";
let prevText: string = "";

let commandRan: boolean = true
let prevFocused: boolean = false;

//TODO: Select folder
//TODO: 


await register("CONTROL + KEYS", (event) => {
  // if focused allow shortcut action!
  if (prevFocused) {
    console.log(`Shortcut ${event.shortcut} triggered`);
    console.log(text)
    commandRan = true;
    let written_data: Promise<string> = invoke("overwrite_file", {
        filepath: "C:/Test/test.txt", text: text
      });

    written_data.then((iswritten) => {
      console.log("Has Writtens:", text)
    })
    
    let fetched_file_data: Promise<string | null>  = invoke("read_file", {
      filepath: "C:/Test/test.txt"
    });

    fetched_file_data.then((ismade) => {
      if (ismade != null){
        console.log("changed text to: \n", ismade)
        prevText = ismade
      }
    })
  }
});
setInterval(() => {
  const focused = getCurrentWindow().isFocused();
  
  // if focused : enabled ke ybind.
  focused.then((isfocused) => {
    if (isfocused) {
      if (prevFocused == false) {
            prevFocused = true
            console.log("focused",isfocused);
          } 
    } else {
      prevFocused = false;
    }
    
    // register('Fn+LEFT', () => {
    //   console.log('Save Keybind');
    // });
  })


  const contenteditable = document.getElementById("textarea");

  // on command ran
  if (contenteditable != null && commandRan) {
    contenteditable.innerText = text 
    contenteditable
    commandRan = false;
  } 
  if (contenteditable != null && commandRan == false) {

    prevText = contenteditable.innerText;
  } else {
    prevText = "";
    text = "";
  }

  if (text != prevText) {
    text = prevText;

    console.log("Text:" + text);
  }
}, 500);

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
