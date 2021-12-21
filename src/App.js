import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if(list) {
    return JSON.parse(list)
  }
  else {
    return []
  }
}

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "hello world",
    type: "danger",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      // display alert
      // setAlert({ show: true, msg: "please enter value", type: "danger" });
      showAlert(true, "please enter value", "danger");
    } else if (name && isEditing) {
      setList(
          list.map((item) => {
          if(item.id === editID)
          {
            console.log("text-item",item);
            console.log("title-name",name);
            return {...item, title: name}
          }
          return item;
        })
      )
      setName('');
      setEditID(null);
      setIsEditing(false)
      showAlert(true,'value changed','success')
    } else {
      // show alert
      showAlert(true, "item added to the list", "success");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };
  const showAlert = (show = false, msg = "", type = "") => {
    setAlert({ show: show, msg, type });
  };
  const clearList = () => {
    showAlert(true, "empty list", "danger");
    setList([]);
  };
  const removeItem = (id) => {
    showAlert(true, "item removed", "danger");
    setList(list.filter((item) => {
      // console.log(item.id);
      // console.log(id);
      return item.id !== id
    }));
  };
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id == id);
    setIsEditing(true);
    // console.log(specificItem);
    setEditID(id);
    setName(specificItem.title);
  };
  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  },[list])
  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>grocery bud</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. eggs"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem}/>
          <button className="clear-btn" onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
