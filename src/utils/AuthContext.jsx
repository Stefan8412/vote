import { createContext, useState, useEffect, useContext } from 'react';
import { account } from '../lib/appwrite';
import { useNavigate } from 'react-router-dom';
import { ID } from 'appwrite';
import { useToast } from '../components/hooks/use-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    //setLoading(false)
    checkUserStatus();
  }, []);

  const deleteExistingSession = async () => {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.log('No existing session to delete');
    }
  };

  const loginUser = async (userInfo) => {
    setLoading(true);

    try {
      await deleteExistingSession();
      let response = await account.createEmailPasswordSession(
        userInfo.email,
        userInfo.password
      );
      toast({
        title: 'Prihlásenie úspešné',
        description: 'môžte vybrať hlasovanie.',
      });
      let accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const logoutUser = async () => {
    await account.deleteSession('current');
    setUser(null);
  };

  const registerUser = async (userInfo) => {
    setLoading(true);

    try {
      await deleteExistingSession();
      let response = await account.create(
        ID.unique(),
        userInfo.email,
        userInfo.password1,
        userInfo.name
      );

      await account.createEmailSession(userInfo.email, userInfo.password1);
      let accountDetails = await account.get();
      setUser(accountDetails);
      navigate('/');
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const checkUserStatus = async () => {
    try {
      let accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const contextData = {
    user,
    loginUser,
    logoutUser,
    registerUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

//Custom Hook
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
