export function RemoveDoubleNewLines(text:string): string {
    let sliceArray: [any] = [[0,0]]

     let rawText: string = JSON.stringify(text);
    const textLength: number = text.length      
    const rawNewLine: string = JSON.stringify('\n').slice(1,3)

    let firstSliceIndex: number = 0
    let lastSliceIndex: number = 0

    // parses text.
    //
    // Creates sliceArray indexes [ sliceposStart, sliceposEnd ]
    for (let i = 0; i < textLength; i++) {                  
        let twoIndexes: string = rawText[i]+rawText[i+1]    
        firstSliceIndex = i
        lastSliceIndex = i+2

        // check if slice is newLine | append indexes into sliceArray.
        if (twoIndexes.slice(0,2) == rawNewLine) {          
            sliceArray.push([firstSliceIndex, lastSliceIndex])                       
        }
    }

    // Comparing slice[ _, Y ] > nextSlice[ X, _ ] | if (\n == 2)
    for (let i = 0; i < sliceArray.length; i++) {
        if (sliceArray[i+1] != null) {        
            if (sliceArray[i][1] == sliceArray[i+1][0]) {
                console.log(sliceArray[i], sliceArray[i+1])

                // Slices one \n away.
                rawText = rawText.slice(1, sliceArray[i][1]) + rawText.slice(sliceArray[i+1][1])
            }
        }
    }
    



    // console.log("\n"+rawText)
    return text
}

let unparsedText = "Hello this is a text \nwith 2 spaces and \n\none space after those 2!!"
let parsedText = RemoveDoubleNewLines(unparsedText)


