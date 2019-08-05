import React, { Component } from "react";
import Particles from "react-particles-js";
import "./App.css";

import Logo from "./components/Logo/Logo";

import Navigation from "./components/Navigation/Navigation";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";

import Clarifai from "clarifai";

const app = new Clarifai.App({ apiKey: "" });
const particleParams = {
  particles: {
    number: {
      value: 10,
      density: {
        enable: true,
        value_area: 500
      }
    },
    line_linked: {
      shadow: {
        enable: true,
        color: "red",
        blur: 2
      }
    }
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: ""
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onButtonSubmit = this.onButtonSubmit.bind(this);
  }

  onInputChange(e) {
    this.setState({ input: e.target.value });
    console.log(this.state.input);
  }
  onButtonSubmit() {
    this.setState({ imageUrl: this.state.input });
    console.log(this.state.imageUrl);
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
      function(response) {
        console.log(
          response.outputs[0].data.regions[0].region_info.bounding_box
        );
      },
      function(err) {}
    );
  }
  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particleParams} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onButtonSubmit={this.onButtonSubmit}
          onInputChange={this.onInputChange}
        />
        <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
