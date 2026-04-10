import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

let filepath: string | null; // func -> openfile (writes) to var 'filepath'

// puts file-contents to window
export async function openFile() {
  let selectedFile = document.getElementById("selectedFile");
  let textarea = <HTMLInputElement>document.getElementById("textarea");
  // assign filepath
  try {
    filepath = await getFilepath();

    if (selectedFile && filepath != null) {
      let fetched_file_data: Promise<string | null> = invoke("read_file", {
        filepath: filepath,
      });

      selectedFile.innerText = `Opened: ${filepath}.`;
      fetched_file_data.then((retrieved_text) => {
        // check if opened file's text is valid
        if (retrieved_text != null && textarea) {
          textarea.value = retrieved_text;
        }
      });
    }
  } catch (error) {
    console.error("");
  }
}

export async function openFolder() {
  try {
    let fetchedFilepath = await open({
      multiple: false,
      directory: true && false,
    });


    
    console.log(fetchedFilepath)
  } 
  catch (err){

  }
}

// invoke from rust | getting filepath
async function getFilepath(): Promise<string | null> {
  // open file explorer | fetch filepath
  let fetchedFilepath = await open({
    multiple: false,
    directory: false,
  });
  return fetchedFilepath;
}



// invoke from rust | writing to file
function writeToFile(path: string, contents: string) {
  invoke("overwrite_file", {
    filepath: path,
    text: contents,
  });
}

// writing file contents
export async function saveContents(file_contents: string) {
  let selectedFile = document.getElementById("selectedFile"); 

  if (selectedFile && filepath != null) {
    writeToFile(filepath, file_contents);
    selectedFile.innerText = `Written to: ${filepath}.`;
  } 
  else {
    try {
      filepath = await getFilepath();

      if (selectedFile && filepath != null) {
        writeToFile(filepath, file_contents);
        selectedFile.innerText = `Written to: ${filepath}.`;
      }
    } 
    catch (error) {
      if (selectedFile) {
        selectedFile.innerText = `Failed to write to: ${filepath}! Please select an existing file.`;
      }
    }
  }
}

// shift + tab for removing line spaces
export function shiftTab(textarea: HTMLTextAreaElement) {
  console.clear()
  if (textarea == null) 
  { return; }


  let cursor: number = textarea.selectionStart
  let text: string = textarea.value
  let line: string = "";
  let start_line_index: number = 0;               // first line starts at index 0
  let end_line_index: number = 0;
  let fetched_start_line: boolean = false
  let fetched_spaces: boolean = false
  let spaces: number = 0

  // // calculate spaces to left from cursor.
  for (let i = cursor-1; i > 0; i--) {
     // start counting from first line
    
    // get starting line
    if (text[i] === "\n" && fetched_start_line == false) {
      start_line_index = i + 1
      fetched_start_line = true
    }
  }

  // read only the line 
  for (let i = start_line_index; i < text.length; i++) {
    if (text[i] !== "\n") {
      if (text[i] === " " && fetched_spaces == false) {
        spaces++
      } else {
        fetched_spaces = true
      }
      line += text[i]
    } else {
      break
    }
  }
  
  if (spaces % 2 == 1 && spaces > 0) {
    textarea.value = textarea.value.replace(line, line.slice(1))
    cursor -= 1
    spaces -= 1

  }

  if (spaces % 2 == 0 && spaces > 0) {
    cursor -= 2
    console.log("e");
    
    
    textarea.value = textarea.value.replace(line, line.slice(2))
    spaces -= 2
  } 

   
  textarea.selectionStart, textarea.selectionEnd = cursor, cursor
  console.table({
    "selected line":line,
    "cursor index":cursor,
    "spaces in line":spaces,
    "first index":start_line_index,
    "end index":end_line_index
  })
}

// export function shiftTab(textarea: HTMLTextAreaElement) {
//   if (textarea) {
//     let text_length = textarea.value.length;
//     let text = textarea.value;
//     let selection = textarea.selectionStart;
//     let right_spaces = 0; // total amount of right spaces to be removed
//     let left_spaces = 0; // total amount of left spaces to be removed
//     let newline_index: number = 0;
//     let new_selection = textarea.selectionStart;
//     let has_removed = false;

