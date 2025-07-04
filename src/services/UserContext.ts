import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type StudentDetailsProps = {
  college: string;
  major: string;
  program: string;
  school_year: string;
  semester: string;
  sex: string;
  student_id: string;
  student_name: string;
  year_level: string;
};

type User = {
  student_id?: string;
  user_id?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  student_details?: StudentDetailsProps;
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

  return React.createElement(
    UserContext.Provider,
    { value: { userdata, setUser } },
    children
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
