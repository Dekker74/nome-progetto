import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Inizializza l'utente dalla sessione salvata
    useEffect(() => {
        const savedUser = localStorage.getItem('pantry_current_user');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    async function register(email, password) {
        // Simula ritardo di rete
        await new Promise(resolve => setTimeout(resolve, 800));

        const users = JSON.parse(localStorage.getItem('pantry_users') || '[]');

        // Controlla se l'email esiste già
        if (users.find(u => u.email === email)) {
            const error = new Error('Email già registrata');
            error.code = 'auth/email-already-in-use';
            throw error;
        }

        const newUser = {
            uid: Date.now().toString(),
            email,
            password, // In un'app reale, qui ci andrebbe l'hash!
            emailVerified: false // Simuliamo che debba essere verificata
        };

        users.push(newUser);
        localStorage.setItem('pantry_users', JSON.stringify(users));

        // Non loggiamo subito l'utente, richiediamo verifica (simulata)
        // Ma per semplicità di demo LOCALE, potremmo anche loggarlo o mandarlo alla verifica
        return newUser;
    }

    async function login(email, password) {
        await new Promise(resolve => setTimeout(resolve, 800));

        const users = JSON.parse(localStorage.getItem('pantry_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            const error = new Error('Email o password non validi');
            error.code = 'auth/invalid-credential';
            throw error;
        }

        // Salva sessione
        // Rimuoviamo la password dall'oggetto sessione per pulizia
        const sessionUser = { ...user };
        delete sessionUser.password;

        setCurrentUser(sessionUser);
        localStorage.setItem('pantry_current_user', JSON.stringify(sessionUser));
        return sessionUser;
    }

    function logout() {
        setCurrentUser(null);
        localStorage.removeItem('pantry_current_user');
    }

    async function resendVerificationEmail() {
        // Simulazione locale
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`Email di verifica simulata inviata a ${currentUser?.email}`);
    }

    // Funzione extra per simulare il click sul link dell'email
    function verifyEmailAddress() {
        if (currentUser) {
            const users = JSON.parse(localStorage.getItem('pantry_users') || '[]');
            const userIndex = users.findIndex(u => u.uid === currentUser.uid);

            if (userIndex > -1) {
                users[userIndex].emailVerified = true;
                localStorage.setItem('pantry_users', JSON.stringify(users));

                const updatedUser = { ...currentUser, emailVerified: true };
                setCurrentUser(updatedUser);
                localStorage.setItem('pantry_current_user', JSON.stringify(updatedUser));
            }
        }
    }

    const value = {
        currentUser,
        register,
        login,
        logout,
        resendVerificationEmail,
        verifyEmailAddress // Esportiamo anche questo per la demo
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
