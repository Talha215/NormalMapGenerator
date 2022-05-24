// Copyright (c) 2020 © Giacomo Cerquone
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
// to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
// and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


export const readFile = (file) => {
  if (file instanceof File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        resolve(reader.result)
      }
      reader.onerror = (err) => {
        reject(err)
      }
      reader.readAsDataURL(file)
    })
  }
  if (typeof file === 'string') {
    return Promise.resolve(file)
  }
}

export const calcDims = (
  width,
  height,
  externalMaxWidth,
  externalMaxHeight
) => {
  const ratio = width / height

  const maxWidth = externalMaxWidth || window.innerWidth
  const maxHeight = externalMaxHeight || window.innerHeight
  const calculated = {
    width: maxWidth,
    height: Math.round(maxWidth / ratio),
    ratio: ratio
  }

  if (calculated.height > maxHeight) {
    calculated.height = maxHeight
    calculated.width = Math.round(maxHeight * ratio)
  }
  return calculated
}
