<script setup lang="ts">
import "./style.css";
import { register } from "@tauri-apps/plugin-global-shortcut";
import { getCurrentWindow } from "@tauri-apps/api/window";
// window successfully created
// import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";
</script>

<template>
  <main class="">
    <div id="textarea" contenteditable="true" cols="50" />
  </main>
</template>

<script lang="ts">
// Saving
// const focused = await appWindow.isFocused();
// if (focused){
//   console.log('f')
// }


let text: string = "";
let prevText: string = "";
let prevFocused: boolean = false;
let textContent: string = "";
let commandRan: boolean = false




await register("CONTROL + KEYS", (event) => {
  // if focused allow shortcut action!
  if (prevFocused) {
    console.log(`Shortcut ${event.shortcut} triggered`);
    console.log(text)
    commandRan = true;
    invoke("overwrite_file", {
        filepath: "C:/Users/dev/Documents/TextEditorProSoapy/test.txt", text: text
      });
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
  if (contenteditable != null) {

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
