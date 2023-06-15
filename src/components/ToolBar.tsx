import { ChangeEvent, useState } from "react"
import { useSettings } from "../hooks/useSettings";

const ToolBar = () => {
  const { maxZoom, minZoom, updateZoom } = useSettings();


  function handleZoomChange(event: ChangeEvent<HTMLInputElement>): void {
    const value = parseInt(event.target.value);
    const type = event.target.dataset.type;
    updateZoom(type, value);
    if (type === 'min' && value > maxZoom) {
      updateZoom('max', value);
    }
    if (type === 'max' && value < minZoom) {
      updateZoom('min', value);
    }
  }

  return (
    <div className="min-h-full  bg-fuchsia-500/50 p-2 flex flex-col gap-2">
      <h2 className="text-xl font-medium border-b border-black pb-2 text-center">ToolBar</h2>
      <div className="flex flex-col gap-2">
        <h3 className="text-center text-lg font-medium">Zoom</h3>
        <div className="flex gap-2">
          <div className="flex gap-1 items-center">
            <label htmlFor="minZoom">Min</label>
            <input
              className="w-[6ch] text-center p-1 rounded"
              value={minZoom}
              onChange={handleZoomChange}
              type="number"
              name="minZoom"
              data-type="min"
              id="minZoom"
              min="0"
              max="20"
            />
          </div>
          <div className="flex gap-1 items-center">
            <label htmlFor="maxZoom">Max</label>
            <input
              className="w-[6ch] text-center p-1 rounded"
              value={maxZoom}
              onChange={handleZoomChange}
              type="number"
              name="maxZoom"
              data-type="max"
              id="maxZoom"
              min="0"
              max="20"
            />
          </div>
        </div>
      </div>




    </div>
  )
}

export default ToolBar