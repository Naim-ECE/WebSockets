export const signup = async (req, res) => {
  try {
    const data = req.body;
    const { puranam, daknam } = data;
    console.log("Signup request received:", { puranam, daknam });
    res.status(200).send("Signup route");
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const login = (req, res) => {
  // Implement your login logic here
  res.send("Login route");
};

export const logout = (req, res) => {
  // Implement your logout logic here
  res.send("Logout route");
};
