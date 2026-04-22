const https = require('https');

https.get('https://www.pexels.com/search/traditional%20indian%20clothes/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const matches = data.match(/https:\/\/images\.pexels\.com\/photos\/\d+\/pexels-photo-\d+\.jpeg\?auto=compress&cs=tinysrgb&w=800/g);
        if (matches && matches.length > 0) {
            console.log(matches.slice(0, 5));
        } else {
            console.log("No images found or blocked.");
        }
    });
}).on('error', console.error);
