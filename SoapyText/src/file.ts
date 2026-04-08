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

async function getFilepath(): Promise<string | null> {
  // open file explorer | fetch filepath
  let fetchedFilepath = await open({
    multiple: false,
    directory: false,
  });
  return fetchedFilepath;
}

function writeToFile(path: string, contents: string) {
  invoke("overwrite_file", {
    filepath: path,
    text: contents,
  });
}

export async function saveContents(file_contents: string) {
  let selectedFile = document.getElementById("selectedFile");

  if (selectedFile && filepath != null) {
    writeToFile(filepath, file_contents);
    selectedFile.innerText = `Written to: ${filepath}.`;
  } else {
    try {
      filepath = await getFilepath();
      if (selectedFile && filepath != null) {
        writeToFile(filepath, file_contents);
        selectedFile.innerText = `Written to: ${filepath}.`;
      }
    } catch (error) {
      if (selectedFile) {
        selectedFile.innerText = `Failed to write to: ${filepath}! Please select an existing file.`;
      }
    }
  }
}

// // removes 2 spaces from left
// export function shiftTab(textarea: HTMLTextAreaElement) {
// //   let char_index: number = 0; // first character after spaces from cursor

//   if (textarea) {

// }

export function shiftTab(textarea: HTMLTextAreaElement) {
  if (textarea) {
    let text_length = textarea.value.length;
    let text = textarea.value;
    let selection = textarea.selectionStart;
    let right_spaces = 0; // total amount of right spaces to be removed
    let left_spaces = 0; // total amount of left spaces to be removed
    let newline_index: number = 0;

    let new_selection = textarea.selectionStart;

    // check for right spaces
    for (let i = selection; i < text_length; i++) {
      if (text[i] === "\n") {
        newline_index = i;
      }
      if (text[i] === " ") {
        right_spaces++;
      } 
      else {
        break;
      }
    }

    if (newline_index != 0) {
      // +1 to prevent having the newline in there and accidentally deleteing that
      newline_index++;
    }

    // lines | default
    let line = textarea.value.slice(selection, selection + right_spaces);
    let parsed_line = textarea.value.slice(selection, selection + right_spaces);

    // remove 2 right spaces | even
    if (right_spaces % 2 == 0 && right_spaces >= 2) {
      right_spaces -= 2;
      new_selection - 1;
      parsed_line = textarea.value.slice(selection, selection + right_spaces);
      textarea.value = textarea.value.replace(line, parsed_line);
    }
    // remove 1 right space | uneven -> even
    if (right_spaces % 2 != 0 && right_spaces >= 1) {
      right_spaces -= 1;
      new_selection - 1;
      parsed_line = textarea.value.slice(selection, selection + right_spaces);
      textarea.value = textarea.value.replace(line, parsed_line);
    }

    

    parsed_line = text.slice(newline_index, selection);
    for (let i = 0; i < parsed_line.length; i++) {
      console.log(parsed_line[i]);
      if (parsed_line[i] === " ") {
        left_spaces++;
      }
      if (parsed_line[i] !== " ") {
        break;
      }
    }
    console.log(left_spaces);

    // console.log(parsed_line, left_spaces)
    if (left_spaces % 2 == 0 && left_spaces >= 2) {
      textarea.value = textarea.value.replace(
        parsed_line,
        parsed_line.slice(2),
      );
      new_selection -= 2;
    }

    if (left_spaces % 2 != 0 && left_spaces >= 1) {
      textarea.value = textarea.value.replace(
        parsed_line,
        parsed_line.slice(1),
      );
      new_selection -= 1;
    }

    (textarea.selectionStart, (textarea.selectionEnd = new_selection));
  }
}

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
