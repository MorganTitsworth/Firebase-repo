import "./App.css";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import db from "./api/firebase-config";
import { useState, useEffect } from "react";

function App() {
  const [status, setStatus] = useState([]);
  const [statusData, setStatusData] = useState({ header: "", content: "" });

  async function getStatus() {
    try {
      const query = await getDocs(collection(db, "posts"));
      const status = query.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      return status;
    } catch (error) {
      console.error(error);
    }
  }

  async function addStatus(header, status) {
    try {
      await addDoc(collection(db, "posts"), {
        header: header,
        status: status,
      });

      getStatus().then((status) => setStatus(status));
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteStatus(id) {
    try {
      await deleteDoc(doc(db, "posts", id));
      setStatus(status.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  async function updateStatus(id, updatedStatus) {
    try {
      await updateDoc(doc(db, "posts", id), { status: updatedStatus });
      setStatus(
        status.map((item) =>
          item.id === id ? { ...item, status: updatedStatus } : item
        )
      );
    } catch (error) {
      console.error("failure: ", error);
    }
  }

  useEffect(() => {
    getStatus().then((status) => setStatus(status));
  }, []);

  return (
    <div className="journal">
      <div className="entries">
        <div className="kanye"></div>
        <div className="add-entry entry">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addStatus(statusData.header, statusData.status);
            }}
            className="content"
            style={{ width: "100%", height: "100%", display: "flex" }}
          >
            <img src="/images/avatar.png" alt="avatar" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <input
                type="text"
                style={{
                  display: "flex",
                  width: "33%",
                }}
                placeholder="Title"
                value={statusData.header}
                onChange={(e) =>
                  setStatusData({ ...statusData, header: e.target.value })
                }
              />
              <textarea
                value={statusData.status}
                placeholder="Whats going on?"
                style={{ height: "100%", width: "100%", padding: ".25em" }}
                onChange={(e) =>
                  setStatusData({ ...statusData, status: e.target.value })
                }
              ></textarea>
            </div>
            <div className="buttons">
              <button id="draft">Draft</button>
              <button type="submit" id="post">
                Post
              </button>
            </div>
          </form>
        </div>
        {status.map((data) => (
          <Entry
            key={data.id}
            id={data.id}
            header={data.header}
            status={data.status}
            updateStatus={updateStatus}
            deleteStatus={deleteStatus}
          />
        ))}
      </div>
    </div>
  );
}

function Entry({ id, header, status, updateStatus, deleteStatus }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState(status);

  function handleEdit() {
    setIsEditing(true);
  }

  function handleSave() {
    updateStatus(id, editedStatus);
    setIsEditing(false);
  }

  return (
    <div className="entry">
      <div className="content">
        <img src="/images/avatar.png" alt="avatar" />
        {isEditing ? (
          <>
            <div
              className="text"
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 0,
              }}
            >
              <textarea
                style={{ width: "100%" }}
                value={editedStatus}
                onChange={(e) => setEditedStatus(e.target.value)}
              />
            </div>
            <div className="buttons">
              <button onClick={handleSave}>Save</button>
            </div>
          </>
        ) : (
          <div
            className="text"
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3 style={{ margin: 0 }}>{header}</h3>
              <p>{status}</p>
            </div>
            <div className="buttons">
              <button onClick={handleEdit}>
                <img src="/images/edit.png" alt="edit" />
              </button>
              <button onClick={() => deleteStatus(id)}>
                <img src="/images/trash.png" alt="trash" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
