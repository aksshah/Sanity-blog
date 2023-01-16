function Stage() {
  return (
    <div className="bg-medium-yellow border-b border-black h-1/4">
      <div className="py-5 px-5 mx-auto max-w-7xl flex justify-between">
        <div className="flex flex-col justify-center space-y-5">
          <h1 className="text-8xl max-w-xl font-serif">Stay curious.</h1>
          <h2 className="text-xl">
            Discover stories, thinking, and expertise from writers on any topic.
          </h2>
        </div>
        <div className="hidden md:flex w-fit">
          <img src="./medium.svg" alt="Medium Art" />
        </div>
      </div>
    </div>
  )
}

export default Stage
