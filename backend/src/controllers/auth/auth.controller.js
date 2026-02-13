const { parse } = require("zod");
const { registerSchema,loginSchema} = require("../schemas/auth.schema");
const authService = require("./auth.service");

async function register(req, res) {
 
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.flatten(),
    });
  }

  const { email, password, name } = parsed.data;

  try {
    
    const { user, token } = await authService.register({
      email,
      password,
      name,
    });


    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });


    return res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (err) {

    if (err.code === "EMAIL_ALREADY_REGISTERED") {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    console.error("Signup error:", err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function login(req, res) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.flatten(),
    });
  }
     const {email, password} = parsed.data
     try {
        const {user, token} = await authService.login({
            email,
            password
        });
        res.cookie("access_token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge :15 * 60 * 1000,
        })
        return res.status(200).json({
            email: user.email, 
            name: user.name
        })
        
     } catch (error) {
        if (error.code === "INVALID_CREDENTIALS") {
            return res.status(401).json({
        error: "invalid credentials "})
            }
             console.error("Login error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
        
     }

}

module.exports = {
  register,
  login
};