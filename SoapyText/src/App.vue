<script setup lang="ts">
import "./style.css";
import { register } from "@tauri-apps/plugin-global-shortcut";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { open } from "@tauri-apps/plugin-dialog";
// window successfully created
// import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";
</script>

<template>
  <main class="main">
    <div><button @click="openfile">Open File</button></div>
    <p id="textarea" contenteditable="true" spellCheck="false" />
  </main>
</template>

  <script lang="ts">
  let text: string = "";
  let prevText: string = "4";

  let commandRan: boolean = false;
  let prevFocused: boolean = false;
  let selectedNewFile: boolean = false;

  //TODO: Select folder
  //TODO:
  let filepath: string | null;
  async function openfile() {
    // Open explorer.
    filepath = await open({
      multiple: false,
      directory: false,
    });

    let fetched_file_data: Promise<string | null> = invoke("read_file", {
      filepath: filepath,
    });

    fetched_file_data.then((ismade) => {
      if (ismade != null) {
        console.log("changed text to: \n", ismade);
        prevText = ismade;
      }
    });
    selectedNewFile = true;

  }

  await register("CONTROL + KEYS", (event) => {
    // if focused allow shortcut action!
    if (prevFocused) {
      console.log(String.raw ``+ text + ``)
      if (filepath != null) {

        let written_data: Promise<string> = invoke("overwrite_file", {
          filepath: filepath,
          text: text,
        });

        written_data.then((iswritten) => {
          text = iswritten
        });

        let fetched_file_data: Promise<string | null> = invoke("read_file", {
          filepath: filepath,
        });

        fetched_file_data.then((ismade) => {
          if (ismade != null) {
            console.log("T"+text)
            let textLength: number = text.length
            if (textLength >= 2) {
              let slice:string = text.slice(0, 1)

              if (slice == "\n"){
                let newText: string = text.slice(2, textLength)
                console.log(newText)
                text = newText
              }
            }
          }
        });
        commandRan = true;
      }
    }
  });


  setInterval(() => {
    const focused = getCurrentWindow().isFocused();
    // if window is focused : enabled keybind.
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

    const contentEditable = document.getElementById("textarea");

    // if file select
    if (contentEditable != null && selectedNewFile) {
      contentEditable.innerText = prevText;
      console.log("Selectedfiletext: "+ prevText)
      selectedNewFile = false
    }
    // on command ran
    if (contentEditable != null && commandRan) {
      contentEditable.innerText = text;
      commandRan = false;
    }
    // update prevText
    if (contentEditable != null && commandRan == false) {
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
