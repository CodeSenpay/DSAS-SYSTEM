import React, { createContext, useState, useContext, type ReactNode } from "react";

type User = {
    student_id?: string;
    user_id?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    email?: string;
    user_level?: string;
} | null;

type UserContextType = {
    userdata: User;
    setUser: (userdata: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userdata, setUser] = useState<User>(null);

    return (
        React.createElement(
            UserContext.Provider,
            { value: { userdata, setUser } },
            children
        )
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};