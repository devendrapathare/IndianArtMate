import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '15d' })

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true, //It basically prevents XSS attacks which is cross-site scripting attacks
        sameSite:"strict" ,//It basically prevents CSRf attaks which is cross-site request foregery attacks
        secure:process.env.NODE_ENV !== "develepment",
    })
}

export default generateTokenAndSetCookie