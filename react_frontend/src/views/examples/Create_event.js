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
    Col, Progress, DropdownToggle, DropdownMenu, DropdownItem, ButtonDropdown,
} from "reactstrap";
// core components
import UserHeader from "../../components/Headers/UserHeader.js";
import {Redirect} from "react-router-dom";

class Create_event extends React.Component {

  constructor(props) {
    super(props);
    this.toggleDrop1 = this.toggleDrop1.bind(this);
    this.changeValueDrop1 = this.changeValueDrop1.bind(this);

    this.toggleDrop2 = this.toggleDrop2.bind(this);
    this.changeValueDrop2 = this.changeValueDrop2.bind(this);

    this.toggleDrop3 = this.toggleDrop3.bind(this);
    this.changeValueDrop3 = this.changeValueDrop3.bind(this);

    this.state = {
        user: [],
        name: "",
        about: "",
        address: "",
        birth_date: "",
        city: "",
        country: "",
        promotor_name: "",
        first_name: "",
        last_name: "",
        postal_code: "",
        profession: "",
        telephone: "",
        work_institution: "",
        dropDown1Value: "Date/Hour",
        dropdownIndex:"between",
        dropDown1Open: false,
        dropDown2Value: "Date/Hour",
        dropdown2Index:"between",
        dropDown2Open: false,
        dropDown3Value: "Date/Hour",
        dropdown3Index:"between",
        dropDown3Open: false,

    }
    this.handleChange = this.handleChange.bind(this);

   }

  getData = async () => {
      try {
           const response = await fetch(
              `/hom`
          );

          const result = await response.json();
          this.setState(
              prevState => (
                  {
                      name: result["name"],
                      promotor_name:result["promotor_name"],
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
      fetch('/update_use', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({

          name: this.state.name,
          last_promotor_name:this.state.promotor_name,
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

 /* DropDown functions */
  toggleDrop1() {
    this.setState({dropDown1Open: !this.state.dropDown1Open});
  }

  toggleDrop2() {
      this.setState({dropDown2Open: !this.state.dropDown2Open});
  }

  toggleDrop3() {
      this.setState({dropDown3Open: !this.state.dropDown3Open});
  }

  changeValueDrop1(e,id) {

      const a = ["","between","cars","people","injured","severity","status"]
      this.state.dropDown1Value= e.currentTarget.textContent
      this.state.dropdownIndex= `${a[id]}`
      this.getData(this.state.curent_page)
  }

  changeValueDrop2(e,id) {
      this.state.dropDown2Value= e.currentTarget.textContent
      this.state.dropdownIndex2= `${id}`
      this.getData(this.state.curent_page)

  }

  changeValueDrop3(e,id) {
      this.state.dropDown3Value= e.currentTarget.textContent
      this.state.dropdownIndex3= `${id}`
      this.getData(this.state.curent_page)
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
                      <h3 className="mb-0">Create Event</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">

                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-name"
                            >
                              Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-name"
                              placeholder={this.state.name}
                              type="text"
                              name="name"
                              value={this.state.name}
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-promotor_name"
                            >
                              Promotor name
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-promotor_name"
                              name = "promotor_name"
                              placeholder={this.state.promotor_name}
                              type="promotor_name"

                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="2">
                          <h5 className="form-control-label">Sort by: </h5>
                          <ButtonDropdown isOpen={this.state.dropDown1Open} toggle={this.toggleDrop1}>
                          <DropdownToggle caret>
                            {this.state.dropDown1Value}
                          </DropdownToggle>
                          <DropdownMenu right>
                            <DropdownItem onClick={(e)=>this.changeValueDrop1(e,1)}>Budget</DropdownItem>
                            <DropdownItem onClick={(e)=>this.changeValueDrop1(e,2)}>Date/Hour</DropdownItem>
                            <DropdownItem onClick={(e)=>this.changeValueDrop1(e,3)}>Name</DropdownItem>
                            <DropdownItem onClick={(e)=>this.changeValueDrop1(e,4)}>Staff</DropdownItem>
                            <DropdownItem onClick={(e)=>this.changeValueDrop1(e,5)}>Status</DropdownItem>
                            <DropdownItem onClick={(e)=>this.changeValueDrop1(e,6)}>Tickets</DropdownItem>
                          </DropdownMenu>
                        </ButtonDropdown>
                        </Col>
                        <Col lg="2">
                          <h5 className="form-control-label">Sort by: </h5>
                          <ButtonDropdown isOpen={this.state.dropDown2Open} toggle={this.toggleDrop2}>
                          <DropdownToggle caret>
                            {this.state.dropDown2Value}
                          </DropdownToggle>
                          <DropdownMenu right>
                            <DropdownItem onClick={(e)=>this.changeValueDrop2(e,1)}>Budget</DropdownItem>
                            <DropdownItem onClick={(e)=>this.changeValueDrop2(e,2)}>Date/Hour</DropdownItem>
                            <DropdownItem onClick={(e)=>this.changeValueDrop2(e,3)}>Name</DropdownItem>
                            <DropdownItem onClick={(e)=>this.changeValueDrop2(e,4)}>Staff</DropdownItem>
                            <DropdownItem onClick={(e)=>this.changeValueDrop2(e,5)}>Status</DropdownItem>
                            <DropdownItem onClick={(e)=>this.changeValueDrop2(e,6)}>Tickets</DropdownItem>
                          </DropdownMenu>
                        </ButtonDropdown>
                        </Col>
                        <Col lg="2">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="dateofbirth"
                            >
                             Start Date
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
                        <Col lg="2">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="dateofbirth"
                            >
                             Start Time
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="dateofbirth"
                              type="time"
                              name="birth_date"
                              value={this.state.birth_date}
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="2">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="dateofbirth"
                            >
                             End Date
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
                        <Col lg="2">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="dateofbirth"
                            >
                             End Time
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="dateofbirth"
                              type="time"
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
                              htmlFor="input-name"
                            >
                              Work Institution
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-name"
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
                              htmlFor="input-promotor_name"
                            >
                              Profession
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-promotor_name"
                              placeholder={this.state.profession}
                              value={this.state.profession}
                              onChange={this.handleChange}
                              type="promotor_name"
                              name="profession"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Description */}
                    <h6 className="heading-small text-muted mb-4">About the event</h6>
                    <div className="pl-lg-4">
                      <FormGroup>
                        <label>About Me</label>
                        <Input
                          className="form-control-alternative"
                          placeholder="A few words about your event ..."
                          rows="4"
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
                          Create
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

export default Create_event;
