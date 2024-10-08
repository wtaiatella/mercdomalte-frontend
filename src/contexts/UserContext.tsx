import { createContext, FC, useState } from "react";

interface UserContextType {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  urlBackendApi: string;
  setUrlBackendApi: React.Dispatch<React.SetStateAction<string>>;
  session: {
    accessToken: string;
    email: string;
    name: string;
    code: number;
  };
  setSession: React.Dispatch<
    React.SetStateAction<{
      accessToken: string;
      email: string;
      name: string;
      code: number;
    }>
  >;
}

export const UserContext = createContext<UserContextType>({
  isModalVisible: false,
  setIsModalVisible: () => {},
  urlBackendApi: "",
  setUrlBackendApi: () => {},
  session: {
    accessToken: "",
    email: "",
    name: "",
    code: 0,
  },
  setSession: () => {},
});

interface UserStorageProps {
  children: React.ReactNode;
}

export const UserStorage: FC<UserStorageProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [urlBackendApi, setUrlBackendApi] = useState("");
  const [session, setSession] = useState({
    accessToken: "",
    email: "",
    name: "",
    code: 0,
  });

  UserContext;
  return (
    <UserContext.Provider
      value={{
        isModalVisible,
        setIsModalVisible,
        urlBackendApi,
        setUrlBackendApi,
        session,
        setSession,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
