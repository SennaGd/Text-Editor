const text: string = "Hello this is a text \n\n with 2 spaces and \n one space after those 2!!"
const rawText: string = JSON.stringify(text)
const rawNewLine: string = JSON.stringify('\n').slice(1,3)
const textLength: number = text.length


console.log(rawNewLine)
let lastSliceIndex: number = 0;
let firstSliceIndex: number = 0;
for (let i = 0; i < textLength; i++){
    let twoIndexes: string = rawText[i]+rawText[i+1]
    let previousFirstSlice = firstSliceIndex

    if (twoIndexes.slice(0,2) == rawNewLine) {
        firstSliceIndex = i
        if (firstSliceIndex == lastSliceIndex){
            console.log(firstSliceIndex, lastSliceIndex)
        }
        lastSliceIndex = i+2

        
        console.log("First Slice Index: ", firstSliceIndex)
        console.log("Last Slice Index: ", lastSliceIndex)
    }
}

console.log("Slice", rawText.slice(22, 24))


console.log("Text Length: "+textLength)
console.log()