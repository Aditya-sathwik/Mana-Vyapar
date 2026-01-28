import bcrypt from 'bcryptjs';
async function test() {
    try {
        const hash = await bcrypt.hash('test', 10);
        console.log('Hash:', hash);
        const match = await bcrypt.compare('test', hash);
        console.log('Match:', match);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}
test();
