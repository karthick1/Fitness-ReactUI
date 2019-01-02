import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import legIcon from './img/leg.jpg';
import ReactSpeedometer from "react-d3-speedometer";
class Dashboard extends Component {
  rootUrl = 'http://localhost:5000/';
  constructor() {
    super();
    this.state = {
      Data: [],
      friends: []
    }
  }

  componentDidMount() {
    this.recentExercise();
    this.displayFriends();
  }
  // Function used for populating charts
  recentExercise() {
    axios.get(this.rootUrl + 'heartbeat').then(response => {
      const responseData = response.data;
      let recentExerciseList = [];
      let recentExercise = [];
      responseData.forEach(element => {
        recentExerciseList.push(element.bpm);
        let obj = {
          minutes: element.minutes,
          cals: element.cals,
          date: element.date
        }
        recentExercise.push(obj);
      });

      this.setState({
        Data: {
          labels: recentExerciseList,
          datasets: [
            {
              label: 'Exercise',
              data: recentExerciseList,
              backgroundColor: [
                'rgba(255,105,145,0.6)',
                'rgba(155,100,210,0.6)',
                'rgba(90,178,255,0.6)',
                'rgba(240,134,67,0.6)',
                'rgba(120,120,120,0.6)',
                'rgba(250,55,197,0.6)'
              ]
            }
          ],
          recentExercise: recentExercise
        }
      });
    })
  }
  // Function for populate social Network chart
  displayFriends() {
    axios.get(this.rootUrl + 'socialNetwork').then(response => {
      const friendsList = response.data;
      let frienObjList = [];
      friendsList.forEach(element => {
        let obj = {
          name: element.name,
          value: element.value
        }
        frienObjList.push(obj);
      });

      this.setState({
        friends: {
          frienObjList
        }
      });
    })
  }


  render() {
    let posts1 = [];
    if (this.state.friends.frienObjList !== undefined) {
      this.state.friends.frienObjList.forEach(element => {
        let obj = { name: element.name, value: element.value };
        posts1.push(obj);
      });
    }

    let content = posts1.map((post) =>
      <div key={post.name} className="row">
        <div className="col-md-3"><i className="fa fa-twitter text-info" /></div>
        <div className="col-md-9"><h3>{post.name}</h3>
          <p>{post.value}</p></div>
      </div>
    );
    let recentExerciseData; // Recent Exercise
    if (this.state.Data.recentExercise !== undefined) {
      recentExerciseData = this.state.Data.recentExercise.map((post) =>
        <div className="row">
          <label><b>Walk</b></label><span className="pull-right">{post.date}</span>
          <div key={post.id} className="row">
            <span className="col-md-5">
              <span className="col-md-12">{post.minutes} Minutes</span>
              <span className="col-md-12">{post.cals} Cals</span>
              <span className="col-md-12">88 bpm avg</span></span>
            <span className="col-md-6"> <p>{<Line
              data={this.state.Data}
              options={{ maintainAspectRatio: false }} />}</p></span></div>
        </div>
      )
    }
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={3} className="card card-stats">
              <h2>Friends</h2>
              {content}
            </Col>
            <Col md={3} className="card card-stats content-space">
              <h2>Recent Exercise</h2>
              {recentExerciseData}
            </Col>
            <Col md={3} className="card card-stats content-space" >
              {<Line
                data={this.state.Data}
                options={{ maintainAspectRatio: false }} />}
            </Col>
            <Col md={2} className="card card-stats content-space">
              {<div><img src={legIcon} className="pe-7s-graph image-space" alt="stepIcon"></img>
                <div><span className="text-space">250000</span><span> steps</span>
                </div>
              </div>}
            </Col>
            <Col md={3} className="card card-stats content-space" >
              {<div><ReactSpeedometer
                maxValue={12.52}
                value={10.5}
                minValue={8.52}
                needleColor="red"
                startColor="orange"
                segments={1}
                endColor="blue"
              /> <div><div><span className="text-space">6 hr</span><span> 41 min</span>
              </div>
                  <br></br>
                  <div className="image-space">awake 2x restless 8x</div>
                </div>
                <br></br>
                <div className="image-space">Best in a day</div></div>}
            </Col>
          </Row>
          <Row>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
