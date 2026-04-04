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
      <div name="linecount" id="linecount"></div>
      <p id="textarea" contenteditable spellCheck="false" />
    </div>

    <div id="footer">
      <p id="selectedFile">s</p>
    </div>
  </main>
</template>

<script lang="ts">
//-------------------------------------------- Variables -------------------------------------------\\
// text parsing vars
const raw_newlines: string = JSON.stringify("\n\n").slice(1, 5);
const raw_newline: string = JSON.stringify("\n").slice(1, 3);

// input field vars
let inner_text: string = "";                                  // text fetched from htmlElement
let field_text: string = "";                                  // text of the input field
let parsed_text: Promise<string>;                             // text that will be saved
let content_editable = document.getElementById("textarea");   // textarea

// linecount vars
let line_height: number = 20;                                 // height of each line
let number_of_lines: number;                                  // used to check if there are new lines
let lines_list: string = ""                                   // list containing all lines | written to id: linecount

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
  // assign filepath
  let fetched_path_promise = getFilepath()

  // fetch file contents | read file
  fetched_path_promise.then(path => {
    let fetched_file_data: Promise<string | null> = invoke("read_file", {
      filepath: path,
    });
    // check path type
    if (typeof(path) == "string") {
      filepath = path
      let selectedFile = document.getElementById("selectedFile")
          if (selectedFile) {
            selectedFile.innerText = filepath
          }
    }

    // sets textarea's text to retrieved_text from opened file
    fetched_file_data.then((retrieved_text) => {
      content_editable = document.getElementById("textarea");
      // check if opened file's text is valid
      if (retrieved_text != null && content_editable) {
        content_editable.innerText = retrieved_text;
      }
    });
  })
}


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
  // parse field_text from 'textarea'
  raw_text = JSON.stringify(field_text);
  raw_text = raw_text.slice(1, raw_text.length - 1);
  raw_text = raw_text.replaceAll("<div>", "").replaceAll("</div>", "");
  raw_text = raw_text.replaceAll(raw_newlines, raw_newline);

  raw_text = unraw(raw_text);
  return raw_text
}



  


onkeyup = (key) => {
  // reset ctrl on release
  if (key.key == prev_key) {
    prev_key = ""
    // console.log(prev_key, key.key)
  } 
  content_editable = document.getElementById("textarea");
  if (content_editable) {
    number_of_lines = content_editable.children.length
  }

  // 0 1
  lines_list = "" // reset linesList

  // prevent 0 lines
  if (number_of_lines == 0){
    number_of_lines = 1
  }

  for (let i = 0; i <= number_of_lines; i++) {
    lines_list+=i+1+"\n"
  }
}



onkeydown = (key) => {
  // save keybind
  let selectedFile = document.getElementById("selectedFile")
  if (prev_key == "Control" && key.key == "s") {
    parsed_text = parseText();
    if (filepath == null) {
      let fetched_file_path = getFilepath()
      fetched_file_path.then(result => {
        // only assign filepath if the result is an actual string
        // saves to file | file overwrite
        if (typeof(result) == "string"){
          filepath = result
          console.log(filepath)

          // parse text contents
          parsed_text.then(text => {
            field_text = text
            console.log("ParsedTEXT")
          })

          // overwrite file
          invoke("overwrite_file", {
            filepath: filepath,
            text: field_text,
          });

          // change filepath's 
          
          if (selectedFile) {
            selectedFile.innerText = `Written to: ${filepath}`
          }
        }
      })
    } else {
      invoke(
        "overwrite_file", {
          filepath: filepath,
          text: field_text,
        });
        if (selectedFile) {
            selectedFile.innerText = `Saved to: ${filepath}`
          }
      }
  }

  // update inner_text on every key press
  content_editable = document.getElementById("textarea");
  if (content_editable) {
    inner_text = content_editable.innerText
    field_text = inner_text
    
    number_of_lines = content_editable.children.length

  }
  console.log("key: ", key.key)
  console.log("\nlines"+number_of_lines+"\n\nParsed lines"+number_of_lines)

  // 0 1
  lines_list = "" // reset linesList

  // prevent 0 lines
  if (number_of_lines == 0){
    number_of_lines = 1
  }

  for (let i = 0; i <= number_of_lines; i++) {
    lines_list+=i+1+"\n"
  }
 
  


  let linecount = document.getElementById("linecount");
  if (linecount) {
    linecount.innerText = lines_list
  }  
  
  
  



  prev_key = key.key
}


// fetch line count
// setInterval(() => {
//   content_editable = document.getElementById("textarea");

//   if (set_linecount == false && content_editable != null) {
//     number_of_lines = content_editable.scrollHeight/line_height
//     for (let i = 0; i < number_of_lines/20; i++) {
//       lines_list += i+1+"\n";
//     }  
//     set_linecount = true
//   }
  
//   // stop the loop
//   if (set_linecount) {
//     console.log("clear interval & lines: ", number_of_lines)
//     clearInterval(0)
//   }
// }, 10);
  



// totalLines returned by func 'getLineCount'
// for (let i = 0; i < totalLines/20; i++) {
//       lines_list += i+1+"\n";
//       number_of_lines += 1;
//     }  
// let linecount = document.getElementById("linecount");

// if (linecount != null && set_linecount == false) {
//   console.log(linecount)
//   linecount.innerText = lines_list

//   if (linecount.innerText == lines_list){
//     set_linecount = true
    
//   }
// }




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
