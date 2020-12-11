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
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col
} from "reactstrap";
// core components
import UserHeader from "../../components/Headers/UserHeader.js";
import {Redirect} from "react-router-dom";

class Profile extends React.Component {

   constructor(props) {
    super(props);

    this.state = {
      user:[]

    }
   }

  onEditProfile = () => {
      return <Redirect to="/admin/edit_profile"/>
  }

  getData = async () => {
      try {
           const response = await fetch(
              `/home`
          );

          const result = await response.json();

          this.setState(
              prevState => (
                  {
                      user: result
                  }
              )
          );
      }
    catch(e){
         this.setState(
             prevState => (
                 {
                     error: "No events do Show"
                 }
             )
         );
     }
  }
  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <>
        <UserHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col>
              <Card className="card-profile shadow">
                <Row className="justify-content-center">
                  <Col className="order-lg-2" lg="3">
                    <div className="card-profile-image">
                      <a href="#pablo" onClick={e => e.preventDefault()}>
                        <img
                          alt="..."
                          className="rounded-circle"
                          src={require("../../assets/img/theme/user.png")}
                        />
                      </a>
                    </div>
                  </Col>
                </Row>
                <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                  <div className="d-flex justify-content-end">
                      <Button
                        color="default"
                        href="/#admin/edit_profile"
                        onClick= {this.onEditProfile}
                        size="sm"
                      >
                        Edit profile
                      </Button>
                  </div>
                </CardHeader>
                <CardBody className="pt-0 pt-md-4">
                  <Row>
                    <div className="col">
                      <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      </div>
                    </div>
                  </Row>
                  <div className="text-center">
                    <h3>
                        {this.state.user["first_name"]}
                      <span className="font-weight-light">, 27</span>
                    </h3>
                    <div className="h5 font-weight-300">
                      <i className="ni location_pin mr-2" />
                      {this.state.user["city"]}
                    </div>
                    <div className="h5 mt-4">
                      <i className="ni business_briefcase-24 mr-2" />
                      {this.state.user["profession"]}
                    </div>
                    <div>
                      <i className="ni education_hat mr-2" />
                      {this.state.user["work_institution"]}
                    </div>
                    <hr className="my-4" />
                    <p>
                      {this.state.user["about"]}
                    </p>
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      Show more
                    </a>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Profile;
