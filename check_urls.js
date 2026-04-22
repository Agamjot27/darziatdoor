const https = require('https');

const ids = [
    "1585467381244-3101eb652bb2", // Traditional Indian
    "1605518216938-7c31b7b14ad0", // Indian fabric
    "1598300185966-2313fa422a55", // Indian wedding
    "1612443425555-d3cb013143c1", // Indian Sherwani
    "1546115984-cb9192931a78" // Indian traditional
];

ids.forEach(id => {
    const url = `https://images.unsplash.com/photo-${id}?q=80&w=2000&auto=format&fit=crop`;
    https.get(url, (res) => {
        console.log(`Status ${res.statusCode} for ${id}`);
    }).on('error', (e) => {
        console.error(`Error for ${id}: ${e.message}`);
    });
});
