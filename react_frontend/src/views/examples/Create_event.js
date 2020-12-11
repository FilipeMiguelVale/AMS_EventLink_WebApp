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
    ButtonDropdown,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Form,
    FormGroup,
    Input,
    Row
} from "reactstrap";
// core components
import UserHeader from "../../components/Headers/UserHeader.js";

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
            start_date: "",
            start_time: "",
            end_date: "",
            end_time: "",
            city: "",
            country: "Portugal",
            promotor_name: "",
            postal_code: "",
            profession: "",
            telephone: "",
            vat: "",
            work_institution: "",
            dropDown1Value: "-",
            dropdownIndex: "between",
            dropDown1Open: false,
            dropDown2Value: "-",
            dropdown2Index: "between",
            dropDown2Open: false,
            dropDown3Value: "-",
            dropdown3Index: "between",
            dropDown3Open: false,
            ticketline: false,
            sound: false,
            light: false,
            video: false,
            space: false,
            catering: false,
            ticket_price: "",
            ticket_lotation: ""


        }
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(event) {
        const target = event.target;
        var value = target.value;
        const name = target.name;

        if (target.type == "checkbox")
            value = !this.state[name];
        console.log("value " + value)
        console.log("name " + name)
        console.log("type " + target.type)
        this.setState({

            [name]: value
        });
    }

    onSaveChanges = () => {
        fetch('/create_event', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({

                name: this.state.name,
                last_promotor_name: this.state.promotor_name,
                about: this.state.about,
                address: this.state.address,
                start_date: this.state.start_date,
                start_time: this.state.start_time,
                end_date: this.state.end_date,
                end_time: this.state.end_time,
                country: this.state.country,
                postal_code: this.state.postal_code,
                profession: this.state.profession,
                telephone: this.state.telephone,
                work_institution: this.state.work_institution,
                city: this.state.city,
                promotor_name: this.state.promotor_name,
                vat: this.state.vat,
                dropDown1Value: this.state.dropDown1Value,
                dropDown2Value: this.state.dropDown2Value,
                dropDown3Value: this.state.dropDown3Value,
                ticketline: this.state.ticketline,
                sound: this.state.sound,
                light: this.state.light,
                video: this.state.video,
                space: this.state.space,
                catering: this.state.catering,
                ticket_price: this.state.ticket_price,
                ticket_lotation: this.state.ticket_lotation
            }),
        }).then(res => res.json())
            .then(
                (result) => {
                    if (result['response'] == "Done")
                        this.props.history.push("/admin/events");
                    else {
                        this.setState({error: result['error']});

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

    changeValueDrop1(e, id) {

        const a = ["", "between", "cars", "people", "injured", "severity", "status"]
        this.state.dropDown1Value = e.currentTarget.textContent
        this.state.dropdownIndex = `${a[id]}`
    }

    changeValueDrop2(e, id) {
        this.state.dropDown2Value = e.currentTarget.textContent
        this.state.dropdownIndex2 = `${id}`

    }

    changeValueDrop3(e, id) {
        this.state.dropDown3Value = e.currentTarget.textContent
        this.state.dropdownIndex3 = `${id}`
    }

    render() {
        return (
            <>
                <UserHeader/>
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
                                        <h6 className="heading-small text-muted mb-4"> Event Info</h6>
                                        <div className="pl-lg-4">
                                            <Row>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-name">
                                                            Name
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-name"
                                                            placeholder="Event Name"
                                                            type="text"
                                                            name="name"
                                                            required
                                                            value={this.state.name}
                                                            onChange={this.handleChange}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="2" md="4">
                                                    <h5 className="form-control-label">Type</h5>
                                                    <ButtonDropdown isOpen={this.state.dropDown1Open}
                                                                    toggle={this.toggleDrop1}>
                                                        <DropdownToggle caret>
                                                            {this.state.dropDown1Value}
                                                        </DropdownToggle>
                                                        <DropdownMenu right>
                                                            <DropdownItem
                                                                onClick={(e) => this.changeValueDrop1(e, 1)}>Activations</DropdownItem>
                                                            <DropdownItem
                                                                onClick={(e) => this.changeValueDrop1(e, 2)}>Birthday</DropdownItem>
                                                            <DropdownItem
                                                                onClick={(e) => this.changeValueDrop1(e, 3)}>Conferences</DropdownItem>
                                                            <DropdownItem
                                                                onClick={(e) => this.changeValueDrop1(e, 4)}>Corporative</DropdownItem>
                                                            <DropdownItem
                                                                onClick={(e) => this.changeValueDrop1(e, 5)}>Expos</DropdownItem>
                                                            <DropdownItem
                                                                onClick={(e) => this.changeValueDrop1(e, 6)}>Festival</DropdownItem>
                                                            <DropdownItem
                                                                onClick={(e) => this.changeValueDrop1(e, 7)}>Galas</DropdownItem>
                                                            <DropdownItem onClick={(e) => this.changeValueDrop1(e, 8)}>Job
                                                                Fair</DropdownItem>
                                                            <DropdownItem
                                                                onClick={(e) => this.changeValueDrop1(e, 9)}>Seminars</DropdownItem>
                                                            <DropdownItem onClick={(e) => this.changeValueDrop1(e, 10)}>VIP
                                                                Events</DropdownItem>
                                                        </DropdownMenu>
                                                    </ButtonDropdown>
                                                </Col>
                                                <Col lg="2" md="4">
                                                    <h5 className="form-control-label">Sort by: </h5>
                                                    <ButtonDropdown isOpen={this.state.dropDown2Open}
                                                                    toggle={this.toggleDrop2}>
                                                        <DropdownToggle caret>
                                                            {this.state.dropDown2Value}
                                                        </DropdownToggle>
                                                        <DropdownMenu right>
                                                            <DropdownItem
                                                                onClick={(e) => this.changeValueDrop2(e, 1)}>Budget</DropdownItem>
                                                            <DropdownItem
                                                                onClick={(e) => this.changeValueDrop2(e, 2)}>Date/Hour</DropdownItem>
                                                            <DropdownItem
                                                                onClick={(e) => this.changeValueDrop2(e, 3)}>Name</DropdownItem>
                                                            <DropdownItem
                                                                onClick={(e) => this.changeValueDrop2(e, 4)}>Staff</DropdownItem>
                                                            <DropdownItem
                                                                onClick={(e) => this.changeValueDrop2(e, 5)}>Status</DropdownItem>
                                                            <DropdownItem
                                                                onClick={(e) => this.changeValueDrop2(e, 6)}>Tickets</DropdownItem>
                                                        </DropdownMenu>
                                                    </ButtonDropdown>
                                                </Col>
                                                <Col lg="2" md="4">
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
                                                            name="start_date"
                                                            value={this.state.start_date}
                                                            onChange={this.handleChange}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="2" md="4">
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
                                                            name="start_time"
                                                            value={this.state.start_time}
                                                            onChange={this.handleChange}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="2" md="4">
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
                                                            name="end_date"
                                                            value={this.state.end_date}
                                                            onChange={this.handleChange}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="2" md="4">
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
                                                            name="end_time"
                                                            value={this.state.end_time}
                                                            onChange={this.handleChange}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="2">
                                                    <h5 className="form-control-label">Ticketline: </h5>
                                                    <label className="custom-toggle">
                                                        <input type="checkbox"
                                                               name="ticketline"
                                                               value={this.state.ticketline}
                                                               onChange={this.handleChange}/>
                                                        <span className="custom-toggle-slider rounded-circle"/>
                                                    </label>
                                                </Col>
                                                <Col lg="2">
                                                    <h5 className="form-control-label">Sound: </h5>
                                                    <label className="custom-toggle">
                                                        <input type="checkbox"
                                                               name="sound"
                                                               value={this.state.sound}
                                                               onChange={this.handleChange}/>
                                                        <span className="custom-toggle-slider rounded-circle"/>
                                                    </label>
                                                </Col>
                                                <Col lg="2">
                                                    <h5 className="form-control-label">Light: </h5>
                                                    <label className="custom-toggle">
                                                        <input type="checkbox"
                                                               name="light"
                                                               value={this.state.light}
                                                               onChange={this.handleChange}/>
                                                        <span className="custom-toggle-slider rounded-circle"/>
                                                    </label>
                                                </Col>
                                                <Col lg="2">
                                                    <h5 className="form-control-label">Video: </h5>
                                                    <label className="custom-toggle">
                                                        <input type="checkbox"
                                                               name="video"
                                                               value={this.state.video}
                                                               onChange={this.handleChange}/>
                                                        <span className="custom-toggle-slider rounded-circle"/>
                                                    </label>
                                                </Col>
                                                <Col lg="2">
                                                    <h5 className="form-control-label">Space: </h5>
                                                    <label className="custom-toggle">
                                                        <input type="checkbox"
                                                               name="space"
                                                               value={this.state.space}
                                                               onChange={this.handleChange}/>
                                                        <span className="custom-toggle-slider rounded-circle"/>
                                                    </label>
                                                </Col>
                                                <Col lg="2">
                                                    <h5 className="form-control-label">Catering: </h5>
                                                    <label className="custom-toggle">
                                                        <input type="checkbox"
                                                               name="catering"
                                                               value={this.state.catering}
                                                               onChange={this.handleChange}/>
                                                        <span className="custom-toggle-slider rounded-circle"/>
                                                    </label>
                                                </Col>
                                            </Row>
                                        </div>
                                        <hr className="my-4"/>
                                        {/* Institution Info */}
                                        {this.state.ticketline == true && (
                                            <h6 className="heading-small text-muted mb-4">Ticketline</h6>)}
                                        {this.state.ticketline == true && (<div className="pl-lg-4">
                                            <Row>
                                                <Col lg="4">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-promotor_name"
                                                        >
                                                            Ticket Price
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-promotor_name"
                                                            name="ticket_price"
                                                            placeholder="ticket_price"
                                                            type="number"
                                                            value={this.state.ticket_price}
                                                            onChange={this.handleChange}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="4">
                                                    <FormGroup>

                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-promotor_name"
                                                        >
                                                            Tickets Available
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-promotor_name"
                                                            name="ticket_lotation"
                                                            placeholder="Tickets Available"
                                                            type="number"
                                                            value={this.state.ticket_lotation}
                                                            onChange={this.handleChange}
                                                            startAdornment={
                                                                <i className="fas fa-euro-sign"/>
                                                            }
                                                        />
                                                        {/*<InputGroupAddon addonType="append"*/}
                                                        {/*                 className="form-control-alternative">*/}
                                                        {/*    <InputGroupText className="form-control-alternative">*/}
                                                        {/*        <i className="fas fa-euro-sign"/>*/}
                                                        {/*    </InputGroupText>*/}
                                                        {/*</InputGroupAddon>*/}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </div>)}
                                        {this.state.ticketline == true && (<hr className="my-4"/>)}
                                        {/* Address */}
                                        <h6 className="heading-small text-muted mb-4">Contact information</h6>
                                        <div className="pl-lg-4">
                                            <Row>
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
                                                            name="promotor_name"
                                                            placeholder="Promotor Name"
                                                            type="promotor_name"
                                                            value={this.state.promotor_name}
                                                            onChange={this.handleChange}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="6">
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
                                                            placeholder="Address"
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
                                                            placeholder="City"
                                                            type="text"
                                                            value={this.state.city}
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
                                                            Country
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            defaultValue="Portugal"
                                                            id="input-country"
                                                            placeholder="Country"
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
                                                            placeholder="Telephone"
                                                            value={this.state.telephone}
                                                            onChange={this.handleChange}
                                                            name="telephone"
                                                            type="number"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="4">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-text"
                                                        >
                                                            VAT
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-vat"
                                                            placeholder="VAT"
                                                            value={this.state.vat}
                                                            onChange={this.handleChange}
                                                            name="vat"
                                                            type="text"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </div>
                                        <hr className="my-4"/>
                                        {/* Description */}
                                        <h6 className="heading-small text-muted mb-4">About the event</h6>
                                        <div className="pl-lg-4">
                                            <FormGroup>
                                                <label>About</label>
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
                                                    onClick={this.onSaveChanges}
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
