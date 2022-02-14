const db = require('../../models');

// async function generateUser(numberUserToBeCreate, password) {

//     try {
        
//         const datas = await getUserFromApi(numberUserToBeCreate);
//         let arrayResult = [];
        
//         for (const user of datas) {
//             const sampleUser = createSampleUser(user, password);
//             let newUser = await db.User.create(sampleUser);
//             arrayResult.push(newUser);
//         }
        
//         console.log('Successfully created users', arrayResult);
//         return arrayResult;

//     } catch (error) {
//         console.error(`An error is occured during provider user data process. ${error}`);
//     }

// }

function createSampleUser() {
    
    return {
        username: 'Jdoe'
    };
}

// async function getUserFromApi(numberUsersToBeGet) {

//     const data = await fetch(`https://jsonplaceholder.typicode.com/users?_limit=${numberUsersToBeGet}`);
//     return await data.json();

// }

module.exports.createSampleUser = createSampleUser;
// module.exports.generateUser = generateUser;