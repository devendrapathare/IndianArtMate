const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Store = require('../models/StoreSchema');
const Arti = require('../models/UserSchema'); 


router.get("/sam", (req, res) => {
    res.send("yes, I'm here");
});


router.get('/store_by_arti/:artiId', async (req, res) => {
    try {
        const artiId = req.params.artiId; 
        const artiData = await Arti.findById(artiId);
        
        if (!artiData) {
            return res.status(404).json({ error: "Artist not found" });
        }

        const storeId = artiData.store_id; 

        if (!storeId) {
            return res.status(200).json(null);
        }

        const storeData = await Store.findById(storeId);

        if (storeData) {
            const artieIds = storeData.list_of_store_arties;
            const artiesData = await Arti.find({ _id: { $in: artieIds } });

            return res.status(201).json({
                store: storeData,
                arties: artiesData
            });
        } else {
            return res.status(404).json({ error: "Store not found" });
        }
    } catch (e) {
        console.error("Error fetching store or arties:", e);
        return res.status(500).json({ error: "Failed to fetch data" });
    }
});


router.get('/users', async (req, res) => {
    try {
        const users = await Arti.find();

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.post('/create_store', async (req, res) => {
    const { userId, storeName } = req.body;
  
    try {
      const artiest =  await  Arti.findById(userId)
      const newStore = new Store({
        owner_id: userId,
        owner_name: artiest.name || "sam", 
        store_name: storeName,
        list_of_store_arties: [] 
      });
  
      const savedStore = await newStore.save();
  
      const storeId = savedStore._id;
  
      const updatedUser = await Arti.findByIdAndUpdate(
        userId, 
        { store_id: storeId }, 
        { new: true } 
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found, unable to update store_id' });
      }
  
      res.status(201).json({
        message: 'Store created successfully and user updated',
        store: savedStore,
        user: updatedUser
      });
  
    } catch (error) {
      console.error('Error creating store and updating user:', error);
      res.status(500).json({ error: 'Failed to create store and update user' });
    }
  });
  

module.exports = router;
