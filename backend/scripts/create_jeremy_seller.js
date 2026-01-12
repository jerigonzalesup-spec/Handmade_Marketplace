#!/usr/bin/env node

/**
 * Create or update Jeremy test user with seller role
 * Email: jeremy@gmail.com
 * Password: jeremy12
 */

import db from '../src/config/database.js';
import bcryptjs from 'bcryptjs';

async function main() {
  try {
    console.log('[SEED] Creating Jeremy test user...');
    
    // Hash the password
    const password = 'jeremy12';
    const passwordHash = await bcryptjs.hash(password, 10);
    
    // Check if user already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', ['jeremy@gmail.com']);
    
    if (existing && existing.length > 0) {
      // Update existing user to be a seller
      const userId = existing[0].id;
      await db.query(
        'UPDATE users SET role = ?, password_hash = ? WHERE id = ?',
        ['seller', passwordHash, userId]
      );
      console.log('[SEED] Updated Jeremy (ID:', userId, ') - now a SELLER with password jeremy12');
    } else {
      // Create new user
      const [result] = await db.query(
        'INSERT INTO users (email, password_hash, name, role, created_at) VALUES (?, ?, ?, ?, NOW())',
        ['jeremy@gmail.com', passwordHash, 'Jeremy', 'seller']
      );
      const userId = result.insertId;
      console.log('[SEED] Created Jeremy (ID:', userId, ') - SELLER role with password jeremy12');
      
      // Create empty cart for new user
      await db.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
      console.log('[SEED] Created cart for Jeremy');
    }
    
    // Add some sample crafts for Jeremy to sell
    const [crafts] = await db.query(
      'SELECT id FROM crafts WHERE seller_id = (SELECT id FROM users WHERE email = ?)',
      ['jeremy@gmail.com']
    );
    
    if (crafts.length === 0) {
      const userId = existing ? existing[0].id : (await db.query('SELECT id FROM users WHERE email = ?', ['jeremy@gmail.com']))[0][0].id;
      
      const sampleCrafts = [
        {
          title: "Jeremy's Handmade Leather Wallet",
          description: 'Premium leather wallet with multiple card slots',
          price: 49.99,
          stock_quantity: 10,
          image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop'
        },
        {
          title: "Custom Wood Desk Organizer",
          description: 'Beautiful walnut wood organizer for your desk',
          price: 89.99,
          stock_quantity: 5,
          image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=400&fit=crop'
        },
        {
          title: "Artisan Coffee Mug Set",
          description: 'Set of 4 handcrafted ceramic mugs',
          price: 64.99,
          stock_quantity: 15,
          image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop'
        }
      ];
      
      for (const craft of sampleCrafts) {
        const [craftResult] = await db.query(
          'INSERT INTO crafts (title, description, price, stock_quantity, image, seller_id, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
          [craft.title, craft.description, craft.price, craft.stock_quantity, craft.image, userId]
        );
        console.log('[SEED] Added craft:', craft.title);
      }
      
      console.log('[SEED] Added 3 sample crafts for Jeremy to sell');
    }
    
    console.log('\n✅ Jeremy seller account is ready!');
    console.log('📧 Email: jeremy@gmail.com');
    console.log('🔑 Password: jeremy12');
    console.log('👤 Role: Seller + Buyer');
    console.log('\nYou can now:');
    console.log('- Sign in to buyer interface');
    console.log('- Upgrade to seller or access seller dashboard');
    console.log('- View your inventory and sales');
    
    process.exit(0);
  } catch (err) {
    console.error('[SEED] Error:', err.message);
    console.error(err);
    process.exit(1);
  }
}

main();
