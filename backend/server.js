
const {app, connectDB} = require('./src/app');
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI)
	.then(()=>{
		app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
	})
	.catch(err=>{
		console.error('Failed to connect to DB', err);
		process.exit(1);
	});
