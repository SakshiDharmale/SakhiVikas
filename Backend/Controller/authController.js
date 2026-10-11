import jwt from  'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../db.js';
import dotenv from 'dotenv';
dotenv.config();



export async function login(req,res){
const { mobile_Number, password } = req.body;
if (!mobile_Number|| !password) {
    return res.status(400).json({ error: 'name and password required' });
}
const query = 'select * from users where mobile_Number=?;';
db.query(query, [mobile_Number], async (err, results) => {
    if (err) {
        console.log(err);
        return res.status(500).json({ error: 'server error' });
    }
    if (results.length === 0) {
        return res.status(401).json({ error: 'invalid credentials' });
    }
    const user = results[0];
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
        return res.status(401).json({ error: 'invalid password' });
    }
    
    const token = jwt.sign(
        { id: user.user_id },
        process.env.secret,
        { expiresIn: '1d' }
    );
    return res.json({ token: token, id: user.user_id });
    });
};

export async function register(req,res){
    let name;
    let mobile_Number;
    let password;
    const b = req.body;
    if (Array.isArray(b)) {
        [name, mobile_Number, password] = b;
    } else {
        name = b.name || b.Name;
        mobile_Number = b.mobile_Number;
        
        password = b.password;
    }
    
    
    try {
        const hash_password = await bcrypt.hash(password, 10);
        const query =
            'insert into users(name,mobile_Number,password) values(?,?,?);';
        db.query(query, [name, mobile_Number, hash_password], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'could not register' });
            }
            res.status(201).json({ message: 'user registered successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'server error' });
    }
};
