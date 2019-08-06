import React, { Component } from "react";
import Particles from "react-particles-js";
import "./App.css";

import Logo from "./components/Logo/Logo";

import Navigation from "./components/Navigation/Navigation";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";

import Clarifai from "clarifai";

const app = new Clarifai.App({ apiKey: "e4dd8f2f83094c8b99a0acd9fe7b8e2f" });
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
      imageUrl: "",
      box: {},
      route: "signIn",
      isSignedIn: false
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onButtonSubmit = this.onButtonSubmit.bind(this);
    this.displayFaceBox = this.displayFaceBox.bind(this);
    this.onRouteChange = this.onRouteChange.bind(this);
  }

  calculateFaceLocation(data) {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;

    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  }

  displayFaceBox(box) {
    this.setState({ box });
  }
  onInputChange(e) {
    this.setState({ input: e.target.value });
  }
  onButtonSubmit() {
    this.setState({ imageUrl: this.state.input });

    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response =>
        this.displayFaceBox(this.calculateFaceLocation(response))
      )
      .catch(err => console.log(err));
  }
  onRouteChange(route) {
    if (route === "signOut") {
      this.setState({ isSignedIn: false });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route });
  }
  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particleParams} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onButtonSubmit={this.onButtonSubmit}
              onInputChange={this.onInputChange}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : this.state.route === "signIn" ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
