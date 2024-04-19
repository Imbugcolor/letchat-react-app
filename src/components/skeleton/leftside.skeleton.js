import React from 'react'

const LeftsideSkeletonLoading = () => {
  return (
    <div className="flex flex-col w-2/5 border-r overflow-y-auto">
      {/* <!-- search compt --> */}
      <div className="border-b py-4 px-2 flex">
        <input
          type="text"
          placeholder=""
          className="py-2 px-2 border border-gray-200 rounded-3xl w-full mr-3.5 skeleton"
          disabled
        />
        <button className='add_chat w-11 h-11 flex justify-center items-center skeleton' disabled style={{ padding: '0 22px'}}></button>
      </div>
      {/* <!-- end search compt --> */}

      {/* <!-- user list --> */}
      {[0,1,2,3,4,5,6,7].map((cv) => (
        <div
          className="flex flex-row py-4 px-2 justify-center items-center border-b"
          key={cv}
        >
          <div className="w-1/4 h-12 w-12 rounded-full mr-4">
            <div className="h-12 w-12 rounded-full skeleton">
            </div>
          </div>
          <div className="w-full flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">
                <p className="px-4 text-base leading-7 w-40 h-5 rounded-3xl skeleton"></p>
                <p className="px-4 mt-0.5 text-sm font-normal w-28 h-5 rounded-3xl skeleton"></p>
              </div>
              <span className="px-10 text-gray-500 text-sm rounded-3xl skeleton">
              </span>
        
            </div>
          </div>
        </div>
      ))}

      {/* <!-- end user list --> */}
    </div>
  )
}

export default LeftsideSkeletonLoading
