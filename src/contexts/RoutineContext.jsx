import React, { createContext, useContext, useState, useEffect } from 'react';

const RoutineContext = createContext();

export const useRoutine = () => {
  const context = useContext(RoutineContext);
  if (!context) {
    throw new Error('useRoutine must be used within a RoutineProvider');
  }
  return context;
};

export const RoutineProvider = ({ children }) => {
  const [routines, setRoutines] = useState({
    morning: [],
    night: []
  });

  // Load routines from localStorage on component mount
  useEffect(() => {
    const savedRoutines = localStorage.getItem('myskyn-routines');
    if (savedRoutines) {
      setRoutines(JSON.parse(savedRoutines));
    }
  }, []);

  // Save routines to localStorage whenever routines change
  useEffect(() => {
    localStorage.setItem('myskyn-routines', JSON.stringify(routines));
  }, [routines]);

  const addToRoutine = (product, routineType) => {
    console.log('Adding to routine:', product.name, 'to', routineType); // Debug log
    setRoutines(prevRoutines => {
      const existingProduct = prevRoutines[routineType].find(item => item.id === product.id);
      
      if (existingProduct) {
        console.log('Product already in routine'); // Debug log
        return prevRoutines;
      }
      
      const newRoutines = {
        ...prevRoutines,
        [routineType]: [...prevRoutines[routineType], { ...product, addedAt: new Date().toISOString() }]
      };
      console.log('New routines:', newRoutines); // Debug log
      return newRoutines;
    });
  };

  const removeFromRoutine = (productId, routineType) => {
    setRoutines(prevRoutines => ({
      ...prevRoutines,
      [routineType]: prevRoutines[routineType].filter(item => item.id !== productId)
    }));
  };

  const reorderRoutine = (routineType, startIndex, endIndex) => {
    setRoutines(prevRoutines => {
      const newRoutine = Array.from(prevRoutines[routineType]);
      const [reorderedItem] = newRoutine.splice(startIndex, 1);
      newRoutine.splice(endIndex, 0, reorderedItem);

      return {
        ...prevRoutines,
        [routineType]: newRoutine
      };
    });
  };

  const clearRoutine = (routineType) => {
    setRoutines(prevRoutines => ({
      ...prevRoutines,
      [routineType]: []
    }));
  };

  const value = {
    routines,
    addToRoutine,
    removeFromRoutine,
    reorderRoutine,
    clearRoutine
  };

  return (
    <RoutineContext.Provider value={value}>
      {children}
    </RoutineContext.Provider>
  );
};