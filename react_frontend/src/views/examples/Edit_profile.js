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

class Edit_profile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        user: [],
        Username: "",
        about: "",
        address: "",
        birth_date: "",
        city: "",
        country: "",
        email: "",
        first_name: "",
        last_name: "",
        postal_code: "",
        profession: "",
        telephone: "",
        work_institution: ""

    }
    this.handleChange = this.handleChange.bind(this);

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
                      Username: result["Username"],
                      email:result["email"],
                      about:result["about"],
                      address:result["address"],
                      birth_date:result["birth_date"],
                      country:result["country"],
                      city:result["city"],
                      first_name:result["first_name"],
                      last_name:result["last_name"],
                      postal_code:result["postal_code"],
                      profession:result["profession"],
                      telephone:result["telephone"],
                      work_institution:result["work_institution"],
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

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
     this.setState({
          [name]: value
    });
    }

   onSaveChanges = () => {
      fetch('/update_user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({

          Username: this.state.Username,
          last_email:this.state.email,
          about:this.state.about,
          address:this.state.address,
          birth_date:this.state.birth_date,
          country:this.state.country,
          first_name:this.state.first_name,
          last_name:this.state.last_name,
          postal_code:this.state.postal_code,
          profession:this.state.profession,
          telephone:this.state.telephone,
          work_institution:this.state.work_institution,
    }),
    }).then(res => res.json())
      .then(
        (result) => {
          if(result['response']=="Done")
            this.props.history.push("/admin");
          else{
            this.setState({ error: result['error'] });

          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error: "error"
          });
        }
      )
  }
  render() {
    return (
      <>
        <UserHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col>
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">My account</h3>
                    </Col>
                    {/*<Col className="text-right" xs="4">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        Settings
                      </Button>
                    </Col>*/}
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Username
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-username"
                              placeholder={this.state.Username}
                              type="text"
                              name="Username"
                              value={this.state.Username}
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email address
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-email"
                              name = "email"
                              placeholder={this.state.email}
                              type="email"
                              disabled
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              First name
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-first-name"
                              placeholder={this.state.first_name}
                              type="text"
                              name={"first_name"}
                              value={this.state.first_name}
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-last-name"
                            >
                              Last name
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-last-name"
                              placeholder={this.state.last_name}
                              type="text"
                              name="last_name"
                              value={this.state.last_name}
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="dateofbirth"
                            >
                             Birth Date
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="dateofbirth"
                              type="date"
                              name="birth_date"
                              value={this.state.birth_date}
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Address */}
                    <h6 className="heading-small text-muted mb-4">
                      Contact information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Address
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-address"
                              placeholder={this.state.address}
                              type="text"
                              name="address"
                              value={this.state.address}
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-city"
                            >
                              City
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-city"
                              name="city"
                              placeholder={this.state.city}
                              type="text"
                              disabled
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-country"
                            >
                              Country
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Portugal"
                              id="input-country"
                              placeholder={this.state.country}
                              type="text"
                              name="country"
                              value={this.state.country}
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-country"
                            >
                              Postal code
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-postal-code"
                              placeholder="Postal code"
                              type={this.state.postal_code}
                              value={this.state.postal_code}
                              name="postal_code"
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-country"
                            >
                              Telephone
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-postal-code"
                              placeholder={this.state.telephone}
                              value={this.state.telephone}
                              onChange={this.handleChange}
                              name="telephone"
                              type="number"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Institution Info */}
                     <h6 className="heading-small text-muted mb-4">
                      Institution
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Work Institution
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-username"
                              placeholder={this.state.work_institution}
                              value={this.state.work_institution}
                              onChange={this.handleChange}
                              name="work_institution"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Profession
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-email"
                              placeholder={this.state.profession}
                              value={this.state.profession}
                              onChange={this.handleChange}
                              type="email"
                              name="profession"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Description */}
                    <h6 className="heading-small text-muted mb-4">About me</h6>
                    <div className="pl-lg-4">
                      <FormGroup>
                        <label>About Me</label>
                        <Input
                          className="form-control-alternative"
                          placeholder="A few words about you ..."
                          rows="4"
                          defaultValue={this.state.about}
                          value={this.state.about}
                          onChange={this.handleChange}
                          type="textarea"
                          name="about"
                        />
                      </FormGroup>
                    </div>
                    <div className="pl-lg-4">
                      <Row className="justify-content-center">
                        <Button
                          color="info"
                          href="/#admin/user-profile"
                          onClick= {this.onSaveChanges}
                        >
                          Save Changes
                        </Button>
                      </Row>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Edit_profile;
