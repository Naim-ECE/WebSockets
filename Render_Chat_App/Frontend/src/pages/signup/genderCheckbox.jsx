export default function GenderCheckbox({ onGenderChange, selectedGender }) {
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
            checked={selectedGender === "male"}
            onChange={() => onGenderChange("male")}
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
            checked={selectedGender === "female"}
            onChange={() => onGenderChange("female")}
          />
          <span>Female</span>
        </label>
      </div>
    </div>
  );
}
