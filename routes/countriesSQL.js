var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    if ((req.session.passport) && (req.session.passport.user != null)) {
        global.pool.getConnection().then(conn => {
            conn.query(req.message.sql_query)
                .then((result) => {
                    if (req.message.return_type == null) {
                        // récupérer les données extraites de la base et les envoyées à une vue
                        res.render(req.message.view, {
                            stitle: 'Connexion à Mariadb données Countries',
                            title: req.message.title,
                            libelle: req.message.libelle,
                            del_label: req.message.del_label,
                            form_action: req.message.form_action,
                            data: result  // Attention a renvoyer une variable avec un nom generique
                        });
                    } else {
                        res.setHeader('content-type', 'application/json');
                        res.send(result);
                    }
                    conn.end();
                })
                .catch(err => {
                    console.log(err);
                    conn.end();
                })
        }).catch(err => {
            console.log('error : ', err);
        });
    } else {
        res.redirect('/');  // affichage boîte de login si pas authentifié
    }
});

module.exports = router;