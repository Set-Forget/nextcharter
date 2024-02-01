import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

import { supabase } from "../lib/api";

const Context = createContext();

// export default function AuthContextProvider({ children }) {
//     const [session, setSession] = useState(null);

//     useEffect(() => {
//         supabase.auth.getSession().then(({ data: { session } }) => {
//             setSession(session);
//         });

//         const {
//             data: { subscription },
//         } = supabase.auth.onAuthStateChange((_event, session) => {
//             setSession(session);
//         });

//         return () => subscription.unsubscribe();
//     }, []);

//     return <Context.Provider value={{ session }}>{children}</Context.Provider>;
// }

// // eslint-disable-next-line react-refresh/only-export-components
// export const useAuthContext = () => useContext(Context);

// AuthContextProvider.propTypes = {
//     children: PropTypes.node,
// };

export default function AuthContextProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false); // set loading to false once the session is fetched
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false); // set loading to false on auth state change
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Context.Provider value={{ session, loading }}>{children}</Context.Provider>
  );
}

export const useAuthContext = () => useContext(Context);