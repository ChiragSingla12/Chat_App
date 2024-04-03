exports.getloginpage = (req, res, next) => {
    res.sendFile('./signup.html', { root: 'views' }, (err) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal server error');
        }
    })
}