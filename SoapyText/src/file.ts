import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

let filepath: string | null;                                  // func -> openfile (writes) to var 'filepath'
let prev_length_textarea: number = 0;

// puts file-contents to window
export async function openFile() {
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

export async function saveContents(file_contents: string) {
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

export function getWordCount(){
    let words: number = 1;
    let textarea = (<HTMLInputElement>document.getElementById("textarea"));
    let wordcount = document.getElementById("wordCount")
    let newline: string = JSON.stringify("\n")
    newline = newline.slice(1,3)

    

    if(textarea){
        // only check for new indexes
        if (textarea.value.length != prev_length_textarea){
            console.log(textarea.value.length - prev_length_textarea)
        } 
        // update prev_length_textarea
        else {
            prev_length_textarea = textarea.value.length
        }
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