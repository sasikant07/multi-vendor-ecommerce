import authReducer from "./Reducers/authReducer";
import categoryReducer from "./Reducers/categoryReducer";

const rootReducers = {
    auth: authReducer,
    category: categoryReducer,
}

export default rootReducers;