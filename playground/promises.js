const doWorkPromise = new Promise((resolve, reject) => {
    resolve([4,2,0]);
    reject('Things went wrong!');
});

doWorkPromise.then((result) => {
    console.log('Success!', result);
}).catch((error) => {
    console.log('Error!', error);
});


//                          fulfullied
//                        /
// Promise   -- pending ->
//                        \
//                          rejected