module.exports = function waitersRoutes(waitersFactory) {
    async function index(req, res, next) {

        try {
            console.log(req.body)

            res.render('index', {
                // name: name
            });
        } catch (err) {
            next(err)
        }
    }
    return { index }
}