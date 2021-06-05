const axios = require('axios');
const fs = require('fs');
// // fs-extra is some additional capabilities
// const fse = require('fs-extra');
// // path creates the file path for you based on where you are and where you point it.
// const path = require('path');
// // promisify is standard in node and allows us to make anything into a promise
// const promisify = require('util').promisify;
// // We use promisify to make writing our files a promise, so we can await it
// const writeFileAsync = promisify(fs.writeFile);
// // Creates the path to the destination folder using your current location
// const templatePath = path.join(__dirname, 'blog-data'); //__dirname is the path to where you currently are

const clientID = '7f1d0e1b75130fe7a170d4db3d2393a2';
const secret = '9a5fe45e96458617e89eee8a850dba421f55b6a7';
// let tokenType = '';
let token = '';
// const desinationStream = 7106516;
const desinationHub_id = 113214;
const outputFile = 'ABM-APJ-EMEA-3';
const toppage = 15;
// const ogItems = require('./source.js');
var returnedItems = [];

// const generateJSON = async(res) => {
//     try {
//       // Makes sure the destination folder exists, if it doesn't create it
//       console.log('\tEnsuring the includes folder exists');
//       await fse.ensureDir(templatePath);
//       // Once this has been done, it empties it out
//       console.log('\tEmptying the contents from the destination folder');
//       await fse.emptyDirSync(templatePath);
//       // Writes the newly compiled file to the folder
//       console.log('\tWriting the blog-data file');
//       await writeFileAsync(`${templatePath}/blog-data.xml`, res);
//       // Makes sure the Header file has been created
//       console.log('\tEnsuring the header file has been created');
//       await fse.ensureFile(`${templatePath}/blog-data.xml`);
//     } catch (err) {
//       console.log(err);
//     }
//   };

axios.post('https://v2.api.uberflip.com/authorize', {
        grant_type:	'client_credentials',
        client_id: clientID,
        client_secret: secret
    })
    .catch(function (error) {
        console.log(error);
        })
    .then(function (response) {
        // tokenType = response.data.token_type;
        token = response.data.access_token;
        // console.log(response);
        callLoop(desinationHub_id, )
    });

const callLoop = async function(hub,){
    let totalPages = toppage
    for(let i = 1; i <= totalPages; i++) {
        axios.get(`https://v2.api.uberflip.com/hubs/${hub}/streams?limit=100&page=${i}`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'User_Agent': `Nathan UF`
              }
        })
        .catch(function (error) {
            console.log(error);
            })
        .then(function (response) {
            totalPages = response.data.meta.total_pages;
            let objs = response.data.data;
            objs.forEach(function (obj) {
                returnedItems.push(obj);
            })
            // console.log(returnedItems);
            // console.log(totalPages);

        });   

      }
    
      setTimeout(function(){ generateFile(returnedItems); }, 8000);
}

const  generateFile = async(res) => {
    let data = JSON.stringify(res);
    fs.writeFileSync(`${outputFile}.json`, data);
    console.log('json created');
  };