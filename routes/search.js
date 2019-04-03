var express = require('express');
var router = express.Router();

var conn = require('./db');



function extracter(businesses) {
    return businesses.map(({ type, geometry, place_name }) => ({ type, geometry, place_name }));
}



router.get('/search', function (req, res) {

    conn.query('SELECT Output_Author_Name from output_author_country WHERE Output_Author_Name like "%' + req.query.key + '%"',
        function (err, rows, fields) {
            if (err) throw err;
            var data = [];
            for (i = 0; i < rows.length; i++) {
                data.push(rows[i].Output_Author_Name);
            }


            res.send(JSON.stringify(data))
        });
});




router.get('/dateAuthor', function (req, res) {


    sDate = req.query.sday;
    eDate = req.query.eday;

    console.log(sDate);
    console.log(eDate)

    // SELECT a.Output_Title_Name,o.Output_Author_Name AS author_names FROM test o INNER JOIN outputlist a ON o.Output_ID = a.Output_ID where Output_Pub > "04/02/2000" AND Output_OutPub < "04/03/2018" LIMIT 20

    sql1 = 'SELECT a.Output_Title_Name,o.Output_Author_Name AS author_names FROM test o INNER JOIN outputlist a ON o.Output_ID = a.Output_ID where Output_Pub >="' + sDate + '" AND Output_OutPub <= "' + eDate + '" LIMIT 20'



    let query = conn.query(sql1, (err, results) => {

        if (err) throw err;



        const promises = results.map(result =>

            Promise.all([

                result.author_names,
                result.Output_Title_Name

            ])

        );



        Promise.all(promises)
            .then((values) => {

                let authors = values.map(elmt => elmt[0])

                let names = values.map(elmt => elmt[1]);


                var namesArray = []
                var i = 0;
                while (names.length > 0 && i < names.length) {
                    var properties = {};
                    namesArray.push({ name: names[i], author: authors[i] })
                    console.log(namesArray[i].name)

                    i++;
                }



                res.send(namesArray)
            })





    });


})

router.get('/dateProject', function (req, res) {


    sDate = req.query.sday;
    eDate = req.query.eday;


    sql1 = 'SELECT Name, DATE(sDate) as "start", DATE(eDate) as "end", p.Project_Org_Name from project_name_table o INNER JOIN project_collaborators p ON p.Project_Id = o.Project_ID where sDate > "' + sDate + '" AND eDate < "' + eDate + '" LIMIT 20'



    let query = conn.query(sql1, (err, results) => {

        if (err) throw err;



        const promises = results.map(result =>

            Promise.all([

                result.Name,
                result.start,
                result.end,
                result.Project_Org_Name
            ])

        );



        Promise.all(promises)
            .then((values) => {



                let namesTitle = values.map(elmt => elmt[0]);

                let sDate = values.map(elmt => elmt[1]);

                let eDate = values.map(elmt => elmt[2]);

                let projectOrg = values.map(elmt => elmt[3])


                var namesArray = []
                var i = 0;
                while (namesTitle.length > 0 && i < namesTitle.length) {
                    var properties = {};
                    namesArray.push({ name: namesTitle[i], projectOrgs: projectOrg[i] })
                    console.log(namesArray[i].name)

                    i++;
                }


                res.send(namesArray)



            })





    });


})

router.get('/searchOrganisation', function (req, res) {


    conn.query('SELECT Organisation_Name from test WHERE Organisation_Name like "%' + req.query.key + '%"',
        function (err, rows, fields) {
            if (err) throw err;
            var data = [];
            for (i = 0; i < rows.length; i++) {
                data.push(rows[i].Organisation_Name);
            }


            res.send(JSON.stringify(data))

        });

})

router.get('/searchProjects', function (req, res) {

    conn.query('SELECT Funder_Name from project_funders WHERE Funder_Name like "%' + req.query.key + '%"',
        function (err, rows, fields) {
            if (err) throw err;
            var data = [];
            for (i = 0; i < rows.length; i++) {
                data.push(rows[i].Funder_Name);
            }


            res.send(JSON.stringify(data))

        });

})

router.get('/searchCollabs', function (req, res) {


    conn.query('SELECT Project_Org_Name from project_collaborators WHERE Project_Org_Name like "%' + req.query.key + '%"',
        function (err, rows, fields) {
            if (err) throw err;
            var data = [];
            for (i = 0; i < rows.length; i++) {
                data.push(rows[i].Project_Org_Name);
            }


            res.send(JSON.stringify(data))

        });

})




router.get('/organisationGet', function (req, res) {



    sql1 = 'SELECT a.Organisation_Name, a.Country_Name, a.Output_Title_Name from test a WHERE a.Organisation_Name = "' + req.query.typeaheadGet + '" LIMIT 20'

    let query = conn.query(sql1, (err, results) => {

        if (err) throw err;

        const promises = results.map(result =>

            Promise.all([

                result.Organisation_Name,
                result.Country_Name,
                result.Output_Title_Name

            ])

        );



        Promise.all(promises)
            .then((values) => {



                let businesses2 = values.map(elmt => elmt[0]);
                let country = values.map(elmt => elmt[1]);
                let names = values.map(elmt => elmt[2]);




                var namesArray = []
                var i = 0;
                while (names.length > 0 && i < names.length) {
                    var properties = {};
                    namesArray.push({ businessName: businesses2[i], countryName: country[i], names: names[i] })
                    i++;
                }



                res.send(namesArray)
            })





    });


})

module.exports = router;