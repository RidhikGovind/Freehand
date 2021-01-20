import React, { useEffect, useState } from "react";
import "./styles.css";

import { fabric } from "fabric";
import firebase from "firebase";
import { db } from "./firebase";
import paintbrush from "./Icons/paintbrush.png";
import eraser from "./Icons/eraser.png";
import dustbin from "./Icons/dustbin.png";
import square from "./Icons/square.png";
import triangle from "./Icons/triangle.png";
import circle from "./Icons/circle.png";
import selecthand from "./Icons/selecthand.png";
import text from "./Icons/text.png";
import downloadIcon from "./Icons/download.png";

//initializing canvas variable outside for global scope
let canvas;
function App() {
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#5DADE2");
  const [eraserSize, setEraserSize] = useState(10);
  const [strokeColor, setStrokeColor] = useState("#000");
  const [JSONData, setJSONData] = useState("");

  //creating a firestore reference
  const ref = db.collection("canvasData").doc("JSONData");

  useEffect(() => {
    canvas = new fabric.Canvas("canvas");
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.color = brushColor;
    canvas.setHeight(window.innerHeight - 100);
    canvas.setWidth(window.innerWidth - 50);
    canvas.freeDrawingBrush.width = brushSize;

    //uploading the canvas object data to firestore and loading the data from firestore on mouse:up
    canvas.on("mouse:up", () => {
      console.log("loaded");
      setJSONData(JSON.stringify(canvas));
      ref.set({
        data: JSONData,
      });

      ref.onSnapshot((snap) => {
        const JSONFirebase = snap.data().data;
        canvas.loadFromJSON(JSONFirebase, canvas.renderAll.bind(canvas));
      });
    });
  }, []);

  useEffect(() => {
    canvas.freeDrawingBrush.width = brushSize;
  }, [brushSize]);

  useEffect(() => {
    canvas.freeDrawingBrush.color = brushColor;
  }, [brushColor]);

  useEffect(() => {
    canvas.freeDrawingBrush.width = eraserSize;
  }, [eraserSize]);

  useEffect(() => {
    saveData();
  }, [JSONData]);

  //function to change brush size
  const handleBrushSizeChange = (e) => {
    setBrushSize(e.target.value);
  };

  //function to generate different shapes
  const generateShape = (e) => {
    let elementClassName = e.target.classList;
    canvas.isDrawingMode = false;
    const strokeWidth = 2;

    if (elementClassName == "squareShape") {
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: "transparent",
        width: 60,
        height: 60,
        angle: 90,
        stroke: strokeColor,
        strokeWidth,
      });
      canvas.add(rect);
    } else if (elementClassName == "triangleShape") {
      const rect = new fabric.Triangle({
        left: 200,
        top: 150,
        fill: "transparent",
        width: 60,
        height: 60,
        stroke: strokeColor,
        strokeWidth,
      });
      canvas.add(rect);
    } else if (elementClassName == "circleShape") {
      const rect = new fabric.Circle({
        left: 100,
        top: 100,
        radius: 50,
        stroke: strokeColor,
        strokeWidth,
        fill: "transparent",
      });
      canvas.add(rect);
    } else {
      return;
    }
  };

  // function to clear canvas or delete the selected shapes
  const deleteObjects = () => {
    const activeObjects = canvas.getActiveObjects();

    if (activeObjects.length === 0) {
      canvas.clear();
      return;
    } else if (activeObjects.length) {
      activeObjects.forEach((object) => {
        canvas.remove(object);
      });
    }
  };

  const addTextInput = () => {
    const textInput = new fabric.Textbox("Enter Text", {
      left: 100,
      top: 100,
      fontFamily: "ubuntu",
      width: 30,
      height: 40,
    });
    canvas.add(textInput);
    canvas.isDrawingMode = false;
  };

  // function to upload JSON data from firestore
  const saveData = () => {
    setJSONData(JSON.stringify(canvas));
    ref.set({
      data: JSONData,
    });
    console.log("JSONData saved to Firestore");
  };

  // function to load JSON data from firestore
  const loadData = () => {
    ref.onSnapshot((snap) => {
      const JSONFirebase = snap.data().data;
      canvas.loadFromJSON(JSONFirebase, canvas.renderAll.bind(canvas));
    });
  };

  //function to delete JSON data from firestore
  const clearSaved = () => {
    ref.update({
      data: firebase.firestore.FieldValue.delete(),
    });
    canvas.clear();
  };

  //function to download the canvas content as jpeg
  const download = () => {
    var dataURL = canvas.toDataURL({
      format: "jpeg",
      quality: 0.9,
    });
    const imageLink = document.createElement("a");
    if (typeof imageLink.download === "string") {
      imageLink.href = dataURL;
      imageLink.download = "canvas.jpg";
      document.body.appendChild(imageLink);
      imageLink.click();
      document.body.removeChild(imageLink);
    } else {
      window.open(dataURL);
    }
  };
  return (
    <div className="App">
      <div className="toolSection">
        <div className="toolField">
          <div className="brushWidth">
            <div className="icon">
              <img
                src={paintbrush}
                alt="paintbrush-icon"
                className="paintBrushIcon"
                onClick={() => {
                  setBrushColor("#5DADE2");
                  canvas.isDrawingMode = true;
                }}
              />
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="5"
              value={brushSize}
              className="slider"
              onChange={handleBrushSizeChange}
            ></input>
          </div>

          <div className="colorsets">
            <div
              className="blue"
              style={{ background: "#5DADE2" }}
              onClick={() => {
                setBrushColor("#5DADE2");
                setStrokeColor("#5DADE2");
              }}
            ></div>
            <div
              className="red "
              style={{ background: "#E74C3C" }}
              onClick={() => {
                setBrushColor("#E74C3C");
                setStrokeColor("#E74C3C");
              }}
            ></div>
            <div
              className="yellow "
              style={{ background: "#F1C40F" }}
              onClick={() => {
                setBrushColor("#F1C40F");
                setStrokeColor("#F1C40F");
              }}
            ></div>
            <div
              className="green "
              style={{ background: "#239B56" }}
              onClick={() => {
                setBrushColor("#239B56");
                setStrokeColor("#239B56");
              }}
            ></div>
            <div
              className="black "
              style={{ background: "#17202A" }}
              onClick={() => {
                setBrushColor("#17202A");
                setStrokeColor("#239B56");
              }}
            ></div>
          </div>

          <div className="eraser">
            <div className="icon eraserDesc">
              <img
                src={eraser}
                alt="eraser-icon"
                className="eraserIcon"
                onClick={(e) => {
                  setBrushColor("#FFFFFF");
                }}
              />
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="10"
              value={eraserSize}
              className="slider"
              onChange={(e) => setEraserSize(e.target.value)}
            ></input>
          </div>

          <div className="deleteField">
            <div className="icon" onClick={deleteObjects}>
              <img src={dustbin} alt="delete-icon" className="deleteBtn" />
            </div>
          </div>

          <div className="selectionHand">
            <div
              className="icon"
              onClick={() => (canvas.isDrawingMode = false)}
            >
              <img
                src={selecthand}
                alt="select-icon"
                className="selecthandBtn"
              />
            </div>
          </div>

          <div className="textInput">
            <div className="icon">
              <img
                src={text}
                alt="textInput-icon"
                className="textInputBtn"
                onClick={addTextInput}
              />
            </div>
          </div>

          <div className="download">
            <div className="icon">
              <img
                src={downloadIcon}
                alt="download-icon"
                className="downloadBtn"
                onClick={download}
              />
            </div>
          </div>

          <div className="save icon" onClick={saveData}>
            Save
          </div>
          <div className="load icon" onClick={loadData}>
            Load
          </div>

          <div className="clearSaved icon" onClick={clearSaved}>
            Clear Saved
          </div>

          <div className="shapesMenuField">
            <div className="icon square">
              <img
                src={square}
                alt="square-icon"
                className="squareShape"
                onClick={(e) => generateShape(e)}
              />
            </div>
            <div className="icon">
              <img
                src={triangle}
                alt="triangle-icon"
                className="triangleShape"
                onClick={(e) => generateShape(e)}
              />
            </div>
            <div className="icon">
              <img
                src={circle}
                alt="circle-icon"
                className="circleShape"
                onClick={(e) => generateShape(e)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="canvasField">
        <canvas id="canvas" />
      </div>
    </div>
  );
}

export default App;
