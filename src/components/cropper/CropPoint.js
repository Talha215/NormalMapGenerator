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

import React, { useCallback, useRef } from 'react'
import Draggable from 'react-draggable'
import T from 'prop-types'

const buildCropPointStyle = (size, pointBgColor, pointBorder) => ({
  width: size,
  height: size,
  backgroundColor: pointBgColor,
  border: pointBorder,
  borderRadius: '100%',
  position: 'absolute',
  zIndex: 1001
})

const CropPoint = ({
  cropPoints,
  pointArea,
  defaultPosition,
  pointSize,
  pointBgColor = 'transparent',
  pointBorder = '4px solid #3cabe2',
  onStop: externalOnStop,
  onDrag: externalOnDrag,
  bounds
}) => {
  const onDrag = useCallback(
    (_, position) => {
      externalOnDrag(
        {
          ...position,
          x: position.x + pointSize / 2,
          y: position.y + pointSize / 2
        },
        pointArea
      )
    },
    [externalOnDrag]
  )

  const onStop = useCallback(
    (_, position) => {
      externalOnStop(
        {
          ...position,
          x: position.x + pointSize / 2,
          y: position.y + pointSize / 2
        },
        pointArea,
        cropPoints
      )
    },
    [externalOnDrag, cropPoints]
  )
  const nodeRef = useRef(null)
  return (
    <Draggable
      nodeRef = {nodeRef}
      bounds={bounds}
      defaultPosition={defaultPosition}
      position={{
        x: cropPoints[pointArea].x - pointSize / 2,
        y: cropPoints[pointArea].y - pointSize / 2
      }}
      onDrag={onDrag}
      onStop={onStop}
    >
      <div ref={nodeRef} style={buildCropPointStyle(pointSize, pointBgColor, pointBorder)} />
    </Draggable>
  )
}

export default CropPoint

CropPoint.propTypes = {
  cropPoints: T.shape({
    'left-top': T.shape({ x: T.number, y: T.number }).isRequired,
    'right-top': T.shape({ x: T.number, y: T.number }).isRequired,
    'right-bottom': T.shape({ x: T.number, y: T.number }).isRequired,
    'left-bottom': T.shape({ x: T.number, y: T.number }).isRequired
  }),
  pointArea: T.oneOf(['left-top', 'right-top', 'right-bottom', 'left-bottom']),
  defaultPosition: T.shape({
    x: T.number,
    y: T.number
  }),
  pointSize: T.number,
  pointBgColor: T.string,
  pointBorder: T.string,
  onStop: T.func,
  onDrag: T.func
}
