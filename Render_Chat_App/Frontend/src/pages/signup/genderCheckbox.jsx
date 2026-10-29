export default function GenderCheckbox() {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">Gender</label>

      <div className="flex gap-6">
        {/* Male Checkbox */}
        <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition-colors">
          <input
            type="checkbox"
            name="gender"
            value="male"
            className="checkbox checkbox-primary checkbox-sm"
          />
          <span>Male</span>
        </label>

        {/* Female Checkbox */}
        <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition-colors">
          <input
            type="checkbox"
            name="gender"
            value="female"
            className="checkbox checkbox-secondary checkbox-sm"
          />
          <span>Female</span>
        </label>
      </div>
    </div>
  );
}
