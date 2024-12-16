import React, { useEffect, useState } from "react";

function Testing() {
  //TASK: Create tabs
  const [activeTab, setActiveTab] = useState("")
  useEffect(() => {console.log(activeTab)},[activeTab])
  return (
    <div className="h-screen w-full fixed bg-white top-0 z-[99999] flex justify-center items-center flex-col gap-4">
    <h1 className="text-[1.3em]">THIS PAGE FOR TESTING PURPOSES</h1>

      <div className="flex flex-row gap-4">
        <Tab name="All" activeState={[activeTab, setActiveTab]}/>
        <Tab name="Images" activeState={[activeTab, setActiveTab]}/>
        <Tab name="Videos" activeState={[activeTab, setActiveTab]}/>
      </div>
      <div>
        {activeTab== "All" && <span>{activeTab} Page</span>}
        {activeTab== "Images" && <span>{activeTab} Page</span>}
        {activeTab== "Videos" && <span>{activeTab} Page</span>}
        <iframe src="https://player.vimeo.com/video/962272663?h=9182db1297?autoplay=1&loop=1" width="640" height="360" frameborder="0" allow="autoplay;" ></iframe>
      </div>
    </div>
  );
}


function Tab({name, activeState}){
  const [activeTab, setActiveTab] = activeState;
  const unactiveStyle = "px-2 border-2 border-white rounded-full" 
  const activeStyle = "px-2 border-2 border-slate-900 rounded-full"
  return <span className={`cursor-pointer ${activeTab === name ? activeStyle: unactiveStyle}`} onClick={() => setActiveTab(name)}>{name}</span>
}


export default Testing;