//     // check for right spaces
//     for (let i = selection; i < text_length; i++) {
//       if (text[i] === "\n") {
//         newline_index = i;
//       }
//       if (text[i] === " ") {
//         right_spaces++;
//       } 
//       else {
//         break;
//       }
//     }

//     if (newline_index != 0) {
//       // +1 to prevent having the newline in there and accidentally deleteing that
//       newline_index++;
//     }

//     // lines | default
//     let line = textarea.value.slice(selection, selection + right_spaces);
//     let parsed_line = textarea.value.slice(selection, selection + right_spaces);

//     // remove 2 right spaces | even
//     if (right_spaces % 2 == 0 && right_spaces >= 2) {
//       right_spaces -= 2;
//       new_selection - 1;
//       parsed_line = textarea.value.slice(selection, selection + right_spaces);
//       textarea.value = textarea.value.replace(line, parsed_line);
//       has_removed = true
//     }
//     // remove 1 right space | uneven -> even
//     if (right_spaces % 2 != 0 && right_spaces >= 1 && has_removed == false) {
//       right_spaces -= 1;
//       new_selection - 1;
//       parsed_line = textarea.value.slice(selection, selection + right_spaces);
//       textarea.value = textarea.value.replace(line, parsed_line);
//       has_removed = true
//     }

    

//     parsed_line = text.slice(newline_index, selection);
//     for (let i = 0; i < parsed_line.length; i++) {
//       console.log(parsed_line[i]);
//       if (parsed_line[i] === " ") {
//         left_spaces++;
//       }
//       if (parsed_line[i] !== " ") {
//         break;
//       }
//     }
//     console.log(left_spaces);

    
//     if (left_spaces % 2 == 0 && left_spaces >= 2 && has_removed == false) {
//       textarea.value = textarea.value.replace(
//         parsed_line,
//         parsed_line.slice(2),
//       );
//       new_selection -= 2;
//       has_removed = true
//     }

//     if (left_spaces % 2 != 0 && left_spaces >= 1 && has_removed == false) {
//       textarea.value = textarea.value.replace(
//         parsed_line,
//         parsed_line.slice(1),
//       );
//       new_selection -= 1;
//       has_removed = true
//     }

//     (textarea.selectionStart, (textarea.selectionEnd = new_selection));
//   }
// }

// fetches line count based on newline chars
export function getLineCount() {
  let textarea = <HTMLInputElement>document.getElementById("textarea");
  let line_count = document.getElementById("linecount");
  let lines_amount = 1;
  let lines_string: string = "1\n";
  if (textarea) {
    // only check for new indexes
    for (var i = 0; i < textarea.value.length; i++) {
      if (textarea.value[i] === "\n") {
        lines_amount++;
        lines_string += lines_amount + "\n";
      }
    }
  }

  if (line_count) {
    line_count.innerText = lines_string;
  }
}

// fetches words based on newline or space count
export function getWordCount() {
  let textarea = <HTMLInputElement>document.getElementById("textarea");
  let wordcount = document.getElementById("wordCount");
  var indices = [];
  var total_words = 1;

  if (textarea) {
    // only check for new indexes
    for (var i = 0; i < textarea.value.length; i++) {
      if (textarea.value[i] === "\n" || textarea.value[i] === " ") {
        indices.push(i);
      }
    }

    for (var i = 0; i < indices.length; i++) {
      if (indices[i + 1] != indices[i] + 1) {
        total_words++;
      }
    }
  }
  if (wordcount) {
    wordcount.innerText = String(total_words);
  }
  //     let textarea_value:string = JSON.stringify(textarea.value)
  //     for(let i = 0; i<textarea_value.length; i++) {
  //         if (textarea_value[i] == " ") {
  //             words+=1
  //         }
  //         let indexes: string = textarea_value[i] + textarea_value[i+1]
  //         console.log(newline, indexes)
  //         if (newline == indexes) {
  //             words+=1
  //             console.log("newlines")
  //         }
  //     }

  //     if (wordcount) {
  //         wordcount.innerText = String(words)
  //     }
  // }
}
