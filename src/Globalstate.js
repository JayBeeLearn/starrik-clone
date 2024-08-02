import React, { useReducer } from "react";

export const GlobalContext = React.createContext();

const initialState = {
  userdetails: {},
  productdetails: {},
  loggedin: false,
  paymentfor: "",
  productinfo: {},
  singleuser: "",
  selectedinvestment: "",
  cointoinvestwith: "",
  distance: 0,
  uniqueId: "", 
  compriddetails: []

};

const reducer = (state, action) => {
  switch (action.type) {
    case "setproductdetails": {
      return {
        ...state,
        productdetails: action.snippet,
      };
    }

    case "setdistance": {
      return {
        ...state,
        distance: action.snippet
      };
    }

    case "setselectedinvestment": {
      return {
        ...state,
        selectedinvestment: action.snippet
      };
    }


    case "setcointoinvestwith": {
      return {
        ...state,
        cointoinvestwith: action.snippet
      };
    }

    case "setproductinfo": {
      return {
        ...state,
        productinfo: action.snippet
      };
    }
    case "setsingleuser": {
      return {
        ...state,
        singleuser: action.snippet
      };
    }
    case "setuserdetails": {
      return {
        ...state,
        userdetails: action.snippet
      };
    }
    case "setcompriddetails": {
      return {
        ...state,
        compriddetails: action.snippet
      };
    }
    case "setpaymentfor": {
      return {
        ...state,
        paymentfor: action.snippet
      };
    }
    case "setloggedin": {
      return {
        ...state,
        loggedin: action.snippet
      };
    }

    case "setuniqueId": {
      return {
        ...state,
        uniqueId: action.payload
      };
    }

    default:
      return state;
  }
};



// export const GlobalProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(reducer, initialState);

//   return (
//     <GlobalContext.Provider value={{ state, dispatch }}>
//       {children}
//     </GlobalContext.Provider>
//   );
// };

export const GlobalProvider = props => {
  const globalState = useReducer(reducer, initialState);
// begining of test code
  

//  end of test code
  return (
    <GlobalContext.Provider value={globalState}>
      {props.children}
    </GlobalContext.Provider>
  );
};
