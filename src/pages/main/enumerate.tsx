const Enumerate = () => {
  <div className="flex h-screen flex-row gap-6">
    <div className="flex flex-col p-6 flex-1 items-center">
      {/* This is the main content area of the page */}
      <div className="w-full max-w-5xl flex flex-col gap-4"></div>
    </div>

    {/* This is the sidebar for usage information */}
    <div className="hidden 2xl:block bg-panel w-[26rem] transition-all duration-500"></div>
  </div>;
};
export default Enumerate;
