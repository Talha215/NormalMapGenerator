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


import React, { useCallback, useEffect, useRef } from 'react'
import T from 'prop-types'

const CropPointsDelimiters = ({
  cropPoints,
  previewDims,
  lineWidth = 3,
  lineColor = '#3cabe2',
  pointSize
}) => {
  const canvas = useRef()

  const clearCanvas = useCallback(() => {
    const ctx = canvas.current.getContext('2d')
    ctx.clearRect(0, 0, previewDims.width, previewDims.height)
  }, [canvas.current, previewDims])

  const sortPoints = useCallback(() => {
    const sortOrder = ['left-top', 'right-top', 'right-bottom', 'left-bottom']
    return sortOrder.reduce(
      (acc, pointPos) => [...acc, cropPoints[pointPos]],
      []
    )
  }, [cropPoints])

  const drawShape = useCallback(
    ([point1, point2, point3, point4]) => {
      const ctx = canvas.current.getContext('2d')
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = lineColor

      ctx.beginPath()
      ctx.moveTo(point1.x + pointSize / 2, point1.y)
      ctx.lineTo(point2.x - pointSize / 2, point2.y)

      ctx.moveTo(point2.x, point2.y + pointSize / 2)
      ctx.lineTo(point3.x, point3.y - pointSize / 2)

      ctx.moveTo(point3.x - pointSize / 2, point3.y)
      ctx.lineTo(point4.x + pointSize / 2, point4.y)

      ctx.moveTo(point4.x, point4.y - pointSize / 2)
      ctx.lineTo(point1.x, point1.y + pointSize / 2)
      ctx.closePath()
      ctx.stroke()
    },
    [canvas.current]
  )

  useEffect(() => {
    if (cropPoints && canvas.current) {
      clearCanvas()
      const sortedPoints = sortPoints()
      drawShape(sortedPoints)
    }
  }, [cropPoints, canvas.current])

  return (
    <canvas
      ref={canvas}
      style={{
        position: 'absolute',
        zIndex: 5
      }}
      width={previewDims.width}
      height={previewDims.height}
    />
  )
}

export default CropPointsDelimiters

CropPointsDelimiters.propTypes = {
  previewDims: T.shape({
    ratio: T.number,
    width: T.number,
    height: T.number
  }),
  cropPoints: T.shape({
    'left-top': T.shape({ x: T.number, y: T.number }).isRequired,
    'right-top': T.shape({ x: T.number, y: T.number }).isRequired,
    'right-bottom': T.shape({ x: T.number, y: T.number }).isRequired,
    'left-bottom': T.shape({ x: T.number, y: T.number }).isRequired
  }),
  lineColor: T.string,
  lineWidth: T.number,
  pointSize: T.number
}
