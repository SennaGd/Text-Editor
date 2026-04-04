<script setup lang="ts">
// local imports
import "./style.css";
import { unraw } from "./unraw.ts";

// package imports
import { getCurrentWindow } from "@tauri-apps/api/window";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
</script>

<template>
  <main class="main">
    <div id="header">
      <button id="headerButton" @click="openFile()">Open</button>
    </div>
    <div id="container">
      <p id="linecounter"></p>
      <p id="textarea" contenteditable spellCheck="false" />
    </div>
  </main>
</template>

<script lang="ts">
//-------------------------------------------- Variables -------------------------------------------\\
// text parsing vars
const rawNewLines: string = JSON.stringify("\n\n").slice(1, 5);
const rawNewLine: string = JSON.stringify("\n").slice(1, 3);

// input field vars
let inner_text: string = "";                                  // text fetched from htmlElement
let field_text: string = "";                                  // text of the input field
let parsedText: Promise<string>;                              // text that will be saved
let contentEditable = document.getElementById("textarea");    // textarea

// file vars
let filepath: Promise<string | null>;                         // func -> openfile (writes) to var 'filepath'

// window vars
const focused = getCurrentWindow().isFocused();               // window focused state
let window_focused: boolean = false;                          // window focused status

// input vars | eventlisteners
let prevKey: string = ""

//--------------------------------------------- Logic ---------------------------------------------\\

// puts file-contents to window
async function openFile() {
  // assign filepath
  filepath = getFilepath()

  // fetch file contents | read file
  filepath.then(path => {
    let fetched_file_data: Promise<string | null> = invoke("read_file", {
      filepath: path,
    });

    // assign file_contents to retrieved_text
    fetched_file_data.then((file_contents) => {
      contentEditable = document.getElementById("textarea");
      if (file_contents != null && contentEditable) {
        contentEditable.innerText = file_contents;
      }
    });
  })
}

// sets the filepath.
async function getFilepath(): Promise<string | null> {
  // open file explorer | fetch filepath
  let fetchedFilepath = await open({
    multiple: false,
    directory: false,
  });
  return fetchedFilepath
}

// parses text for saving
async function parseText(): Promise<string> {
  let raw_text: string = "";                                    // raw var 'field_text' contents
  
  raw_text = JSON.stringify(field_text);
  raw_text = raw_text.slice(1, raw_text.length - 1);
  raw_text = raw_text.replaceAll("<div>", "").replaceAll("</div>", "");
  raw_text = raw_text.replaceAll(rawNewLines, rawNewLine);

  raw_text = unraw(raw_text);
  return raw_text
}

// fetches the html text (assigns var 'field_text')
onkeydown = (key) => {
  if (prevKey == "Control" && key.key == "s") {
    // get filepath if none
    if (filepath == null) {
      console.log("getting filepath")
      filepath = getFilepath()
    } 

    // parse text contents
    parsedText = parseText();
    parsedText.then(parsed_text => {
      field_text = parsed_text
      console.log("ParsedTEXT")
    })

    // overwrite file
    filepath.then(path => {
      invoke("overwrite_file", {
        filepath: path,
        text: field_text,
      });
    })

  }
  prevKey = key.key

  contentEditable = document.getElementById("textarea");
  if (contentEditable) {
      inner_text = contentEditable.innerText; // assinging 'innertText' to contents innerText
      field_text = inner_text;
  }
}

// // timer
// setInterval(() => {
// }, 1000);


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
