const handleSignIn = (db, bcrypt) => (req,res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json("Please enter valid information")
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash)
            if (isValid) {
                return db.select("*").from("users")
                  .where('email', '=', email)
                  .then(user => {
                     res.json(user[0])
                 })
                 .catch(err => res.status(400).json("Could not find the user"))
            }
            else {res.status(400).json("wrong info")}
        })
        .catch(err => res.status(400).json("Wrong information"))
}

module.exports = {
    handleSignIn: handleSignIn
}