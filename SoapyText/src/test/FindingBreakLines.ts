let rawNewLines: string = JSON.stringify('\n\n').slice(1,5)
let rawNewLine: string = JSON.stringify('\n').slice(1,3)
let text: string = "Thisisa\ntext but \n\n i \n b \n c"                
let raw_text: string = JSON.stringify(text)
raw_text = raw_text.slice(1, raw_text.length-1) 
raw_text = raw_text.replace(rawNewLines, rawNewLine) 
       
let textSlice: string                              
let newLineFound: number                             


let fixedText:string = ""                           // fixed text result

console.log(
    "Raw Text: ",   raw_text, 
    "\nLength:   ", raw_text.length
)
