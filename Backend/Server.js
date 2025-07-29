const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');
dotenv.config();  // Load environment variables
const app=express();
const port=process.env.PORT || 5000;
const pool=new Pool({
  connectionString: process.env.DATABASE_URL
});
app.use(express.json()); // Middleware to parse JSON requests
app.get('/', (req, res) => {
  res.send('Attendance Management System API');
});
pool.connect()
  .then(()=>console.log('Connected to PostgreSQL'))
  .catch(err=>console.log('Error connecting to PostgreSQL:', err));
app.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
});
