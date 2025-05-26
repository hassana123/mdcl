'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export function useFirebase(collectionName) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const itemsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemsList);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${collectionName}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (data, imageFile = null) => {
    try {
      let imageUrl = '';
      if (imageFile) {
        const storageRef = ref(storage, `${collectionName}/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const itemData = {
        ...data,
        imageUrl,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, collectionName), itemData);
      await fetchItems();
      return true;
    } catch (err) {
      setError(err.message);
      console.error(`Error adding ${collectionName} item:`, err);
      return false;
    }
  };

  const updateItem = async (id, data, imageFile = null) => {
    try {
      let imageUrl = data.imageUrl;
      if (imageFile) {
        const storageRef = ref(storage, `${collectionName}/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const itemData = {
        ...data,
        imageUrl,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, collectionName, id), itemData);
      await fetchItems();
      return true;
    } catch (err) {
      setError(err.message);
      console.error(`Error updating ${collectionName} item:`, err);
      return false;
    }
  };

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      await fetchItems();
      return true;
    } catch (err) {
      setError(err.message);
      console.error(`Error deleting ${collectionName} item:`, err);
      return false;
    }
  };

  useEffect(() => {
    fetchItems();
  }, [collectionName]);

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
  };
} 