const Conversation = () => {
  return (
    <div className="flex items-center gap-2 p-2 hover:bg-gray-700/50 rounded-lg cursor-pointer">
      <div className="avatar avatar-online">
        <div className="w-16 rounded-full">
          <img
            alt="Tailwind-CSS-Avatar-component"
            src="https://img.daisyui.com/images/profile/demo/gordon@192.webp"
          />
        </div>
      </div>
      <div className="flex">
        <p className="font-bold text-gray-200">Kai Havertz</p>
        <span className="pl-8">😂</span>
      </div>
    </div>
  );
};

export default Conversation;
