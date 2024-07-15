import { BrowserRouter, Routes, Route } from "react-router-dom";
import Books from "./components/Books";
import Add from "./components/Add";
import Update from "./components/Update";
import { store } from "./redux/store/store";
import { Provider } from "react-redux";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Provider store={store}>
          <div className=" flex justify-center my-10">
            <Routes>
              <Route path="/" element={<Books />} />
              <Route path="/add" element={<Add />} />
              <Route path="/Update" element={<Update />} />
            </Routes>
          </div>
        </Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
