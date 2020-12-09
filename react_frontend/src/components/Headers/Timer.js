/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";


class Timer extends React.Component {
  constructor(props) {
    super(props);
    //static int a ++;
    this.state = {
        seconds: 0 ,
        events:Math.floor(Math.random() * 1000),
        type:"eventS", name_view:"Month",
        variation:(Math.random() * 20 - 10).toFixed(2)};
  }

  tick() {

   var new_name_view=""
    if (this.state.seconds % 3 == 0){
      new_name_view="Today\t\t"
    }else{
      if(this.state.seconds % 2 == 0){
        new_name_view="Week\t\t"
      }else{
        new_name_view="Month\t\t"
      }
    }
    var new_variation=(Math.random() * 20 - 10).toFixed(2)
    if(new_variation >0){
        let elem = document.getElementById('span1');
        elem.className = "text-success mr-2";
        elem = document.getElementById('i1');
        elem.className = "fa fa-arrow-up";
    }else{
       let elem = document.getElementById('span1');
        elem.className = "text-warning mr-2";
        elem = document.getElementById('i1');
        elem.className = "fa fa-arrow-down";
    }
    document.getElementById("teste").style.transition="width 2s"
   this.setState(state => ({
       seconds: state.seconds + 1,
       events: Math.floor(Math.random() * 1000),
       type:state.type,
       name_view: new_name_view,
       variation: new_variation
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
        <CardBody>
          <Row>
            <div className="col">
              <CardTitle
                tag="h5"
                className="text-uppercase text-muted mb-0"
              >
              events
              </CardTitle>
              <span className="h2 font-weight-bold mb-0" id = "teste" >
                {this.state.name_view + "\t\t"} {this.state.events}
              </span>
            </div>
            <Col className="col-auto">
              <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                <i className="fas fa-chart-bar" />
              </div>
            </Col>
          </Row>
          <p className="mt-3 mb-0 text-muted text-sm">
            <span id = "span1" className="text-success mr-2">
              <i id = "i1" className="fa fa-arrow-up" /> {this.state.variation}%
            </span>{" "}
            <span className="text-nowrap">Since last month</span>
          </p>
        </CardBody>
    );
  }
}

export default Timer;
