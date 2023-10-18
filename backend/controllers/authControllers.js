class authControllers {
    admin_login = async (req, res) => {
        console.log("admin login", req.body);
    }
}

module.exports = new authControllers();